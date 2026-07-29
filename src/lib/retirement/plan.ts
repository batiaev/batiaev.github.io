import { incomeTaxOn } from "@/lib/tax/uk";

/**
 * Monte Carlo retirement planning across UK wrappers.
 *
 * Everything is in today's money. Returns are real — net of inflation — so a
 * spending figure entered now means the same standard of living in thirty
 * years, and there is no second inflation assumption quietly compounding
 * against the first. That is the single most important simplification here and
 * the one most calculators get wrong by showing you a large nominal number.
 *
 * The wrappers are modelled separately because their access ages differ, and
 * for anyone retiring before the pension unlocks that difference decides the
 * answer. A plan can be comfortably funded in aggregate and still fail because
 * the money is in the wrong pot for the years it is needed.
 */

export const ISA_ANNUAL_LIMIT = 20_000;
export const LISA_ANNUAL_LIMIT = 4_000;
export const LISA_BONUS_RATE = 0.25;
/** LISA cannot be drawn without penalty before this age. */
export const LISA_ACCESS_AGE = 60;
/** The normal minimum pension age from 2028. */
export const PENSION_ACCESS_AGE = 57;
/** Share of a pension pot that can be taken free of income tax. */
export const PENSION_TAX_FREE_SHARE = 0.25;

export interface PlanInput {
  currentAge: number;
  retireAge: number;
  /** Age the plan has to last to — the point success is measured at. */
  planToAge: number;

  isaBalance: number;
  lisaBalance: number;
  pensionBalance: number;

  /** Annual contributions while working, in today's money. */
  isaContribution: number;
  lisaContribution: number;
  /** Personal contribution before tax relief; relief is added on top. */
  pensionContribution: number;
  /** Employer contribution, which attracts no personal relief. */
  employerContribution: number;
  /** Marginal rate claimed back on personal pension contributions. */
  pensionReliefRate: number;

  /** Annual spending in retirement, in today's money, after tax. */
  spending: number;
  /** Any guaranteed real income from the state or a DB scheme. */
  otherIncome: number;
  /** Age the guaranteed income starts. */
  otherIncomeAge: number;

  /** Expected real return, annualised. */
  realReturn: number;
  /** Annualised volatility of that return. */
  volatility: number;
  /** Platform and fund charges, taken off the return. */
  fees: number;

  paths: number;
  seed: number;
}

export interface YearPercentiles {
  age: number;
  p10: number;
  p25: number;
  median: number;
  p75: number;
  p90: number;
}

export interface PlanResult {
  /** Net worth by age, as percentiles across all paths. */
  band: YearPercentiles[];
  /** Share of paths that funded the plan all the way to `planToAge`. */
  successRate: number;
  /** Median age at which the failing paths ran out. */
  medianRuinAge: number | null;
  /** Median pot at retirement, across all paths. */
  medianAtRetirement: number;
  /** Spending the median path could have sustained to `planToAge`. */
  sustainableSpend: number;
  /** Contributions paid in over the whole accumulation, including relief. */
  totalContributed: number;
}

/** Longest plan worth simulating; beyond this the inputs are a typo. */
const MAX_YEARS = 120;
const MAX_PATHS = 5_000;

function finite(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

/**
 * Makes a half-typed form safe to simulate.
 *
 * Every field here is driven by a text input, so a cleared box or a stray
 * minus sign reaches this function as NaN. Left alone that propagates into the
 * percentile bands and takes the chart down with it — a blank plan should
 * produce a boring answer, not a broken page.
 */
function sanitise(input: PlanInput): PlanInput {
  const currentAge = Math.max(finite(input.currentAge, 0), 0);
  const planToAge = Math.min(
    Math.max(finite(input.planToAge, currentAge), currentAge),
    currentAge + MAX_YEARS,
  );

  return {
    ...input,
    currentAge,
    planToAge,
    retireAge: Math.max(finite(input.retireAge, currentAge), currentAge),
    isaBalance: Math.max(finite(input.isaBalance, 0), 0),
    lisaBalance: Math.max(finite(input.lisaBalance, 0), 0),
    pensionBalance: Math.max(finite(input.pensionBalance, 0), 0),
    isaContribution: Math.max(finite(input.isaContribution, 0), 0),
    lisaContribution: Math.max(finite(input.lisaContribution, 0), 0),
    pensionContribution: Math.max(finite(input.pensionContribution, 0), 0),
    employerContribution: Math.max(finite(input.employerContribution, 0), 0),
    pensionReliefRate: Math.min(Math.max(finite(input.pensionReliefRate, 0), 0), 0.9),
    spending: Math.max(finite(input.spending, 0), 0),
    otherIncome: Math.max(finite(input.otherIncome, 0), 0),
    otherIncomeAge: Math.max(finite(input.otherIncomeAge, currentAge), 0),
    realReturn: finite(input.realReturn, 0),
    volatility: Math.max(finite(input.volatility, 0), 0),
    fees: Math.max(finite(input.fees, 0), 0),
    paths: Math.min(Math.max(Math.round(finite(input.paths, 1)), 1), MAX_PATHS),
    seed: Math.round(finite(input.seed, 1)),
  };
}

/** Deterministic across browsers, unlike `Math.random`. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(random: () => number): number {
  let u = 0;
  while (u === 0) u = random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const index = (sorted.length - 1) * p;
  const low = Math.floor(index);
  const high = Math.ceil(index);
  if (low === high) return sorted[low];
  return sorted[low] + (sorted[high] - sorted[low]) * (index - low);
}

interface Pots {
  isa: number;
  lisa: number;
  pension: number;
}

/**
 * Draws `needed` of after-tax spending from the pots, cheapest tax first.
 *
 * Order matters and is not arbitrary: ISA comes first because it is always
 * accessible and never taxed, LISA unlocks at 60, and the pension is last
 * because every pound beyond the tax-free share is charged as income. Drawing
 * the pension first is the most common way to pay tax you did not have to.
 */
function withdraw(pots: Pots, needed: number, age: number): number {
  let outstanding = needed;

  const takeFrom = (available: number, want: number) => Math.min(available, want);

  const fromIsa = takeFrom(pots.isa, outstanding);
  pots.isa -= fromIsa;
  outstanding -= fromIsa;

  if (outstanding > 0 && age >= LISA_ACCESS_AGE) {
    const fromLisa = takeFrom(pots.lisa, outstanding);
    pots.lisa -= fromLisa;
    outstanding -= fromLisa;
  }

  if (outstanding > 0 && age >= PENSION_ACCESS_AGE && pots.pension > 0) {
    // Gross up so that what lands after income tax is what was asked for. The
    // tax-free share makes the effective rate lower than the headline band.
    let gross = outstanding;
    for (let i = 0; i < 40; i += 1) {
      const taxable = gross * (1 - PENSION_TAX_FREE_SHARE);
      const net = gross - incomeTaxOn(taxable);
      const error = net - outstanding;
      if (Math.abs(error) < 0.01) break;
      // Net rises monotonically in gross, so a damped step converges quickly.
      gross += error < 0 ? -error * 1.3 : -error;
      if (gross < 0) gross = 0;
    }
    const drawn = takeFrom(pots.pension, gross);
    pots.pension -= drawn;
    const taxable = drawn * (1 - PENSION_TAX_FREE_SHARE);
    outstanding -= drawn - incomeTaxOn(taxable);
  }

  return outstanding;
}

/**
 * Runs the plan `paths` times and summarises the distribution.
 *
 * Each path is a fresh sequence of annual real returns, which is the whole
 * point: two paths with the same average return but a bad decade at the wrong
 * end produce very different answers. That is sequence risk, and it is the
 * reason an average-return spreadsheet flatters a plan.
 */
export function simulatePlan(raw: PlanInput): PlanResult {
  const input = sanitise(raw);
  const {
    currentAge,
    retireAge,
    planToAge,
    realReturn,
    volatility,
    fees,
    paths,
    seed,
  } = input;

  const years = Math.max(0, Math.round(planToAge - currentAge));
  const random = mulberry32(seed);
  const drift = realReturn - fees;

  // byYear[y] collects every path's net worth at that offset, so percentiles
  // can be taken down the columns afterwards.
  const byYear: number[][] = Array.from({ length: years + 1 }, () => []);
  const ruinAges: number[] = [];
  const atRetirement: number[] = [];
  let survived = 0;

  const lisaContribution = Math.min(input.lisaContribution, LISA_ANNUAL_LIMIT);
  const isaContribution = Math.min(
    input.isaContribution,
    Math.max(ISA_ANNUAL_LIMIT - lisaContribution, 0),
  );
  const pensionIn =
    input.pensionContribution / Math.max(1 - input.pensionReliefRate, 0.01);

  for (let path = 0; path < paths; path += 1) {
    const pots: Pots = {
      isa: input.isaBalance,
      lisa: input.lisaBalance,
      pension: input.pensionBalance,
    };
    let ruinAge: number | null = null;

    byYear[0].push(pots.isa + pots.lisa + pots.pension);

    for (let y = 1; y <= years; y += 1) {
      const age = currentAge + y;

      // Growth first, on last year's balance.
      const shock = gaussian(random);
      const growth = Math.exp(
        drift - (volatility * volatility) / 2 + volatility * shock,
      );
      pots.isa *= growth;
      pots.lisa *= growth;
      pots.pension *= growth;

      if (age <= retireAge) {
        pots.isa += isaContribution;
        pots.lisa += lisaContribution * (1 + LISA_BONUS_RATE);
        pots.pension += pensionIn + input.employerContribution;
      } else {
        const guaranteed = age >= input.otherIncomeAge ? input.otherIncome : 0;
        const needed = Math.max(input.spending - guaranteed, 0);
        const shortfall = withdraw(pots, needed, age);
        if (shortfall > 0.01 && ruinAge === null) ruinAge = age;
      }

      if (age === retireAge) {
        atRetirement.push(pots.isa + pots.lisa + pots.pension);
      }

      byYear[y].push(Math.max(pots.isa + pots.lisa + pots.pension, 0));
    }

    if (ruinAge === null) survived += 1;
    else ruinAges.push(ruinAge);
  }

  const band: YearPercentiles[] = byYear.map((column, y) => {
    const sorted = [...column].sort((a, b) => a - b);
    return {
      age: currentAge + y,
      p10: percentile(sorted, 0.1),
      p25: percentile(sorted, 0.25),
      median: percentile(sorted, 0.5),
      p75: percentile(sorted, 0.75),
      p90: percentile(sorted, 0.9),
    };
  });

  const sortedRuin = [...ruinAges].sort((a, b) => a - b);
  const sortedRetirement = [...atRetirement].sort((a, b) => a - b);

  const workingYears = Math.max(retireAge - currentAge, 0);
  const totalContributed =
    workingYears *
    (isaContribution +
      lisaContribution * (1 + LISA_BONUS_RATE) +
      pensionIn +
      input.employerContribution);

  return {
    band,
    successRate: paths > 0 ? survived / paths : 0,
    medianRuinAge: sortedRuin.length > 0 ? percentile(sortedRuin, 0.5) : null,
    medianAtRetirement: percentile(sortedRetirement, 0.5),
    sustainableSpend: findSustainableSpend(input),
    totalContributed,
  };
}

/**
 * The spending level that lands on an 85% chance of lasting to `planToAge`.
 *
 * Bisection on the success rate, which is monotonically decreasing in
 * spending. Reported alongside the headline because "what can I actually
 * spend" is the question behind "will I be alright", and it is the number a
 * plan is usually adjusted with.
 */
export const TARGET_CONFIDENCE = 0.85;

export function findSustainableSpend(raw: PlanInput): number {
  const input = sanitise(raw);
  // A cheaper run: this is a search, and the answer does not need the full
  // path count to be useful to the nearest hundred pounds.
  const probe = { ...input, paths: Math.min(input.paths, 300) };

  const successAt = (spending: number) =>
    successRateFor({ ...probe, spending });

  let low = 0;
  let high = Math.max(input.spending * 3, 20_000);
  if (successAt(high) >= TARGET_CONFIDENCE) return high;

  for (let i = 0; i < 24; i += 1) {
    const mid = (low + high) / 2;
    if (successAt(mid) >= TARGET_CONFIDENCE) low = mid;
    else high = mid;
  }

  return Math.round(low / 100) * 100;
}

/** Success rate only, without building the percentile bands. */
function successRateFor(raw: PlanInput): number {
  const input = sanitise(raw);
  const { currentAge, retireAge, planToAge, realReturn, volatility, fees } =
    input;
  const years = Math.max(0, Math.round(planToAge - currentAge));
  const random = mulberry32(input.seed);
  const drift = realReturn - fees;

  const lisaContribution = Math.min(input.lisaContribution, LISA_ANNUAL_LIMIT);
  const isaContribution = Math.min(
    input.isaContribution,
    Math.max(ISA_ANNUAL_LIMIT - lisaContribution, 0),
  );
  const pensionIn =
    input.pensionContribution / Math.max(1 - input.pensionReliefRate, 0.01);

  let survived = 0;

  for (let path = 0; path < input.paths; path += 1) {
    const pots: Pots = {
      isa: input.isaBalance,
      lisa: input.lisaBalance,
      pension: input.pensionBalance,
    };
    let failed = false;

    for (let y = 1; y <= years; y += 1) {
      const age = currentAge + y;
      const shock = gaussian(random);
      const growth = Math.exp(
        drift - (volatility * volatility) / 2 + volatility * shock,
      );
      pots.isa *= growth;
      pots.lisa *= growth;
      pots.pension *= growth;

      if (age <= retireAge) {
        pots.isa += isaContribution;
        pots.lisa += lisaContribution * (1 + LISA_BONUS_RATE);
        pots.pension += pensionIn + input.employerContribution;
      } else {
        const guaranteed = age >= input.otherIncomeAge ? input.otherIncome : 0;
        const needed = Math.max(input.spending - guaranteed, 0);
        if (withdraw(pots, needed, age) > 0.01) {
          failed = true;
          break;
        }
      }
    }

    if (!failed) survived += 1;
  }

  return input.paths > 0 ? survived / input.paths : 0;
}
