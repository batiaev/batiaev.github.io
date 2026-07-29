import { valueOption } from "./blackScholes";

/**
 * Delta-hedging a short option, step by step.
 *
 * The point this exists to make: the premium is the price of the gamma you are
 * short. Sell a call, hedge it to expiry, and if the underlying realises the
 * volatility you sold, the hedging losses eat the premium almost exactly. The
 * result is not a static shape — it only exists over time, which is why this is
 * a simulation rather than a chart.
 *
 * Nothing here touches market data. The path is generated, the greeks are the
 * same Black-Scholes the calculator uses, and the seed makes it reproducible.
 */

export interface HedgeInput {
  spot: number;
  strike: number;
  /** Calendar days to expiry. */
  days: number;
  /** The volatility the option was sold at. */
  impliedVol: number;
  /** The volatility the generated path is asked to realise. */
  realisedVol: number;
  rate: number;
  /** Number of rebalances between now and expiry. */
  rehedges: number;
  /** Contract size — 100 for a standard equity option. */
  multiplier: number;
  seed: number;
}

export interface HedgeStep {
  /** Calendar days elapsed. */
  day: number;
  spot: number;
  /** Delta per unit of the call. The hedge is long this many units. */
  delta: number;
  /** Units of underlying held as the hedge after rebalancing. */
  hedgeUnits: number;
  /** Signed units traded to get there — the rebalance itself. */
  traded: number;
  /** Option value per unit at this step. */
  optionValue: number;
  /** Mark-to-market P&L of the whole book: cash + hedge − short option. */
  pnl: number;
}

export interface HedgeResult {
  steps: HedgeStep[];
  /** Option premium per unit, at inception. */
  premium: number;
  /** Premium actually received, i.e. premium × multiplier. */
  premiumCash: number;
  /** Volatility the path actually delivered, annualised from its log returns. */
  realisedVol: number;
  /** P&L once the option is settled and the hedge unwound. */
  finalPnl: number;
  /** Total units traded across every rebalance. */
  turnover: number;
}

/** The position both the note and the tool open on. */
export const HEDGE_DEFAULTS = {
  spot: 100,
  strike: 100,
  days: 30,
  impliedVol: 0.25,
  rate: 0.04,
  rehedges: 30,
  multiplier: 100,
};

/** Small, fast, and identical across browsers — which `Math.random` is not. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Box-Muller, taking two uniforms and returning one standard normal. */
function gaussian(random: () => number): number {
  let u = 0;
  while (u === 0) u = random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
}

/**
 * Runs the hedge to expiry and returns every intermediate state.
 *
 * Cash is a real account: it receives the premium, pays for the hedge, and
 * earns the risk-free rate between rebalances. That last detail is why the
 * break-even holds at all — drop it and the simulation drifts.
 */
export function simulateHedge(input: HedgeInput): HedgeResult {
  const {
    spot,
    strike,
    days,
    impliedVol,
    realisedVol,
    rate,
    rehedges,
    multiplier,
    seed,
  } = input;

  const years = days / 365;
  const steps = Math.max(1, Math.floor(rehedges));
  const dt = years / steps;
  const random = mulberry32(seed);
  const growth = Math.exp(rate * dt);

  const priceAt = (price: number, remaining: number) =>
    valueOption("call", {
      price,
      strike,
      years: Math.max(remaining, 0),
      rate,
      carry: 0,
      vol: impliedVol,
    });

  const opening = priceAt(spot, years);
  const premium = opening.price;

  // Sell the call.
  let cash = premium * multiplier;
  let hedgeUnits = 0;
  let turnover = 0;

  const out: HedgeStep[] = [];
  const logReturns: number[] = [];
  let price = spot;

  for (let i = 0; i <= steps; i += 1) {
    const remaining = years - i * dt;
    const valuation = priceAt(price, remaining);

    // At expiry there is nothing left to hedge: unwind instead of rebalancing.
    const target = i === steps ? 0 : valuation.delta * multiplier;
    const traded = target - hedgeUnits;
    cash -= traded * price;
    hedgeUnits = target;
    turnover += Math.abs(traded);

    // Settle the short call on the last step.
    if (i === steps) cash -= Math.max(price - strike, 0) * multiplier;

    const optionLiability = i === steps ? 0 : valuation.price * multiplier;
    out.push({
      day: (i * dt * 365),
      spot: price,
      delta: valuation.delta,
      hedgeUnits,
      traded,
      optionValue: valuation.price,
      pnl: cash + hedgeUnits * price - optionLiability,
    });

    if (i === steps) break;

    // Advance the path. Risk-neutral drift keeps the simulation consistent
    // with the model that priced the option in the first place.
    const shock = gaussian(random);
    const logStep =
      (rate - (realisedVol * realisedVol) / 2) * dt +
      realisedVol * Math.sqrt(dt) * shock;
    logReturns.push(logStep);
    price = price * Math.exp(logStep);
    cash *= growth;
  }

  return {
    steps: out,
    premium,
    premiumCash: premium * multiplier,
    realisedVol: annualisedVol(logReturns, dt),
    finalPnl: out[out.length - 1].pnl,
    turnover,
  };
}

/** Sample standard deviation of the log returns, scaled to a year. */
export function annualisedVol(logReturns: number[], dt: number): number {
  if (logReturns.length < 2) return 0;
  const mean =
    logReturns.reduce((sum, r) => sum + r, 0) / logReturns.length;
  const variance =
    logReturns.reduce((sum, r) => sum + (r - mean) ** 2, 0) /
    (logReturns.length - 1);
  return Math.sqrt(variance / dt);
}
