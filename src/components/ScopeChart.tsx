import React from "react";
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { scopeRows } from "@/lib/scopeRows";

const ROW_HEIGHT = 46;

interface TickProps {
  x?: number;
  y?: number;
  payload?: { index?: number };
}

const RoleTick = ({ x = 0, y = 0, payload }: TickProps) => {
  const row = scopeRows[payload?.index ?? 0];
  if (!row) return null;

  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="end" fontSize={12} dy={-1} className="fill-foreground">
        {row.role}
      </text>
      <text
        textAnchor="end"
        fontSize={10}
        dy={13}
        className="fill-muted-foreground"
      >
        {row.note}
      </text>
    </g>
  );
};

const ScopeChart = () => (
  <figure className="border-border/50 bg-background/80 mx-auto mt-10 max-w-3xl rounded-lg border p-5 sm:p-6">
    <figcaption className="mb-5">
      <h3 className="text-base font-semibold sm:text-lg">
        Direct reports, and the size of the problem behind them
      </h3>
      <p className="text-muted-foreground mt-1 text-sm">
        Bars are engineers reporting into me. Under each role is what that team
        was carrying — the units differ on purpose, because the problems did.
      </p>
    </figcaption>

    <div
      className="w-full"
      style={{ height: scopeRows.length * ROW_HEIGHT + 12 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={scopeRows}
          layout="vertical"
          margin={{ top: 4, right: 40, bottom: 4, left: 0 }}
          barCategoryGap="28%"
        >
          <XAxis
            type="number"
            domain={[
              0,
              Math.max(...scopeRows.map((row) => row.engineers)) * 1.05,
            ]}
            hide
          />
          <YAxis
            type="category"
            dataKey="role"
            width={132}
            tickLine={false}
            axisLine={false}
            interval={0}
            tick={<RoleTick />}
          />
          <Bar
            dataKey="engineers"
            fill="hsl(var(--primary))"
            radius={[0, 6, 6, 0]}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="engineers"
              position="right"
              fontSize={12}
              className="fill-foreground font-medium"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </figure>
);

export default ScopeChart;
