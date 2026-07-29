/* Properties the hedging simulation has to satisfy. Run: npm run verify:hedging */
import { simulateHedge, mulberry32, type HedgeInput } from "../src/lib/options/hedging";

let failures = 0;

function check(label: string, ok: boolean, detail = "") {
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `: ${detail}` : ""}`);
}

function near(label: string, actual: number, expected: number, tol: number) {
  check(
    label,
    Math.abs(actual - expected) <= tol,
    `got ${actual.toFixed(4)}, want ${expected.toFixed(4)} ±${tol}`,
  );
}

const base: HedgeInput = {
  spot: 100,
  strike: 100,
  days: 30,
  impliedVol: 0.25,
  realisedVol: 0.25,
  rate: 0.04,
  rehedges: 30,
  multiplier: 100,
  seed: 1,
};

// --- Determinism -------------------------------------------------------------
const a = simulateHedge(base);
const b = simulateHedge(base);
check(
  "same seed gives the same path",
  a.steps.every((s, i) => s.spot === b.steps[i].spot),
);
check(
  "different seeds give different paths",
  simulateHedge({ ...base, seed: 2 }).finalPnl !== a.finalPnl,
);

// --- Book-keeping ------------------------------------------------------------
near("P&L starts at zero", a.steps[0].pnl, 0, 1e-9);
check("path starts at spot", a.steps[0].spot === base.spot);
check(
  "one step per rebalance, plus expiry",
  a.steps.length === base.rehedges + 1,
  `got ${a.steps.length}`,
);
check("hedge is fully unwound at expiry", a.steps[a.steps.length - 1].hedgeUnits === 0);
check(
  "an ATM call is hedged with roughly half the contract",
  Math.abs(a.steps[0].hedgeUnits - 52) < 4,
  `got ${a.steps[0].hedgeUnits.toFixed(1)}`,
);
near("premium is the Black-Scholes price", a.premium, 2.9, 0.2);

// --- The property the whole figure exists to show ---------------------------
// Selling at implied and realising the same volatility should return the
// premium to the market: the hedge costs what the option was worth.
function sample(over: Partial<HedgeInput>, seeds = 400) {
  const values: number[] = [];
  for (let seed = 1; seed <= seeds; seed += 1) {
    values.push(simulateHedge({ ...base, ...over, seed }).finalPnl);
  }
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance =
    values.reduce((s, v) => s + (v - mean) ** 2, 0) / (values.length - 1);
  return { mean, standardError: Math.sqrt(variance / values.length) };
}

function meanFinal(over: Partial<HedgeInput>, seeds = 400): number {
  return sample(over, seeds).mean;
}

// Break-even is a statement about the mean, so the tolerance has to be the
// Monte Carlo standard error rather than a number picked to fit. Three standard
// errors keeps this from flaking while still failing on a real drift.
const matched = sample({});
check(
  "realised = implied breaks even on average",
  Math.abs(matched.mean) < 3 * matched.standardError,
  `mean P&L ${matched.mean.toFixed(2)} ± ${matched.standardError.toFixed(2)} (3 s.e. = ${(3 * matched.standardError).toFixed(2)}) on ~300 of premium`,
);

const matchedMean = matched.mean;
const quiet = meanFinal({ realisedVol: 0.12 });
check(
  "selling vol into a quiet market pays",
  quiet > 0.25 * a.premiumCash,
  `mean P&L ${quiet.toFixed(2)}`,
);

const wild = meanFinal({ realisedVol: 0.45 });
check(
  "selling vol into a wild market loses",
  wild < -0.25 * a.premiumCash,
  `mean P&L ${wild.toFixed(2)}`,
);

check(
  "P&L is monotonic in realised volatility",
  quiet > matchedMean && matchedMean > wild,
  `${quiet.toFixed(2)} > ${matchedMean.toFixed(2)} > ${wild.toFixed(2)}`,
);

// --- Discrete hedging error --------------------------------------------------
// Rehedging more often should shrink the spread of outcomes, which is the
// second thing the page claims.
function dispersion(rehedges: number, seeds = 300): number {
  const values: number[] = [];
  for (let seed = 1; seed <= seeds; seed += 1) {
    values.push(simulateHedge({ ...base, rehedges, seed }).finalPnl);
  }
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  return Math.sqrt(
    values.reduce((s, v) => s + (v - mean) ** 2, 0) / (values.length - 1),
  );
}

const coarse = dispersion(6);
const fine = dispersion(60);
check(
  "hedging more often narrows the outcome",
  fine < coarse,
  `sd ${coarse.toFixed(2)} at 6 rehedges vs ${fine.toFixed(2)} at 60`,
);

check(
  "hedging more often costs more turnover",
  simulateHedge({ ...base, rehedges: 60 }).turnover >
    simulateHedge({ ...base, rehedges: 6 }).turnover,
);

// --- Measured volatility -----------------------------------------------------
const measured = meanVol(0.25);
near("the path realises the volatility it was asked for", measured, 0.25, 0.02);

function meanVol(target: number, seeds = 300): number {
  let total = 0;
  for (let seed = 1; seed <= seeds; seed += 1) {
    total += simulateHedge({ ...base, realisedVol: target, seed }).realisedVol;
  }
  return total / seeds;
}

// --- RNG ---------------------------------------------------------------------
const rng = mulberry32(42);
const draws = Array.from({ length: 5000 }, () => rng());
const mean = draws.reduce((s, v) => s + v, 0) / draws.length;
near("uniform generator is centred", mean, 0.5, 0.02);
check("uniform generator stays in range", draws.every((v) => v >= 0 && v < 1));

console.log(
  failures === 0
    ? "\nHedging simulation clean."
    : `\n${failures} problem(s).`,
);
process.exit(failures === 0 ? 0 : 1);
