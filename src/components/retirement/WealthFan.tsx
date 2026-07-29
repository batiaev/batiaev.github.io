import React from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { PlanResult } from "@/lib/retirement/plan";

interface Props {
  result: PlanResult;
  retireAge: number;
  /** Told about the clipped tail so the caption can say so. */
  onClip?: (clipped: boolean) => void;
}

const compact = new Intl.NumberFormat("en-GB", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/**
 * Net worth as a fan rather than a line.
 *
 * A single projected line is the thing that makes retirement plans feel
 * settled when they are not — it is one draw from a wide distribution, shown
 * with the uncertainty removed. The shaded bands are the point: the middle
 * half of outcomes, and then the tenth to the ninetieth. Where the lower edge
 * reaches zero before the plan ends is where the plan fails.
 */
const WealthFan = ({ result, retireAge, onClip }: Props) => {
  const data = result.band.map((y) => ({
    age: y.age,
    outer: [y.p10, y.p90] as [number, number],
    inner: [y.p25, y.p75] as [number, number],
    median: y.median,
  }));

  /**
   * The top of the fan is deliberately cut off.
   *
   * Compounding a volatile return for fifty years produces a ninetieth
   * percentile several times the median — arithmetically right, and useless to
   * look at, because it squashes the only part anyone is asking about into a
   * sliver above the axis. The question here is whether the money runs out, so
   * the scale is set by the upper-middle of the distribution and the lucky tail
   * is allowed to leave the frame.
   */
  const last = result.band[result.band.length - 1];
  const peakMedian = data.reduce((max, d) => Math.max(max, d.median), 0);
  // A floor keeps an empty or impossible plan from asking recharts for a
  // zero-height axis, which it renders as NaN coordinates.
  const ceiling = Math.max(
    Math.max(last?.p75 ?? 0, last?.median ?? 0, peakMedian) * 1.35,
    1_000,
  );
  const clipped = (last?.p90 ?? 0) > ceiling;

  React.useEffect(() => onClip?.(clipped), [clipped, onClip]);

  return (
    <div className="h-72 w-full sm:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 12, bottom: 18, left: 0 }}>
          <CartesianGrid
            stroke="hsl(var(--border))"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="age"
            type="number"
            domain={["dataMin", "dataMax"]}
            tick={{ fontSize: 11 }}
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            label={{
              value: "age",
              fontSize: 10,
              position: "insideBottom",
              offset: -6,
              fill: "hsl(var(--muted-foreground))",
            }}
          />
          <YAxis
            domain={[0, ceiling]}
            allowDataOverflow
            tickFormatter={(v: number) => `£${compact.format(v)}`}
            width={56}
            tick={{ fontSize: 11 }}
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
          />

          <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
          <ReferenceLine
            x={retireAge}
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="4 4"
            label={{
              value: "retire",
              fontSize: 10,
              position: "insideTopLeft",
              fill: "hsl(var(--muted-foreground))",
            }}
          />

          <Area
            dataKey="outer"
            stroke="none"
            fill="hsl(var(--primary))"
            fillOpacity={0.12}
            isAnimationActive={false}
          />
          <Area
            dataKey="inner"
            stroke="none"
            fill="hsl(var(--primary))"
            fillOpacity={0.22}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="median"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WealthFan;
