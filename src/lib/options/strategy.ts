import { z } from "zod";
import { valueOption, type OptionType } from "./blackScholes";

export const legSchema = z.object({
  id: z.string(),
  kind: z.enum(["call", "put", "underlying"]),
  side: z.enum(["long", "short"]),
  qty: z.number().min(0).max(100_000),
  strike: z.number().min(0).max(10_000_000),
  /** Per-unit price paid or received at entry (entry price for the underlying). */
  premium: z.number().min(0).max(10_000_000),
  /** Calendar days from today until this leg expires. */
  days: z.number().min(0).max(3_650),
  multiplier: z.number().min(0).max(100_000),
  /**
   * "auto" legs are re-priced from the current market whenever an input that
   * feeds the model changes; "manual" legs hold a premium the user typed in,
   * which is what you want once it represents a real entry price.
   */
  premiumMode: z.enum(["auto", "manual"]).default("auto"),
});

export const positionSchema = z.object({
  underlying: z.enum(["spot", "future"]),
  price: z.number().min(0).max(10_000_000),
  vol: z.number().min(0).max(10),
  rate: z.number().min(-1).max(1),
  /** Dividend yield; ignored for futures, where carry equals the rate. */
  dividend: z.number().min(-1).max(1),
  /** Days from today for the "P&L at date T" curve. */
  valuationDays: z.number().min(0).max(3_650),
  legs: z.array(legSchema).max(12),
});

export type Leg = z.infer<typeof legSchema>;
export type Position = z.infer<typeof positionSchema>;

export interface Metrics {
  netCash: number;
  maxProfit: number;
  maxLoss: number;
  breakEvens: number[];
  delta: number;
  gamma: number;
  vega: number;
  theta: number;
}

export interface CurvePoint {
  price: number;
  expiry: number;
  valuation: number;
  /** Per-leg P&L at expiry, keyed by leg id. */
  legs: Record<string, number>;
}

let idCounter = 0;

export function newLegId(): string {
  idCounter += 1;
  return `l${idCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Signed contract exposure: negative for short legs. */
function scale(leg: Leg): number {
  return (leg.side === "long" ? 1 : -1) * leg.qty * leg.multiplier;
}

function terminalValue(leg: Leg, price: number): number {
  if (leg.kind === "underlying") return price;
  return leg.kind === "call"
    ? Math.max(price - leg.strike, 0)
    : Math.max(leg.strike - price, 0);
}

export function legPnlAtExpiry(leg: Leg, price: number): number {
  return scale(leg) * (terminalValue(leg, price) - leg.premium);
}

function carryOf(position: Position): number {
  return position.underlying === "future" ? position.rate : position.dividend;
}

export function legPnlAtValuation(
  leg: Leg,
  price: number,
  position: Position,
): number {
  if (leg.kind === "underlying") {
    return scale(leg) * (price - leg.premium);
  }

  const years = Math.max(leg.days - position.valuationDays, 0) / 365;
  const { price: theoretical } = valueOption(leg.kind as OptionType, {
    price,
    strike: leg.strike,
    years,
    rate: position.rate,
    carry: carryOf(position),
    vol: position.vol,
  });

  return scale(leg) * (theoretical - leg.premium);
}

/** Cash at entry: positive is a net credit received, negative a net debit paid. */
export function netCash(position: Position): number {
  return position.legs.reduce(
    (total, leg) => total - scale(leg) * leg.premium,
    0,
  );
}

export function pnlAtExpiry(position: Position, price: number): number {
  return position.legs.reduce(
    (total, leg) => total + legPnlAtExpiry(leg, price),
    0,
  );
}

export function pnlAtValuation(position: Position, price: number): number {
  return position.legs.reduce(
    (total, leg) => total + legPnlAtValuation(leg, price, position),
    0,
  );
}

/** Slope of the expiry payoff far below the lowest strike. */
function leftSlope(legs: Leg[]): number {
  return legs.reduce((total, leg) => {
    if (leg.kind === "call") return total;
    return total + (leg.kind === "put" ? -scale(leg) : scale(leg));
  }, 0);
}

/** Slope of the expiry payoff far above the highest strike. */
function rightSlope(legs: Leg[]): number {
  return legs.reduce((total, leg) => {
    if (leg.kind === "put") return total;
    return total + scale(leg);
  }, 0);
}

function kinkPoints(position: Position): number[] {
  const strikes = position.legs
    .filter((leg) => leg.kind !== "underlying")
    .map((leg) => leg.strike)
    .filter((strike) => strike > 0);

  return Array.from(new Set([0, ...strikes])).sort((a, b) => a - b);
}

/**
 * The expiry payoff is piecewise linear with kinks only at strikes, so extrema
 * and roots can be read off the kink points and the two tail slopes exactly.
 */
export function metrics(position: Position): Metrics {
  const cash = netCash(position);

  if (position.legs.length === 0) {
    return {
      netCash: cash,
      maxProfit: 0,
      maxLoss: 0,
      breakEvens: [],
      delta: 0,
      gamma: 0,
      vega: 0,
      theta: 0,
    };
  }

  const points = kinkPoints(position);
  const values = points.map((price) => pnlAtExpiry(position, price));
  const up = rightSlope(position.legs);
  const down = leftSlope(position.legs);
  const epsilon = 1e-9;

  const maxProfit = up > epsilon ? Infinity : Math.max(...values);
  const maxLoss = up < -epsilon ? -Infinity : Math.min(...values);

  const breakEvens: number[] = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const [x0, x1] = [points[i], points[i + 1]];
    const [y0, y1] = [values[i], values[i + 1]];
    if (Math.abs(y0) < epsilon) breakEvens.push(x0);
    else if (y0 * y1 < 0) breakEvens.push(x0 + ((x1 - x0) * -y0) / (y1 - y0));
  }

  const lastPoint = points[points.length - 1];
  const lastValue = values[values.length - 1];
  if (Math.abs(lastValue) < epsilon) {
    breakEvens.push(lastPoint);
  } else if (Math.abs(up) > epsilon) {
    const root = lastPoint - lastValue / up;
    if (root > lastPoint) breakEvens.push(root);
  }

  // A downward left tail can only cross zero inside [0, firstStrike], which the
  // segment scan above already covers; `down` is kept for the unbounded check.
  void down;

  const totals = position.legs.reduce(
    (acc, leg) => {
      if (leg.kind === "underlying") {
        acc.delta += scale(leg);
        return acc;
      }

      const years = Math.max(leg.days - position.valuationDays, 0) / 365;
      const valuation = valueOption(leg.kind as OptionType, {
        price: position.price,
        strike: leg.strike,
        years,
        rate: position.rate,
        carry: carryOf(position),
        vol: position.vol,
      });

      const exposure = scale(leg);
      acc.delta += exposure * valuation.delta;
      acc.gamma += exposure * valuation.gamma;
      acc.vega += exposure * valuation.vega;
      acc.theta += exposure * valuation.theta;
      return acc;
    },
    { delta: 0, gamma: 0, vega: 0, theta: 0 },
  );

  return {
    netCash: cash,
    maxProfit,
    maxLoss,
    breakEvens: Array.from(
      new Set(breakEvens.map((value) => Number(value.toFixed(4)))),
    ).sort((a, b) => a - b),
    ...totals,
  };
}

export function priceRange(position: Position): [number, number] {
  const anchors = [
    position.price,
    ...position.legs
      .filter((leg) => leg.kind !== "underlying" && leg.strike > 0)
      .map((leg) => leg.strike),
  ];

  const low = Math.min(...anchors);
  const high = Math.max(...anchors);
  const pad = Math.max((high - low) * 0.6, position.price * 0.3, 1);

  return [Math.max(low - pad, 0), high + pad];
}

/**
 * Samples the payoff on a uniform grid with every strike injected, so the
 * rendered expiry line keeps its exact kinks instead of rounding them off.
 */
export function payoffCurve(position: Position, steps = 161): CurvePoint[] {
  const [low, high] = priceRange(position);
  const grid = new Set<number>();

  for (let i = 0; i <= steps; i += 1) {
    grid.add(low + ((high - low) * i) / steps);
  }

  position.legs.forEach((leg) => {
    if (leg.kind === "underlying" || leg.strike <= 0) return;
    grid.add(leg.strike);
    // Nudge either side of the kink so the chart draws a corner, not a curve.
    grid.add(leg.strike * 0.9999);
    grid.add(leg.strike * 1.0001);
  });

  return Array.from(grid)
    .filter((price) => price >= low && price <= high)
    .sort((a, b) => a - b)
    .map((price) => ({
      price,
      expiry: pnlAtExpiry(position, price),
      valuation: pnlAtValuation(position, price),
      legs: Object.fromEntries(
        position.legs.map((leg) => [leg.id, legPnlAtExpiry(leg, price)]),
      ),
    }));
}
