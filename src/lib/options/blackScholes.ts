export type OptionType = "call" | "put";

export interface PriceInput {
  /** Spot price for equities, forward/futures price for Black-76. */
  price: number;
  strike: number;
  /** Time to expiry in years. */
  years: number;
  /** Continuously compounded risk-free rate, as a decimal. */
  rate: number;
  /** Continuous carry (dividend yield for spot; equal to `rate` for Black-76). */
  carry: number;
  /** Annualised volatility, as a decimal. */
  vol: number;
}

export interface Valuation {
  price: number;
  delta: number;
  gamma: number;
  /** Change in value per 1 percentage point of volatility. */
  vega: number;
  /** Change in value per calendar day. */
  theta: number;
}

const SQRT_2PI = Math.sqrt(2 * Math.PI);

function pdf(x: number): number {
  return Math.exp(-0.5 * x * x) / SQRT_2PI;
}

/** Zelen & Severo rational approximation of the standard normal CDF (|error| < 7.5e-8). */
export function cdf(x: number): number {
  if (x < 0) return 1 - cdf(-x);
  const t = 1 / (1 + 0.2316419 * x);
  const poly =
    t *
    (0.319381530 +
      t *
        (-0.356563782 +
          t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return 1 - pdf(x) * poly;
}

function intrinsic(type: OptionType, price: number, strike: number): number {
  return type === "call"
    ? Math.max(price - strike, 0)
    : Math.max(strike - price, 0);
}

/**
 * Generalised Black-Scholes-Merton. Pass `carry === rate` to get Black-76 on a
 * futures or forward price; pass a dividend yield to price a spot underlying.
 */
export function valueOption(type: OptionType, input: PriceInput): Valuation {
  const { price, strike, years, rate, carry, vol } = input;

  if (!(price > 0) || !(strike > 0)) {
    return { price: 0, delta: 0, gamma: 0, vega: 0, theta: 0 };
  }

  const variance = vol * Math.sqrt(Math.max(years, 0));

  // At or past expiry, or with no uncertainty left, the option is worth its
  // intrinsic value and only delta survives.
  if (years <= 0 || variance <= 0) {
    const inTheMoney = intrinsic(type, price, strike) > 0;
    const delta = inTheMoney ? (type === "call" ? 1 : -1) : 0;
    return {
      price: intrinsic(type, price, strike),
      delta,
      gamma: 0,
      vega: 0,
      theta: 0,
    };
  }

  const discount = Math.exp(-rate * years);
  const carryDiscount = Math.exp(-carry * years);
  const d1 =
    (Math.log(price / strike) + (rate - carry + (vol * vol) / 2) * years) /
    variance;
  const d2 = d1 - variance;

  const gamma = (carryDiscount * pdf(d1)) / (price * variance);
  const vega = (price * carryDiscount * pdf(d1) * Math.sqrt(years)) / 100;
  const decay = (-price * carryDiscount * pdf(d1) * vol) / (2 * Math.sqrt(years));

  if (type === "call") {
    return {
      price: price * carryDiscount * cdf(d1) - strike * discount * cdf(d2),
      delta: carryDiscount * cdf(d1),
      gamma,
      vega,
      theta:
        (decay -
          rate * strike * discount * cdf(d2) +
          carry * price * carryDiscount * cdf(d1)) /
        365,
    };
  }

  return {
    price: strike * discount * cdf(-d2) - price * carryDiscount * cdf(-d1),
    delta: -carryDiscount * cdf(-d1),
    gamma,
    vega,
    theta:
      (decay +
        rate * strike * discount * cdf(-d2) -
        carry * price * carryDiscount * cdf(-d1)) /
      365,
  };
}
