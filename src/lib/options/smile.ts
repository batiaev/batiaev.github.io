import type { OptionType } from "./blackScholes";
import {
  impliedBand,
  intrinsicBound,
  type Market,
  type QuoteBand,
} from "./impliedVol";

/**
 * Fitting a volatility smile to a set of quotes.
 *
 * The curve is a quadratic in log-moneyness:
 *
 *     sigma(k) = a + b·k + c·k²,   k = ln(K / F)
 *
 * chosen over SVI deliberately. SVI has five parameters and needs nonlinear
 * optimisation, which is unstable on the eight or ten strikes a reader will
 * actually type in. A quadratic solves in closed form, never fails to
 * converge, and its three coefficients are the three numbers a desk already
 * quotes: level, skew and curvature.
 *
 * Quotes are weighted by the inverse square of their own bid-ask width in
 * volatility points, so a tight strike pulls the curve and a wide one barely
 * participates. Fitting a wide wing as hard as a liquid front strike is the
 * most common way to get a smile visibly wrong.
 */

export interface Quote {
  strike: number;
  type: OptionType;
  bid: number;
  ask: number;
}

export interface SmilePoint {
  strike: number;
  type: OptionType;
  logMoneyness: number;
  band: QuoteBand;
  /** The fitted curve at this strike, as a decimal. */
  fitted: number | null;
  /** Mid minus fitted, in volatility points. Positive means richer than the curve. */
  residualPoints: number | null;
  /** True when the whole bid-ask band sits clear of the curve. */
  outsideSpread: boolean;
  /** Why this quote was left out of the fit, when it was. */
  problem?: string;
}

export interface SmileFit {
  /** Fitted volatility at the forward, as a decimal. */
  atmVol: number;
  /** Slope in volatility per unit of log-moneyness — the skew. */
  skew: number;
  /** Curvature term — how much the wings lift above the straight line. */
  curvature: number;
  forward: number;
  points: SmilePoint[];
  /** Root-mean-square residual over the fitted quotes, in volatility points. */
  rmsePoints: number;
  /** How many quotes actually made it into the fit. */
  usable: number;
}

/** Forward price implied by carry — the axis the smile is measured against. */
export function forwardPrice(market: Market): number {
  return market.price * Math.exp((market.rate - market.carry) * market.years);
}

/** Solves a 3×3 system by Gaussian elimination with partial pivoting. */
function solve3(
  matrix: number[][],
  rhs: number[],
): [number, number, number] | null {
  const m = matrix.map((row, i) => [...row, rhs[i]]);

  for (let col = 0; col < 3; col += 1) {
    let pivot = col;
    for (let row = col + 1; row < 3; row += 1) {
      if (Math.abs(m[row][col]) > Math.abs(m[pivot][col])) pivot = row;
    }
    if (Math.abs(m[pivot][col]) < 1e-12) return null;
    [m[col], m[pivot]] = [m[pivot], m[col]];

    for (let row = 0; row < 3; row += 1) {
      if (row === col) continue;
      const factor = m[row][col] / m[col][col];
      for (let k = col; k < 4; k += 1) m[row][k] -= factor * m[col][k];
    }
  }

  return [m[0][3] / m[0][0], m[1][3] / m[1][1], m[2][3] / m[2][2]];
}

/** Widths below this are treated as this wide, so one tight quote cannot dominate. */
const MIN_WIDTH_POINTS = 0.25;

function describeProblem(
  quote: Quote,
  band: QuoteBand,
  market: Market,
): string | undefined {
  if (!(quote.bid > 0)) return "no bid";
  if (quote.ask <= quote.bid) return "crossed or locked";
  if (band.bid !== null && band.ask !== null && band.mid !== null) return undefined;

  // Distinguish the two ways a quote fails to imply a volatility, because they
  // mean opposite things: one is bad data, the other is a perfectly good quote
  // on an option that has no volatility exposure left to speak of.
  const mid = (quote.bid + quote.ask) / 2;
  const floor = intrinsicBound(quote.type, quote.strike, market);
  if (mid < floor) return "below intrinsic";
  if (mid - floor < Math.max(mid, 1) * 1e-6) {
    return "all intrinsic — no vega to imply from";
  }
  return "outside arbitrage bounds";
}

/**
 * Turns a set of quotes into a fitted smile plus a residual per strike.
 *
 * Returns `null` when fewer than three quotes survive, because three points is
 * the minimum a quadratic can be pinned by and a curve through two is a
 * straight line pretending otherwise.
 */
export function fitSmile(quotes: Quote[], market: Market): SmileFit | null {
  const forward = forwardPrice(market);

  const measured = quotes.map((quote) => {
    const band = impliedBand(
      quote.type,
      quote.bid,
      quote.ask,
      quote.strike,
      market,
    );
    return {
      quote,
      band,
      logMoneyness: Math.log(quote.strike / forward),
      problem: describeProblem(quote, band, market),
    };
  });

  const fittable = measured.filter((m) => !m.problem && m.band.mid !== null);
  if (fittable.length < 3) return null;

  // Weighted normal equations for sigma = a + b·k + c·k².
  const matrix = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  const rhs = [0, 0, 0];

  for (const { band, logMoneyness } of fittable) {
    const width = Math.max(band.widthPoints ?? MIN_WIDTH_POINTS, MIN_WIDTH_POINTS);
    const weight = 1 / (width * width);
    const basis = [1, logMoneyness, logMoneyness * logMoneyness];
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        matrix[i][j] += weight * basis[i] * basis[j];
      }
      rhs[i] += weight * basis[i] * (band.mid as number);
    }
  }

  const solved = solve3(matrix, rhs);
  if (!solved) return null;
  const [a, b, c] = solved;

  const curve = (k: number) => a + b * k + c * k * k;

  let squared = 0;
  const points: SmilePoint[] = measured.map(
    ({ quote, band, logMoneyness, problem }) => {
      if (problem || band.mid === null) {
        return {
          strike: quote.strike,
          type: quote.type,
          logMoneyness,
          band,
          fitted: null,
          residualPoints: null,
          outsideSpread: false,
          problem,
        };
      }

      const fitted = curve(logMoneyness);
      const residualPoints = (band.mid - fitted) * 100;
      squared += residualPoints * residualPoints;

      // Only interesting if the curve misses the quote entirely: a fit that
      // lands anywhere between bid and ask has not disagreed with the market.
      const outsideSpread =
        band.bid !== null &&
        band.ask !== null &&
        (fitted < band.bid || fitted > band.ask);

      return {
        strike: quote.strike,
        type: quote.type,
        logMoneyness,
        band,
        fitted,
        residualPoints,
        outsideSpread,
      };
    },
  );

  return {
    atmVol: a,
    skew: b,
    curvature: c,
    forward,
    points,
    rmsePoints: Math.sqrt(squared / fittable.length),
    usable: fittable.length,
  };
}

/** Samples the fitted curve for plotting, across the quoted strike range. */
export function smileCurve(
  fit: SmileFit,
  steps = 80,
): { strike: number; vol: number }[] {
  const strikes = fit.points.map((p) => p.strike);
  const low = Math.min(...strikes);
  const high = Math.max(...strikes);
  const out: { strike: number; vol: number }[] = [];

  for (let i = 0; i <= steps; i += 1) {
    const strike = low + ((high - low) * i) / steps;
    const k = Math.log(strike / fit.forward);
    out.push({
      strike,
      vol: fit.atmVol + fit.skew * k + fit.curvature * k * k,
    });
  }

  return out;
}
