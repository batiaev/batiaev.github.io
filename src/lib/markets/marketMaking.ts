/**
 * Inventory-aware quoting after Avellaneda and Stoikov (2008), and markouts.
 *
 * Small on purpose: these are the formulas the market-making note quotes, so
 * that the worked example on the page is computed and checked rather than
 * typed. Hostile input — NaN from a cleared field, a negative volatility, a
 * zero tick — returns NaN instead of a confident wrong number.
 */

export interface InventoryInput {
  /** Market mid price. */
  mid: number;
  /** Signed position: positive long, negative short. */
  inventory: number;
  /** γ — risk aversion, ≥ 0. */
  riskAversion: number;
  /** σ — volatility in price units per square root of the time unit. */
  volatility: number;
  /** T − t — time left to carry the position, in the same time unit. */
  horizon: number;
}

export interface SpreadInput {
  riskAversion: number;
  volatility: number;
  horizon: number;
  /** k — how fast fill probability decays with distance from the mid, > 0. */
  intensityDecay: number;
}

const finite = (...values: number[]) => values.every(Number.isFinite);

/** q · γ · σ² · (T − t): how far the quotes slide away from the mid. */
export function inventorySkew({
  inventory,
  riskAversion,
  volatility,
  horizon,
}: Omit<InventoryInput, "mid">): number {
  if (!finite(inventory, riskAversion, volatility, horizon)) return NaN;
  if (riskAversion < 0 || volatility < 0 || horizon < 0) return NaN;
  return inventory * riskAversion * volatility * volatility * horizon;
}

/** r = s − q · γ · σ² · (T − t): the price at which one more unit is a matter of indifference. */
export function reservationPrice(input: InventoryInput): number {
  if (!Number.isFinite(input.mid)) return NaN;
  return input.mid - inventorySkew(input);
}

/**
 * δ = γσ²(T − t) + (2/γ) · ln(1 + γ/k): the optimal total spread.
 *
 * The second term falls as γ rises, so more risk aversion does not by itself
 * mean a wider spread — it means a harder skew. At γ = 0 the term's limit,
 * 2/k, is returned rather than dividing by zero.
 */
export function optimalSpread({
  riskAversion,
  volatility,
  horizon,
  intensityDecay,
}: SpreadInput): number {
  if (!finite(riskAversion, volatility, horizon, intensityDecay)) return NaN;
  if (riskAversion < 0 || volatility < 0 || horizon < 0 || intensityDecay <= 0) return NaN;
  const inventoryTerm = riskAversion * volatility * volatility * horizon;
  const flowTerm =
    riskAversion === 0
      ? 2 / intensityDecay
      : (2 / riskAversion) * Math.log1p(riskAversion / intensityDecay);
  return inventoryTerm + flowTerm;
}

/** Bid and offer placed symmetrically around the reservation price. */
export function quotes(input: InventoryInput & { intensityDecay: number }) {
  const reservation = reservationPrice(input);
  const spread = optimalSpread(input);
  return {
    reservation,
    spread,
    bid: reservation - spread / 2,
    ask: reservation + spread / 2,
  };
}

/**
 * The move in the mid after a fill, from the market maker's side, in ticks.
 * The market maker bought: a lower mid afterwards is a loss, so negative.
 */
export function markoutTicks(
  side: "buy" | "sell",
  fillPrice: number,
  laterMid: number,
  tick: number,
): number {
  if (!finite(fillPrice, laterMid, tick) || tick <= 0) return NaN;
  const move = side === "buy" ? laterMid - fillPrice : fillPrice - laterMid;
  // Rounded to the tick grid: 99.90 − 99.98 is −0.0800000000000125 in floats.
  return Math.round((move / tick) * 1e9) / 1e9;
}
