/**
 * UK PAYE model for the 2026/27 tax year (England, Wales and Northern Ireland).
 *
 * Scotland sets its own income tax bands and is deliberately out of scope
 * rather than approximated — a wrong number is worse than an absent one.
 *
 * Sources (all GOV.UK, checked against the 2026 to 2027 guidance):
 * - Rates and thresholds for employers 2026 to 2027
 * - Personal Allowance and basic rate limit, 6 April 2026 to 5 April 2028
 * - 2026 to 2027 Student and Postgraduate Loan deduction tables
 */

export const TAX_YEAR = "2026/27";

export const PERSONAL_ALLOWANCE = 12_570;
/** Taxable income taxed at the basic rate, i.e. £12,571–£50,270 of gross. */
export const BASIC_RATE_LIMIT = 37_700;
/** Above this, taxable income is charged at the additional rate. */
export const ADDITIONAL_RATE_LIMIT = 125_140;
/** The Personal Allowance tapers by £1 for every £2 of income above this. */
export const TAPER_THRESHOLD = 100_000;

export const BASIC_RATE = 0.2;
export const HIGHER_RATE = 0.4;
export const ADDITIONAL_RATE = 0.45;

/** Class 1 employee NI: aligned to the Personal Allowance and higher-rate threshold. */
export const NI_PRIMARY_THRESHOLD = 12_570;
export const NI_UPPER_EARNINGS_LIMIT = 50_270;
export const NI_MAIN_RATE = 0.08;
export const NI_UPPER_RATE = 0.02;

/** Class 1 employer (secondary) NI — what an umbrella or your own company pays. */
export const NI_SECONDARY_THRESHOLD = 5_000;
export const NI_EMPLOYER_RATE = 0.15;
/**
 * Not available to a company whose only employee paid above the secondary
 * threshold is also its sole director, which is the usual contractor setup.
 */
export const EMPLOYMENT_ALLOWANCE = 10_500;

/** Class 4 NI on self-employed profits. Class 2 is treated as paid, so £0. */
export const CLASS4_LOWER_LIMIT = 12_570;
export const CLASS4_UPPER_LIMIT = 50_270;
export const CLASS4_MAIN_RATE = 0.06;
export const CLASS4_UPPER_RATE = 0.02;

/** Dividend tax. The basic and higher rates each rose 2pp for 2026/27. */
export const DIVIDEND_ALLOWANCE = 500;
export const DIVIDEND_BASIC_RATE = 0.1075;
export const DIVIDEND_HIGHER_RATE = 0.3575;
export const DIVIDEND_ADDITIONAL_RATE = 0.3935;

/** Corporation tax, with marginal relief between the two limits. */
export const CT_SMALL_PROFITS_LIMIT = 50_000;
export const CT_MAIN_RATE_LIMIT = 250_000;
export const CT_SMALL_RATE = 0.19;
export const CT_MAIN_RATE = 0.25;
/** The standard fraction; 25% less 3/200 relief lands exactly on 19% at £50k. */
export const CT_MARGINAL_RELIEF_FRACTION = 3 / 200;

export type StudentLoanPlan = "none" | "plan1" | "plan2" | "plan4" | "plan5" | "pgl";

interface LoanPlan {
  label: string;
  threshold: number;
  rate: number;
}

export const STUDENT_LOAN_PLANS: Record<Exclude<StudentLoanPlan, "none">, LoanPlan> = {
  plan1: { label: "Plan 1", threshold: 26_900, rate: 0.09 },
  plan2: { label: "Plan 2", threshold: 29_385, rate: 0.09 },
  plan4: { label: "Plan 4 (Scotland)", threshold: 33_795, rate: 0.09 },
  plan5: { label: "Plan 5", threshold: 25_000, rate: 0.09 },
  pgl: { label: "Postgraduate", threshold: 21_000, rate: 0.06 },
};

export interface TakeHomeInput {
  /** Gross annual salary before any deduction. */
  gross: number;
  /**
   * Employee pension contribution as a percent of *salary*. Bonuses and
   * vesting shares are excluded, which is how nearly every UK scheme works —
   * contributing 5% of an RSU vest would overstate both the pot and the relief.
   */
  pensionPct: number;
  /**
   * Salary sacrifice reduces gross for both income tax and NI. "Relief at
   * source" (the default for most workplace schemes) reduces income tax only.
   */
  pensionMethod: "sacrifice" | "relief";
  studentLoan: StudentLoanPlan;
  /** Untaxed cash on top of salary, e.g. an annual bonus. Taxed as earnings. */
  bonus: number;
}

export interface TakeHomeResult {
  gross: number;
  /** Earnings after any salary sacrifice — the base for tax and NI. */
  taxableGross: number;
  pension: number;
  personalAllowance: number;
  incomeTax: number;
  nationalInsurance: number;
  studentLoan: number;
  net: number;
  /** Total deductions, pension included, as a share of gross. */
  effectiveRate: number;
  /**
   * Tax, NI and student loan on the next £1 of gross. Pension is excluded on
   * purpose — it is deferred income, not a deduction, and folding it in would
   * disguise the thing this number exists to show (the 60% taper band).
   */
  marginalRate: number;
}

/** The Personal Allowance tapers away entirely by £125,140. */
export function personalAllowanceFor(income: number): number {
  if (income <= TAPER_THRESHOLD) return PERSONAL_ALLOWANCE;
  const lost = (income - TAPER_THRESHOLD) / 2;
  return Math.max(PERSONAL_ALLOWANCE - lost, 0);
}

export function incomeTaxOn(income: number): number {
  const allowance = personalAllowanceFor(income);
  const taxable = Math.max(income - allowance, 0);

  const basic = Math.min(taxable, BASIC_RATE_LIMIT);
  const higher = Math.min(
    Math.max(taxable - BASIC_RATE_LIMIT, 0),
    ADDITIONAL_RATE_LIMIT - BASIC_RATE_LIMIT,
  );
  const additional = Math.max(taxable - ADDITIONAL_RATE_LIMIT, 0);

  return basic * BASIC_RATE + higher * HIGHER_RATE + additional * ADDITIONAL_RATE;
}

export function nationalInsuranceOn(earnings: number): number {
  const main =
    Math.min(Math.max(earnings - NI_PRIMARY_THRESHOLD, 0), NI_UPPER_EARNINGS_LIMIT - NI_PRIMARY_THRESHOLD) *
    NI_MAIN_RATE;
  const upper = Math.max(earnings - NI_UPPER_EARNINGS_LIMIT, 0) * NI_UPPER_RATE;
  return main + upper;
}

export function employerNiOn(salary: number, employmentAllowance = 0): number {
  const raw = Math.max(salary - NI_SECONDARY_THRESHOLD, 0) * NI_EMPLOYER_RATE;
  return Math.max(raw - employmentAllowance, 0);
}

export function class4On(profit: number): number {
  const main =
    Math.min(
      Math.max(profit - CLASS4_LOWER_LIMIT, 0),
      CLASS4_UPPER_LIMIT - CLASS4_LOWER_LIMIT,
    ) * CLASS4_MAIN_RATE;
  const upper = Math.max(profit - CLASS4_UPPER_LIMIT, 0) * CLASS4_UPPER_RATE;
  return main + upper;
}

export function corporationTaxOn(profit: number): number {
  if (profit <= 0) return 0;
  if (profit <= CT_SMALL_PROFITS_LIMIT) return profit * CT_SMALL_RATE;
  if (profit >= CT_MAIN_RATE_LIMIT) return profit * CT_MAIN_RATE;
  // Between the limits: main rate less marginal relief, which works out at a
  // 26.5% marginal rate on the slice — higher than the headline 25%.
  const relief = CT_MARGINAL_RELIEF_FRACTION * (CT_MAIN_RATE_LIMIT - profit);
  return profit * CT_MAIN_RATE - relief;
}

/**
 * Dividends sit on top of everything else, so the band they fall into depends
 * on the non-dividend income underneath them. The allowance is tax-free but
 * still consumes band, which is why it is added back before slicing.
 */
export function dividendTaxOn(dividends: number, otherIncome: number): number {
  if (dividends <= 0) return 0;

  const allowance = personalAllowanceFor(otherIncome + dividends);
  const otherTaxable = Math.max(otherIncome - allowance, 0);
  // Any unused Personal Allowance is soaked up by dividends first.
  const unusedAllowance = Math.max(allowance - otherIncome, 0);
  const taxableDividends = Math.max(dividends - unusedAllowance, 0);
  if (taxableDividends <= 0) return 0;

  const free = Math.min(taxableDividends, DIVIDEND_ALLOWANCE);
  let remaining = taxableDividends - free;
  // The allowance uses up band even though it is charged at nothing.
  let position = otherTaxable + free;
  let tax = 0;

  const take = (ceiling: number, rate: number) => {
    const room = Math.max(ceiling - position, 0);
    const slice = Math.min(remaining, room);
    tax += slice * rate;
    remaining -= slice;
    position += slice;
  };

  take(BASIC_RATE_LIMIT, DIVIDEND_BASIC_RATE);
  take(ADDITIONAL_RATE_LIMIT, DIVIDEND_HIGHER_RATE);
  tax += remaining * DIVIDEND_ADDITIONAL_RATE;

  return tax;
}

export function studentLoanOn(earnings: number, plan: StudentLoanPlan): number {
  if (plan === "none") return 0;
  const { threshold, rate } = STUDENT_LOAN_PLANS[plan];
  // Repayments are assessed per pay period, and the deduction itself is
  // rounded down to a whole pound — so annualise the monthly figure rather
  // than taking 9% of the annual excess, which overstates it slightly.
  //
  // Settle to whole pence before flooring: in binary a repayment of exactly
  // £145 evaluates to 144.999…, which would otherwise floor to £144.
  const pence = Math.round((Math.max(earnings - threshold, 0) / 12) * rate * 100);
  return Math.floor(pence / 100) * 12;
}

export function takeHome(input: TakeHomeInput): TakeHomeResult {
  const salary = Math.max(input.gross, 0);
  const gross = salary + Math.max(input.bonus, 0);
  const pension = salary * (Math.max(input.pensionPct, 0) / 100);

  const sacrificing = input.pensionMethod === "sacrifice";
  // Salary sacrifice lowers the earnings figure for both taxes; relief at
  // source only lowers the income-tax base, so NI is still charged on the lot.
  const taxableGross = sacrificing ? gross - pension : gross;
  const incomeTaxBase = gross - pension;

  const incomeTax = incomeTaxOn(incomeTaxBase);
  const nationalInsurance = nationalInsuranceOn(taxableGross);
  const loan = studentLoanOn(taxableGross, input.studentLoan);

  const net = gross - pension - incomeTax - nationalInsurance - loan;

  return {
    gross,
    taxableGross,
    pension,
    personalAllowance: personalAllowanceFor(incomeTaxBase),
    incomeTax,
    nationalInsurance,
    studentLoan: loan,
    net,
    effectiveRate: gross > 0 ? (gross - net) / gross : 0,
    marginalRate: marginalRateAt(gross, input),
  };
}

/**
 * Tax charged on the next £1, measured rather than derived from the bands, so
 * the taper and every threshold fall out of the model instead of being
 * special-cased. A sacrificed pension still lowers the base it is charged on.
 */
function marginalRateAt(total: number, input: TakeHomeInput): number {
  if (total <= 0) return 0;
  const step = 1;
  const chargedAt = (value: number) => {
    // The extra pound is salary, so it attracts the pension percentage too.
    const pension = (value - input.bonus) * (Math.max(input.pensionPct, 0) / 100);
    const taxableGross =
      input.pensionMethod === "sacrifice" ? value - pension : value;
    return (
      incomeTaxOn(value - pension) +
      nationalInsuranceOn(taxableGross) +
      studentLoanOn(taxableGross, input.studentLoan)
    );
  };
  return (chargedAt(total + step) - chargedAt(total)) / step;
}
