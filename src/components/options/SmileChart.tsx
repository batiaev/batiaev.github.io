import React from "react";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  XAxis,
  YAxis,
} from "recharts";
import type { SmileFit } from "@/lib/options/smile";
import { smileCurve } from "@/lib/options/smile";

interface Props {
  fit: SmileFit;
}

const pct = (v: number) => `${(v * 100).toFixed(0)}%`;

interface Row {
  strike: number;
  /** The fitted curve, on the dense sample points. */
  vol?: number;
  /** Mid implied vol, only on strikes that actually have a quote. */
  quiet?: number;
  flagged?: number;
  /** [down, up] from the mid to the bid and ask, in vol terms. */
  err?: [number, number];
}

/**
 * The market as a band per strike, and the fit as a line through it.
 *
 * A single mid point per strike would hide the one thing that decides whether
 * a discrepancy means anything: how wide the market is there. A curve passing
 * inside the band has not disagreed with anybody, so the bands are the point
 * and the dots are incidental.
 */
const SmileChart = ({ fit }: Props) => {
  const curve = smileCurve(fit);
  const quoted = fit.points.filter((p) => p.band.mid !== null);

  const rows: Row[] = [
    ...curve.map((c) => ({ strike: c.strike, vol: c.vol })),
    ...quoted.map((p) => {
      const mid = p.band.mid as number;
      const bid = p.band.bid ?? mid;
      const ask = p.band.ask ?? mid;
      return {
        strike: p.strike,
        [p.outsideSpread ? "flagged" : "quiet"]: mid,
        err: [mid - bid, ask - mid] as [number, number],
      } as Row;
    }),
  ].sort((a, b) => a.strike - b.strike);

  const vols = [
    ...curve.map((c) => c.vol),
    ...quoted.flatMap((p) => [
      p.band.bid ?? (p.band.mid as number),
      p.band.ask ?? (p.band.mid as number),
    ]),
  ];
  const low = Math.min(...vols);
  const high = Math.max(...vols);
  const pad = Math.max((high - low) * 0.18, 0.01);

  const strikes = fit.points.map((p) => p.strike);
  const span = Math.max(...strikes) - Math.min(...strikes);

  return (
    <div className="h-64 w-full sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={rows} margin={{ top: 8, right: 12, bottom: 18, left: 0 }}>
          <CartesianGrid
            stroke="hsl(var(--border))"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="strike"
            type="number"
            domain={[
              Math.min(...strikes) - span * 0.06,
              Math.max(...strikes) + span * 0.06,
            ]}
            tick={{ fontSize: 11 }}
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            label={{
              value: "strike",
              fontSize: 10,
              position: "insideBottom",
              offset: -6,
              fill: "hsl(var(--muted-foreground))",
            }}
          />
          <YAxis
            type="number"
            domain={[low - pad, high + pad]}
            tickFormatter={pct}
            width={44}
            tick={{ fontSize: 11 }}
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
          />

          <ReferenceLine
            x={fit.forward}
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="4 4"
            label={{
              value: "forward",
              fontSize: 10,
              position: "insideTopRight",
              fill: "hsl(var(--muted-foreground))",
            }}
          />

          {/* One segment per strike, spanning bid IV to ask IV. Drawn as
              reference segments rather than error bars because that is the
              part of the API that survives a recharts major version. */}
          {quoted.map((p) => (
            <ReferenceLine
              key={`band-${p.strike}`}
              segment={[
                { x: p.strike, y: p.band.bid ?? (p.band.mid as number) },
                { x: p.strike, y: p.band.ask ?? (p.band.mid as number) },
              ]}
              stroke={p.outsideSpread ? "#f97316" : "#94a3b8"}
              strokeWidth={p.outsideSpread ? 4 : 3}
              strokeLinecap="round"
              ifOverflow="extendDomain"
            />
          ))}

          <Scatter dataKey="quiet" fill="#64748b" isAnimationActive={false} />
          <Scatter dataKey="flagged" fill="#ea580c" isAnimationActive={false} />

          <Line
            type="monotone"
            dataKey="vol"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SmileChart;
