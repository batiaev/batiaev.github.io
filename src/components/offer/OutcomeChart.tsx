import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { OfferResult } from "@/lib/offer/compare";
import { scenarioOf } from "@/lib/offer/compare";
import type { Scenario } from "@/lib/offer/archetypes";

const COLOURS = ["#0ea5e9", "#f97316", "#8b5cf6", "#14b8a6"];

const compact = new Intl.NumberFormat("en-GB", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

interface Props {
  results: OfferResult[];
  scenario: Scenario;
}

/** Cumulative take-home over the horizon, one line per offer. */
const OutcomeChart = ({ results, scenario }: Props) => {
  const horizon = scenarioOf(results[0], scenario).years.length;

  const data = Array.from({ length: horizon }, (_, index) => {
    const point: Record<string, number> = { year: index + 1 };
    results.forEach((result) => {
      point[result.offer.id] =
        scenarioOf(result, scenario).years[index].cumulativeNet;
    });
    return point;
  });

  return (
    <div className="h-[20rem] w-full sm:h-[24rem]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.35} />
          <XAxis
            dataKey="year"
            fontSize={12}
            tickLine={false}
            label={{
              value: "Year",
              position: "insideBottom",
              offset: -4,
              fontSize: 12,
            }}
          />
          <YAxis
            tickFormatter={(value: number) => compact.format(value)}
            fontSize={12}
            tickLine={false}
            width={56}
          />
          <Tooltip
            formatter={(value: number, name: string) => [gbp.format(value), name]}
            labelFormatter={(year: number) => `After year ${year}`}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {results.map((result, index) => (
            <Line
              key={result.offer.id}
              type="monotone"
              dataKey={result.offer.id}
              name={result.offer.label}
              stroke={COLOURS[index % COLOURS.length]}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OutcomeChart;
