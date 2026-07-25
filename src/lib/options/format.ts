const amount = new Intl.NumberFormat("en-GB", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const compact = new Intl.NumberFormat("en-GB", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** Currency-agnostic: the underlying might be quoted in anything. */
export function formatAmount(value: number): string {
  if (!Number.isFinite(value)) return value > 0 ? "Unlimited" : "Unlimited";
  return amount.format(value);
}

export function formatSigned(value: number): string {
  if (!Number.isFinite(value)) {
    return value > 0 ? "Unlimited" : "Unlimited";
  }
  const rounded = Math.abs(value) < 0.005 ? 0 : value;
  return `${rounded > 0 ? "+" : ""}${amount.format(rounded)}`;
}

export function formatCompact(value: number): string {
  if (!Number.isFinite(value)) return "∞";
  return compact.format(value);
}

export function formatGreek(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "—";
  const rounded = Math.abs(value) < 0.005 ? 0 : value;
  return `${rounded > 0 ? "+" : ""}${rounded.toFixed(digits)}`;
}

export function formatPrice(value: number): string {
  return amount.format(value);
}
