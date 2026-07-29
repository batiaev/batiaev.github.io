import { valueOption, type OptionType, type PriceInput } from "./blackScholes";

/**
 * Inverting Black-Scholes for volatility.
 *
 * The forward direction is a formula; this direction is a root find, and the
 * whole job is the cases where there is no root. A quote below intrinsic, a
 * crossed market, a deep wing with no vega left — a desk sees all three every
 * day, and a solver that returns a confident number for them is worse than one
 * that returns nothing.
 */

export type Market = Omit<PriceInput, "vol" | "strike">;

const MIN_VOL = 1e-4;
const MAX_VOL = 5;
const TOLERANCE = 1e-8;

/** Value of the option at zero volatility — the no-arbitrage floor. */
export function intrinsicBound(
  type: OptionType,
  strike: number,
  market: Market,
): number {
  return valueOption(type, { ...market, strike, vol: MIN_VOL }).price;
}

/** Value as volatility runs away — the ceiling a quote cannot exceed. */
function upperBound(
  type: OptionType,
  strike: number,
  market: Market,
): number {
  return valueOption(type, { ...market, strike, vol: MAX_VOL }).price;
}

/**
 * Implied volatility, or null when the price does not admit one.
 *
 * Newton converges in a handful of steps near the money and stalls in the
 * wings where vega collapses, so every step is kept inside a bracket and the
 * method falls back to bisection whenever Newton tries to leave it.
 */
export function impliedVol(
  type: OptionType,
  price: number,
  strike: number,
  market: Market,
): number | null {
  if (!(price > 0) || !(strike > 0) || market.years <= 0) return null;

  const floor = intrinsicBound(type, strike, market);
  const ceiling = upperBound(type, strike, market);

  // Outside the arbitrage bounds there is no volatility that reproduces this
  // price.
  if (price < floor - 1e-9) return null;
  if (price > ceiling) return null;

  // Deep in the money, the entire premium is intrinsic: a 70 call on a 100
  // underlying prices identically at 8% and 15% vol. There is no volatility to
  // recover there, and returning a confident number would be a lie.
  if (price - floor <= Math.max(price, 1) * 1e-12) return null;

  /**
   * A solution is only meaningful if volatility still moves the price. Below
   * this, a whole volatility point is worth less than a millionth of a
   * currency unit — the root find converges on the price and says nothing
   * about the vol, because the data does not contain it. Refusing here is what
   * keeps a fitted smile from being anchored by strikes that carry no
   * information, and it is the arithmetic reason desks quote the wings out of
   * the money.
   */
  const MIN_VEGA_PER_POINT = 1e-6;

  let low = MIN_VOL;
  let high = MAX_VOL;
  let vol = 0.2;

  for (let i = 0; i < 100; i += 1) {
    const { price: guess, vega } = valueOption(type, {
      ...market,
      strike,
      vol,
    });
    const diff = guess - price;

    if (Math.abs(diff) < TOLERANCE) {
      return vega < MIN_VEGA_PER_POINT ? null : vol;
    }

    // Keep the bracket honest regardless of which method moved last.
    if (diff > 0) high = vol;
    else low = vol;

    // `vega` is per volatility point; the derivative here is per unit.
    const slope = vega * 100;
    const newton = slope > 1e-10 ? vol - diff / slope : NaN;

    vol =
      Number.isFinite(newton) && newton > low && newton < high
        ? newton
        : (low + high) / 2;

    if (high - low < TOLERANCE) {
      const { vega: finalVega } = valueOption(type, { ...market, strike, vol });
      return finalVega < MIN_VEGA_PER_POINT ? null : vol;
    }
  }

  return vol;
}

export interface QuoteBand {
  /** Implied volatility of the bid — the lower edge of the band. */
  bid: number | null;
  /** Implied volatility of the ask. */
  ask: number | null;
  /** Mid-price implied volatility, which is what the fit is drawn through. */
  mid: number | null;
  /** Ask IV minus bid IV, in volatility points. */
  widthPoints: number | null;
}

/**
 * Both sides of a quote in volatility terms.
 *
 * A single mid IV hides the thing that decides whether a discrepancy is worth
 * anything: how wide the market is. A residual inside this band is noise.
 */
export function impliedBand(
  type: OptionType,
  bid: number,
  ask: number,
  strike: number,
  market: Market,
): QuoteBand {
  const bidVol = impliedVol(type, bid, strike, market);
  const askVol = impliedVol(type, ask, strike, market);
  const midVol = impliedVol(type, (bid + ask) / 2, strike, market);

  return {
    bid: bidVol,
    ask: askVol,
    mid: midVol,
    widthPoints:
      bidVol !== null && askVol !== null ? (askVol - bidVol) * 100 : null,
  };
}
