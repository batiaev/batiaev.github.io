import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CurvePoint, Metrics, Position } from "@/lib/options/strategy";
import { formatCompact, formatPrice, formatSigned } from "@/lib/options/format";

const LEG_COLOURS = [
  "#0ea5e9",
  "#f97316",
  "#8b5cf6",
  "#14b8a6",
  "#ec4899",
  "#84cc16",
];

interface Props {
  curve: CurvePoint[];
  position: Position;
  metrics: Metrics;
  /** Series dataKeys currently hidden — "expiry", "valuation" or `legs.<id>`. */
  hiddenKeys: string[];
  onToggleKey: (dataKey: string) => void;
}

/**
 * Recharts types `dataKey` as `DataKey<any>`, which allows an accessor
 * function. Every series here uses a string key, so anything else is ignored.
 */
const seriesKey = (entry: unknown): string | null => {
  const key = (entry as { dataKey?: unknown } | null)?.dataKey;
  return typeof key === "string" ? key : null;
};

const legLabel = (
  leg: Position["legs"][number],
  index: number,
): string => {
  const side = leg.side === "long" ? "Long" : "Short";
  if (leg.kind === "underlying") {
    return `${index + 1}. ${side} underlying`;
  }
  return `${index + 1}. ${side} ${leg.strike} ${leg.kind}`;
};

const PayoffChart = ({
  curve,
  position,
  metrics,
  hiddenKeys,
  onToggleKey,
}: Props) => (
  <div className="h-[22rem] w-full sm:h-[26rem]">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={curve} margin={{ top: 8, right: 12, bottom: 8, left: 4 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.35} />
        <XAxis
          dataKey="price"
          type="number"
          domain={["dataMin", "dataMax"]}
          tickFormatter={formatCompact}
          fontSize={12}
          tickLine={false}
          label={{
            value: "Underlying price",
            position: "insideBottom",
            offset: -4,
            fontSize: 12,
          }}
        />
        <YAxis
          tickFormatter={formatCompact}
          fontSize={12}
          tickLine={false}
          width={56}
        />
        <Tooltip
          formatter={(value: number, name: string) => [formatSigned(value), name]}
          labelFormatter={(price: number) => `Underlying ${formatPrice(price)}`}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, cursor: "pointer" }}
          onClick={(entry) => {
            const key = seriesKey(entry);
            if (key) onToggleKey(key);
          }}
          formatter={(value, entry) => {
            const key = seriesKey(entry);
            const isHidden = key !== null && hiddenKeys.includes(key);
            return (
              <span
                style={{
                  opacity: isHidden ? 0.4 : 1,
                  textDecoration: isHidden ? "line-through" : "none",
                }}
              >
                {value}
              </span>
            );
          }}
        />

        <ReferenceLine y={0} stroke="currentColor" strokeOpacity={0.4} />
        <ReferenceLine
          x={position.price}
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeDasharray="4 4"
          label={{ value: "Spot", fontSize: 11, position: "insideTopRight" }}
        />
        {metrics.breakEvens.map((breakEven) => (
          <ReferenceLine
            key={breakEven}
            x={breakEven}
            stroke="#16a34a"
            strokeOpacity={0.5}
            strokeDasharray="2 4"
          />
        ))}

        {/*
          Hidden series stay mounted with `hide` rather than being unmounted,
          so their legend entries remain clickable to bring them back.
        */}
        {position.legs.map((leg, index) => (
          <Line
            key={leg.id}
            type="linear"
            dataKey={`legs.${leg.id}`}
            name={legLabel(leg, index)}
            stroke={LEG_COLOURS[index % LEG_COLOURS.length]}
            strokeWidth={1}
            strokeOpacity={0.75}
            dot={false}
            isAnimationActive={false}
            hide={hiddenKeys.includes(`legs.${leg.id}`)}
          />
        ))}

        <Line
          type="linear"
          dataKey="valuation"
          name={
            position.valuationDays > 0
              ? `In ${position.valuationDays} day${position.valuationDays === 1 ? "" : "s"}`
              : "Today"
          }
          stroke="#64748b"
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={false}
          isAnimationActive={false}
          hide={hiddenKeys.includes("valuation")}
        />
        <Line
          type="linear"
          dataKey="expiry"
          name="At expiry"
          stroke="hsl(var(--primary))"
          strokeWidth={2.5}
          dot={false}
          isAnimationActive={false}
          hide={hiddenKeys.includes("expiry")}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default PayoffChart;
