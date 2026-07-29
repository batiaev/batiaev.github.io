/* Properties the retirement simulation has to satisfy. Run: npm run verify:retirement */
import {
  simulatePlan,
  findSustainableSpend,
  LISA_BONUS_RATE,
  PENSION_ACCESS_AGE,
  type PlanInput,
} from "../src/lib/retirement/plan";

let failures = 0;

function check(label: string, ok: boolean, detail = "") {
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `: ${detail}` : ""}`);
}

function near(label: string, actual: number, expected: number, tol: number) {
  check(
    label,
    Math.abs(actual - expected) <= tol,
    `got ${actual.toFixed(2)}, want ${expected.toFixed(2)} ±${tol}`,
  );
}

const base: PlanInput = {
  currentAge: 40,
  retireAge: 60,
  planToAge: 95,
  isaBalance: 150_000,
  lisaBalance: 0,
  pensionBalance: 250_000,
  isaContribution: 12_000,
  lisaContribution: 0,
  pensionContribution: 12_000,
  employerContribution: 8_000,
  pensionReliefRate: 0.4,
  spending: 50_000,
  otherIncome: 0,
  otherIncomeAge: 68,
  realReturn: 0.045,
  volatility: 0.15,
  fees: 0.004,
  paths: 800,
  seed: 1,
};

// --- Determinism -------------------------------------------------------------
const a = simulatePlan(base);
const b = simulatePlan(base);
check("same seed gives the same answer", a.successRate === b.successRate);
check(
  "different seeds give different answers",
  simulatePlan({ ...base, seed: 2 }).successRate !== a.successRate,
);

// --- Shape -------------------------------------------------------------------
check(
  "one band entry per year, inclusive",
  a.band.length === base.planToAge - base.currentAge + 1,
  `got ${a.band.length}`,
);
check("band starts at the current age", a.band[0].age === base.currentAge);
check(
  "band starts at today's net worth",
  Math.abs(a.band[0].median - (base.isaBalance + base.pensionBalance)) < 1,
);
check(
  "percentiles are ordered at every age",
  a.band.every(
    (y) => y.p10 <= y.p25 && y.p25 <= y.median && y.median <= y.p75 && y.p75 <= y.p90,
  ),
);
check("success rate is a probability", a.successRate >= 0 && a.successRate <= 1);

// --- No volatility means no uncertainty --------------------------------------
const flat = simulatePlan({ ...base, volatility: 0, paths: 40 });
check(
  "with no volatility every path is identical",
  flat.band.every((y) => Math.abs(y.p10 - y.p90) < 1e-6),
);
check(
  "and the outcome is all-or-nothing",
  flat.successRate === 0 || flat.successRate === 1,
  `got ${flat.successRate}`,
);

// A deterministic pot with no contributions and no spending must compound
// exactly, which pins the growth arithmetic against a closed form.
const compounding = simulatePlan({
  ...base,
  volatility: 0,
  paths: 1,
  isaBalance: 100_000,
  pensionBalance: 0,
  isaContribution: 0,
  pensionContribution: 0,
  employerContribution: 0,
  retireAge: 200,
  planToAge: 50,
  realReturn: 0.05,
  fees: 0,
});
near(
  "compounds at the stated real return",
  compounding.band[10].median,
  100_000 * Math.exp(0.05 * 10),
  1,
);

// --- Monotonicity: the levers have to pull the right way ---------------------
const rate = (over: Partial<PlanInput>) =>
  simulatePlan({ ...base, ...over }).successRate;

check(
  "spending more makes success less likely",
  rate({ spending: 70_000 }) < a.successRate,
  `${rate({ spending: 70_000 }).toFixed(3)} < ${a.successRate.toFixed(3)}`,
);
check(
  "spending less makes success more likely",
  rate({ spending: 35_000 }) > a.successRate,
);
check(
  "contributing more helps",
  rate({ isaContribution: 20_000 }) > a.successRate,
);
check(
  "retiring later helps",
  rate({ retireAge: 65 }) > a.successRate,
);
check(
  "planning to live longer is harder",
  rate({ planToAge: 105 }) < a.successRate,
);
check(
  "higher fees hurt",
  rate({ fees: 0.015 }) < a.successRate,
);
check(
  "a state pension helps",
  rate({ otherIncome: 12_000 }) > a.successRate,
);

// Volatility with the same mean should not help: it is the sequence risk the
// whole simulation exists to show.
check(
  "more volatility does not improve the odds",
  rate({ volatility: 0.25 }) <= a.successRate,
  `${rate({ volatility: 0.25 }).toFixed(3)} vs ${a.successRate.toFixed(3)}`,
);

// --- Wrappers behave differently ---------------------------------------------
const lisa = simulatePlan({
  ...base,
  isaContribution: 8_000,
  lisaContribution: 4_000,
});
const noLisa = simulatePlan({ ...base, isaContribution: 12_000 });
check(
  "the LISA bonus beats the same money in an ISA",
  lisa.medianAtRetirement > noLisa.medianAtRetirement,
  `${Math.round(lisa.medianAtRetirement)} vs ${Math.round(noLisa.medianAtRetirement)}`,
);
check(
  "the bonus is worth about 25% of the LISA contribution",
  Math.abs(LISA_BONUS_RATE - 0.25) < 1e-9,
);

// Retiring before the pension unlocks must be funded from the ISA, so the same
// total wealth split the wrong way is a worse plan.
const earlyBridged = simulatePlan({
  ...base,
  retireAge: 50,
  isaBalance: 400_000,
  pensionBalance: 0,
  spending: 40_000,
});
const earlyTrapped = simulatePlan({
  ...base,
  retireAge: 50,
  isaBalance: 0,
  pensionBalance: 400_000,
  spending: 40_000,
});
check(
  "money locked in a pension cannot fund early retirement",
  earlyBridged.successRate > earlyTrapped.successRate,
  `${earlyBridged.successRate.toFixed(3)} vs ${earlyTrapped.successRate.toFixed(3)} at 50, pension unlocks at ${PENSION_ACCESS_AGE}`,
);

// --- Pension drawdown is taxed ----------------------------------------------
// The same pot spends further in an ISA than in a pension, because the pension
// pays income tax on three quarters of every withdrawal.
const isaFunded = simulatePlan({
  ...base,
  currentAge: 60,
  retireAge: 60,
  planToAge: 85,
  isaBalance: 800_000,
  pensionBalance: 0,
  volatility: 0,
  paths: 1,
  spending: 45_000,
});
const pensionFunded = simulatePlan({
  ...base,
  currentAge: 60,
  retireAge: 60,
  planToAge: 85,
  isaBalance: 0,
  pensionBalance: 800_000,
  volatility: 0,
  paths: 1,
  spending: 45_000,
});
check(
  "an ISA outlasts a pension of the same size",
  isaFunded.band[25].median > pensionFunded.band[25].median,
  `${Math.round(isaFunded.band[25].median)} vs ${Math.round(pensionFunded.band[25].median)} at 85`,
);

// --- The 4% rule, as a sanity anchor ----------------------------------------
// 25x spending, drawn from a tax-free pot over 30 years at a 5% real return,
// should very nearly always work. If this fails the engine is wrong.
const fourPercent = simulatePlan({
  ...base,
  currentAge: 65,
  retireAge: 65,
  planToAge: 95,
  isaBalance: 1_250_000,
  lisaBalance: 0,
  pensionBalance: 0,
  spending: 50_000,
  realReturn: 0.05,
  volatility: 0.12,
  fees: 0,
  paths: 1_000,
});
check(
  "25x spending survives 30 years in the great majority of paths",
  fourPercent.successRate > 0.85,
  `${(fourPercent.successRate * 100).toFixed(1)}%`,
);

// And an obviously inadequate pot should almost never work.
const tooSmall = simulatePlan({
  ...base,
  currentAge: 65,
  retireAge: 65,
  planToAge: 95,
  isaBalance: 300_000,
  pensionBalance: 0,
  spending: 50_000,
  paths: 500,
});
check(
  "six years of spending does not last thirty",
  tooSmall.successRate < 0.05,
  `${(tooSmall.successRate * 100).toFixed(1)}%`,
);
check(
  "and the failures are reported with a ruin age",
  tooSmall.medianRuinAge !== null && tooSmall.medianRuinAge < base.planToAge,
  `median ruin age ${tooSmall.medianRuinAge}`,
);

// --- Sustainable spend -------------------------------------------------------
const sustainable = findSustainableSpend(base);
check(
  "sustainable spend is a positive number",
  sustainable > 0,
  `£${sustainable.toLocaleString()}`,
);
check(
  "spending at that level clears the confidence target",
  simulatePlan({ ...base, spending: sustainable }).successRate > 0.75,
  `${(simulatePlan({ ...base, spending: sustainable }).successRate * 100).toFixed(1)}%`,
);
check(
  "spending well above it does not",
  simulatePlan({ ...base, spending: sustainable * 1.6 }).successRate <
    simulatePlan({ ...base, spending: sustainable }).successRate,
);

// --- A half-typed form must not produce a broken answer ---------------------
// Every field is a text input, so cleared boxes arrive as NaN. These used to
// propagate into the percentile bands and take the chart down with them.
const nasty: [string, Partial<PlanInput>][] = [
  ["NaN spending", { spending: NaN }],
  ["NaN age", { currentAge: NaN }],
  ["NaN balance", { isaBalance: NaN }],
  ["NaN return", { realReturn: NaN }],
  ["negative spending", { spending: -5_000 }],
  ["negative balance", { pensionBalance: -100 }],
  ["plan ends before it starts", { planToAge: 20 }],
  ["retiring in the past", { retireAge: 20 }],
  ["an absurd lifespan", { planToAge: 9_999 }],
  ["nothing at all", {
    isaBalance: 0, lisaBalance: 0, pensionBalance: 0,
    isaContribution: 0, lisaContribution: 0,
    pensionContribution: 0, employerContribution: 0,
  }],
];

let clean = true;
for (const [name, over] of nasty) {
  let ok = false;
  try {
    const r = simulatePlan({ ...base, ...over, paths: 120 });
    ok =
      Number.isFinite(r.successRate) &&
      r.successRate >= 0 &&
      r.successRate <= 1 &&
      r.band.length > 0 &&
      r.band.every(
        (y) =>
          Number.isFinite(y.p10) &&
          Number.isFinite(y.median) &&
          Number.isFinite(y.p90),
      ) &&
      Number.isFinite(r.sustainableSpend);
  } catch {
    ok = false;
  }
  if (!ok) clean = false;
  check(`survives ${name}`, ok);
}
check("no nonsense input produced a nonsense band", clean);

// The absurd lifespan must also be bounded, or the browser allocates for ever.
check(
  "an absurd lifespan is clamped rather than simulated",
  simulatePlan({ ...base, planToAge: 9_999, paths: 20 }).band.length <= 121,
  `${simulatePlan({ ...base, planToAge: 9_999, paths: 20 }).band.length} bands`,
);

console.log(
  failures === 0
    ? "\nRetirement simulation clean."
    : `\n${failures} problem(s).`,
);
process.exit(failures === 0 ? 0 : 1);
