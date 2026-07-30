import React from "react";
import type { Metrics } from "@/lib/options/strategy";
import { formatGreek, formatPrice, formatSigned } from "@/lib/options/format";

interface Props {
  metrics: Metrics;
}

const Tile = ({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "neutral" | "profit" | "loss";
}) => (
  <div className="border-border/60 bg-background rounded-lg border p-3 sm:p-4">
    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
      {label}
    </p>
    <p
      className={`mt-1 text-lg font-semibold tabular-nums sm:text-xl ${
        tone === "profit"
          ? "text-emerald-600"
          : tone === "loss"
            ? "text-red-600"
            : ""
      }`}
    >
      {value}
    </p>
    {hint ? (
      <p className="text-muted-foreground mt-1 text-xs leading-snug">{hint}</p>
    ) : null}
  </div>
);

const MetricsBar = ({ metrics }: Props) => {
  const breakEvens = metrics.breakEvens.length
    ? metrics.breakEvens.map(formatPrice).join(" · ")
    : "None";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <Tile
          label="Max profit"
          value={
            metrics.maxProfit === Infinity
              ? "Unlimited"
              : formatSigned(metrics.maxProfit)
          }
          tone="profit"
        />
        <Tile
          label="Max loss"
          value={
            metrics.maxLoss === -Infinity
              ? "Unlimited"
              : formatSigned(metrics.maxLoss)
          }
          tone="loss"
        />
        <Tile label="Breakeven" value={breakEvens} hint="At expiry" />
        <Tile
          label={metrics.netCash >= 0 ? "Net credit" : "Net debit"}
          value={formatSigned(metrics.netCash)}
          hint="Cash at entry, all legs"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <Tile label="Delta Δ" value={formatGreek(metrics.delta)} hint="Per 1 point of underlying" />
        <Tile label="Gamma Γ" value={formatGreek(metrics.gamma, 3)} hint="Delta change per point" />
        <Tile label="Vega ν" value={formatGreek(metrics.vega)} hint="Per 1 vol point" />
        <Tile label="Theta Θ" value={formatGreek(metrics.theta)} hint="Per calendar day" />
      </div>
    </div>
  );
};

export default MetricsBar;
