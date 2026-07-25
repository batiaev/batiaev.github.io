/* Numerical checks for the options library against textbook values. Run: npm run verify:options */
import { cdf, valueOption } from "../src/lib/options/blackScholes";
import { metrics, type Position } from "../src/lib/options/strategy";
import { decodePosition, encodePosition } from "../src/lib/options/share";

let failures = 0;

function near(label: string, actual: number, expected: number, tol = 1e-3) {
  const ok = Math.abs(actual - expected) <= tol;
  if (!ok) failures += 1;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${label}: got ${actual.toFixed(6)}, want ${expected.toFixed(6)}`,
  );
}

near("cdf(0)", cdf(0), 0.5, 1e-7);
near("cdf(1.96)", cdf(1.96), 0.975002, 1e-6);
near("cdf(-2.5)", cdf(-2.5), 0.006210, 1e-6);

const base = { price: 100, strike: 100, years: 1, rate: 0.05, carry: 0, vol: 0.2 };
const call = valueOption("call", base);
const put = valueOption("put", base);

near("BS call price", call.price, 10.450584);
near("BS put price (parity)", put.price, 10.450584 - 100 + 100 * Math.exp(-0.05));
near("call delta", call.delta, 0.636831);
near("gamma", call.gamma, 0.018762, 1e-5);
near("vega per 1%", call.vega, 0.375240, 1e-5);
near("theta per day", call.theta, -6.414028 / 365, 1e-5);
near("put delta", put.delta, 0.636831 - 1);

const b76 = valueOption("call", { ...base, carry: 0.05 });
near("Black-76 call", b76.price, Math.exp(-0.05) * (100 * cdf(0.1) - 100 * cdf(-0.1)));

const expired = valueOption("call", { ...base, years: 0, price: 120 });
near("expired ITM call = intrinsic", expired.price, 20, 1e-9);
near("expired ITM call delta", expired.delta, 1, 1e-9);

const spread: Position = {
  underlying: "spot",
  price: 100,
  vol: 0.25,
  rate: 0.04,
  dividend: 0,
  valuationDays: 0,
  legs: [
    { id: "a", kind: "call", side: "long", qty: 1, strike: 100, premium: 5, days: 30, multiplier: 100 },
    { id: "b", kind: "call", side: "short", qty: 1, strike: 110, premium: 1, days: 30, multiplier: 100 },
  ],
};
const spreadMetrics = metrics(spread);
near("spread net cash", spreadMetrics.netCash, -400, 1e-9);
near("spread max profit", spreadMetrics.maxProfit, 600, 1e-6);
near("spread max loss", spreadMetrics.maxLoss, -400, 1e-6);
near("spread breakevens", spreadMetrics.breakEvens.length, 1, 0);
near("spread breakeven level", spreadMetrics.breakEvens[0], 104, 1e-4);

const straddle: Position = {
  ...spread,
  legs: [
    { id: "a", kind: "call", side: "long", qty: 1, strike: 100, premium: 4, days: 30, multiplier: 100 },
    { id: "b", kind: "put", side: "long", qty: 1, strike: 100, premium: 3, days: 30, multiplier: 100 },
  ],
};
const straddleMetrics = metrics(straddle);
console.log(
  `${straddleMetrics.maxProfit === Infinity ? "PASS" : "FAIL"}  straddle max profit is unlimited`,
);
if (straddleMetrics.maxProfit !== Infinity) failures += 1;
near("straddle max loss", straddleMetrics.maxLoss, -700, 1e-6);
near("straddle breakevens", straddleMetrics.breakEvens.length, 2, 0);
near("straddle lower breakeven", straddleMetrics.breakEvens[0], 93, 1e-4);
near("straddle upper breakeven", straddleMetrics.breakEvens[1], 107, 1e-4);

const covered: Position = {
  ...spread,
  legs: [
    { id: "a", kind: "underlying", side: "long", qty: 100, strike: 0, premium: 100, days: 30, multiplier: 1 },
    { id: "b", kind: "call", side: "short", qty: 1, strike: 105, premium: 2, days: 30, multiplier: 100 },
  ],
};
const coveredMetrics = metrics(covered);
near("covered call max profit", coveredMetrics.maxProfit, 700, 1e-6);
near("covered call max loss at zero", coveredMetrics.maxLoss, -9800, 1e-6);
near("covered call breakeven", coveredMetrics.breakEvens[0], 98, 1e-4);
near("covered call delta", coveredMetrics.delta, 100 - 100 * 0.36, 40);

const shortPut: Position = {
  ...spread,
  legs: [
    { id: "a", kind: "put", side: "short", qty: 1, strike: 95, premium: 2, days: 30, multiplier: 100 },
  ],
};
const shortPutMetrics = metrics(shortPut);
near("short put max profit", shortPutMetrics.maxProfit, 200, 1e-6);
near("short put max loss", shortPutMetrics.maxLoss, -9300, 1e-6);
near("short put breakeven", shortPutMetrics.breakEvens[0], 93, 1e-4);

const encoded = encodePosition(covered);
const roundTripped = decodePosition(encoded);
const sameShape =
  roundTripped !== null &&
  roundTripped.legs.length === covered.legs.length &&
  roundTripped.price === covered.price &&
  roundTripped.vol === covered.vol &&
  roundTripped.underlying === covered.underlying &&
  roundTripped.legs.every((leg, index) => {
    const original = covered.legs[index];
    return (
      leg.kind === original.kind &&
      leg.side === original.side &&
      leg.qty === original.qty &&
      leg.strike === original.strike &&
      leg.premium === original.premium &&
      leg.multiplier === original.multiplier
    );
  });

if (!sameShape) failures += 1;
console.log(`${sameShape ? "PASS" : "FAIL"}  share URL round-trips (${encoded.length} chars)`);

const rejected = decodePosition("?v=1&s=nonsense&l=zzz");
if (rejected !== null) failures += 1;
console.log(`${rejected === null ? "PASS" : "FAIL"}  malformed share URL is rejected`);

console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
