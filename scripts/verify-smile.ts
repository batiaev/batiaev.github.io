/* Implied vol inversion and smile fitting. Run: npm run verify:smile */
import { valueOption } from "../src/lib/options/blackScholes";
import {
  impliedVol,
  impliedBand,
  intrinsicBound,
  type Market,
} from "../src/lib/options/impliedVol";
import { fitSmile, forwardPrice, type Quote } from "../src/lib/options/smile";

let failures = 0;

function check(label: string, ok: boolean, detail = "") {
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `: ${detail}` : ""}`);
}

function near(label: string, actual: number, expected: number, tol: number) {
  check(
    label,
    Math.abs(actual - expected) <= tol,
    `got ${actual.toFixed(6)}, want ${expected.toFixed(6)} ±${tol}`,
  );
}

const market: Market = {
  price: 100,
  years: 30 / 365,
  rate: 0.04,
  carry: 0,
};

// --- Round trip: price at a vol, invert, get the vol back -------------------
// Where the extrinsic value survives in a double, the vol must come back
// exactly. Where it does not, the answer must be null rather than a guess.
let worst = 0;
let recovered = 0;
let refused = 0;
let wrongRefusal = 0;
let falseConfidence = 0;

for (const strike of [70, 85, 95, 100, 105, 115, 130]) {
  for (const vol of [0.08, 0.15, 0.25, 0.4, 0.8, 1.5]) {
    for (const type of ["call", "put"] as const) {
      const { price } = valueOption(type, { ...market, strike, vol });
      if (price < 1e-6) continue;

      // Identifiable only where a volatility point still moves the price.
      const { vega } = valueOption(type, { ...market, strike, vol });
      const extrinsic = price - intrinsicBound(type, strike, market);
      const recoverable =
        extrinsic > Math.max(price, 1) * 1e-12 && vega >= 1e-6;
      const back = impliedVol(type, price, strike, market);

      if (!recoverable) {
        if (back === null) refused += 1;
        else falseConfidence += 1;
        continue;
      }
      if (back === null) {
        wrongRefusal += 1;
        continue;
      }
      recovered += 1;
      worst = Math.max(worst, Math.abs(back - vol));
    }
  }
}

check(
  "implied vol round-trips wherever the extrinsic value survives",
  worst < 1e-6 && wrongRefusal === 0,
  `${recovered} recovered, worst error ${worst.toExponential(2)}, ${wrongRefusal} wrongly refused`,
);
check(
  "and refuses where it does not, rather than guessing",
  falseConfidence === 0 && refused > 0,
  `${refused} refused, ${falseConfidence} answered anyway`,
);

// --- Deep wings, where vega collapses and Newton alone would stall ----------
const deepStrike = 200;
const deepVol = 0.9;
const deep = valueOption("call", { ...market, strike: deepStrike, vol: deepVol });
const deepBack = impliedVol("call", deep.price, deepStrike, market);
check(
  "solves a far out-of-the-money wing",
  deepBack !== null && Math.abs(deepBack - deepVol) < 1e-5,
  `got ${deepBack === null ? "null" : deepBack.toFixed(6)}`,
);

// --- Cases with no solution -------------------------------------------------
check(
  "a price below intrinsic has no implied vol",
  impliedVol("call", 0.5, 80, market) === null,
);
check(
  "a price above the underlying has no implied vol",
  impliedVol("call", 120, 100, market) === null,
);
check("a zero price has no implied vol", impliedVol("call", 0, 100, market) === null);
check(
  "an expired option has no implied vol",
  impliedVol("call", 5, 100, { ...market, years: 0 }) === null,
);

check(
  "a quote sitting on intrinsic implies nothing at all",
  impliedVol("call", intrinsicBound("call", 80, market), 80, market) === null,
);
check(
  "a deep in-the-money quote is refused rather than guessed",
  impliedVol("call", 30.229759, 70, market) === null,
);

// --- Bands ------------------------------------------------------------------
const mid = valueOption("call", { ...market, strike: 100, vol: 0.25 }).price;
const band = impliedBand("call", mid - 0.1, mid + 0.1, 100, market);
check(
  "bid implies a lower vol than ask",
  band.bid !== null && band.ask !== null && band.bid < band.ask,
);
check(
  "mid vol sits inside the band",
  band.mid !== null &&
    band.bid !== null &&
    band.ask !== null &&
    band.mid > band.bid &&
    band.mid < band.ask,
);
check("band width is positive", (band.widthPoints ?? 0) > 0);

// --- Fitting a smile we generated ourselves ---------------------------------
// Build quotes from a known quadratic, then check the fit recovers it.
const trueA = 0.24;
const trueB = -0.35;
const trueC = 0.9;
const forward = forwardPrice(market);

const quotes: Quote[] = [80, 85, 90, 95, 100, 105, 110, 115].map((strike) => {
  const k = Math.log(strike / forward);
  const vol = trueA + trueB * k + trueC * k * k;
  // OTM convention: puts below the forward, calls above.
  const type = strike < forward ? ("put" as const) : ("call" as const);
  const price = valueOption(type, { ...market, strike, vol }).price;
  // Wider in the wings, as a real market is.
  const halfSpread = Math.max(price * 0.03, 0.02);
  return { strike, type, bid: price - halfSpread, ask: price + halfSpread };
});

const fit = fitSmile(quotes, market);
check("a well-formed chain produces a fit", fit !== null);

if (fit) {
  near("recovers the level", fit.atmVol, trueA, 2e-3);
  near("recovers the skew", fit.skew, trueB, 2e-2);
  near("recovers the curvature", fit.curvature, trueC, 1e-1);
  check(
    "residuals are small on a clean chain",
    fit.rmsePoints < 0.2,
    `rmse ${fit.rmsePoints.toFixed(3)} vol points`,
  );
  check("every quote was usable", fit.usable === quotes.length);
  check(
    "no strike is flagged against its own spread",
    fit.points.every((p) => !p.outsideSpread),
  );
  check(
    "forward sits above spot with positive carry",
    fit.forward > market.price,
    `forward ${fit.forward.toFixed(4)}`,
  );
}

// --- A genuinely mispriced strike should stand out --------------------------
const TAMPERED = 5;
const tampered = quotes.map((q, i) =>
  i === TAMPERED ? { ...q, bid: q.bid * 1.6, ask: q.ask * 1.6 } : q,
);
const tamperedFit = fitSmile(tampered, market);
check(
  "a strike marked well away from the curve is flagged",
  tamperedFit !== null && tamperedFit.points[TAMPERED].outsideSpread,
);
check(
  "and it is flagged as rich, not cheap",
  tamperedFit !== null && (tamperedFit.points[TAMPERED].residualPoints ?? 0) > 0,
  `residual ${tamperedFit?.points[TAMPERED].residualPoints?.toFixed(2)} vol points`,
);
check(
  "it is the worst offender on the board",
  tamperedFit !== null &&
    tamperedFit.points.every(
      (p, i) =>
        i === TAMPERED ||
        Math.abs(p.residualPoints ?? 0) <
          Math.abs(tamperedFit.points[TAMPERED].residualPoints ?? 0),
    ),
);

// --- Bad input --------------------------------------------------------------
const broken: Quote[] = [
  { strike: 90, type: "put", bid: 0, ask: 1 },
  { strike: 95, type: "put", bid: 2, ask: 1 },
  { strike: 100, type: "call", bid: 0.5, ask: 0.6 },
];
const brokenFit = fitSmile(broken, market);
check("fewer than three usable quotes gives no fit", brokenFit === null);

const mixed: Quote[] = [...quotes.slice(0, 5), { strike: 108, type: "call", bid: 0, ask: 0.2 }];
const mixedFit = fitSmile(mixed, market);
check(
  "an unusable quote is reported rather than silently dropped",
  mixedFit !== null && mixedFit.points.some((p) => p.problem === "no bid"),
);
check(
  "and it does not enter the fit",
  mixedFit !== null && mixedFit.usable === 5,
  `usable ${mixedFit?.usable}`,
);

console.log(
  failures === 0 ? "\nSmile fitting clean." : `\n${failures} problem(s).`,
);
process.exit(failures === 0 ? 0 : 1);
