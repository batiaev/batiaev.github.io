import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HEDGE_DEFAULTS,
  simulateHedge,
  type HedgeResult,
} from "@/lib/options/hedging";

/**
 * Paths vetted offline for a readable story rather than picked at random: each
 * one realises close to the 25% it was sold at, moves enough to be worth
 * watching, and leaves a residual that looks like the hedging error it is. A
 * fresh draw every visit would sometimes show a flat line and sometimes a
 * blowout, and neither makes the point.
 */
const SEEDS = [185, 199, 28, 37, 207, 308, 602];

/** One frame per step at 60fps feels frantic; this reads like a tape. */
const MS_PER_STEP = 90;

const money = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
const signed = (value: number) =>
  `${value >= 0 ? "+" : "−"}${money.format(Math.abs(value))}`;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

interface Props {
  /** Volatility the path is asked to realise. Defaults to what it was sold at. */
  realisedVol?: number;
  /** Fixes the path, for the variants in the prose. */
  seed?: number;
  caption?: string;
  /** Shorter panes, for the homepage where this is proof rather than the subject. */
  compact?: boolean;
  /** Rendered next to the disclaimer — the way back to the full note. */
  footer?: React.ReactNode;
  /** Everything the tool page lets you change. */
  spot?: number;
  strike?: number;
  days?: number;
  impliedVol?: number;
  rate?: number;
  rehedges?: number;
  multiplier?: number;
  /** The tool page writes its own heading, so the figure drops its own. */
  bare?: boolean;
}

const Stat = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "good" | "bad";
}) => (
  <div>
    <dt className="text-muted-foreground text-xs uppercase tracking-wider">
      {label}
    </dt>
    <dd
      className={`mt-0.5 font-medium tabular-nums ${
        tone === "good"
          ? "text-emerald-600"
          : tone === "bad"
            ? "text-red-600"
            : ""
      }`}
    >
      {value}
    </dd>
  </div>
);

const HedgeFigure = ({
  seed,
  caption,
  compact = false,
  footer,
  bare = false,
  spot = HEDGE_DEFAULTS.spot,
  strike = HEDGE_DEFAULTS.strike,
  days = HEDGE_DEFAULTS.days,
  impliedVol = HEDGE_DEFAULTS.impliedVol,
  rate = HEDGE_DEFAULTS.rate,
  rehedges = HEDGE_DEFAULTS.rehedges,
  multiplier = HEDGE_DEFAULTS.multiplier,
  realisedVol = impliedVol,
}: Props) => {
  const figureRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number>();
  const [pick, setPick] = useState(() => seed ?? SEEDS[0]);
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);

  const result: HedgeResult = useMemo(
    () =>
      simulateHedge({
        spot,
        strike,
        days,
        impliedVol,
        realisedVol,
        rate,
        rehedges,
        multiplier,
        seed: pick,
      }),
    [pick, spot, strike, days, impliedVol, realisedVol, rate, rehedges, multiplier],
  );

  const total = result.steps.length;

  // The whole series is computed up front — playback only reveals more of it,
  // so a frame never costs more than a re-render.
  const play = React.useCallback(() => {
    if (prefersReducedMotion()) {
      setShown(total);
      setDone(true);
      return;
    }
    setDone(false);
    setShown(1);
    const started = performance.now();
    const tick = (now: number) => {
      const step = Math.min(
        total,
        1 + Math.floor((now - started) / MS_PER_STEP),
      );
      setShown(step);
      if (step >= total) {
        setDone(true);
        return;
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
  }, [total]);

  // Runs when it is actually looked at, once, and never in the background.
  useEffect(() => {
    const el = figureRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined" || prefersReducedMotion()) {
      setShown(total);
      setDone(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          play();
        });
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [play, total]);

  const again = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    const next = seed ?? SEEDS[(SEEDS.indexOf(pick) + 1) % SEEDS.length];
    if (next === pick) play();
    else setPick(next);
  };

  // Re-run whenever the path changes, but not on the very first mount — the
  // observer owns that.
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    play();
  }, [pick, play]);

  const data = result.steps.slice(0, Math.max(shown, 1)).map((step) => ({
    day: Math.round(step.day),
    spot: step.spot,
    pnl: step.pnl,
  }));

  const last = result.steps[Math.max(shown, 1) - 1];
  const kept = done ? result.finalPnl : last.pnl;
  const hedgingCost = result.premiumCash - kept;

  const spots = result.steps.map((s) => s.spot);
  const spotDomain: [number, number] = [
    Math.floor(Math.min(...spots) - 1),
    Math.ceil(Math.max(...spots) + 1),
  ];
  const pnls = result.steps.map((s) => s.pnl);
  const pnlBound =
    Math.ceil(Math.max(...pnls.map(Math.abs), result.premiumCash * 0.25) / 50) *
    50;

  return (
    <figure
      ref={figureRef}
      className="border-border/60 bg-background my-8 rounded-lg border p-4 sm:p-5"
    >
      {bare ? null : (
        <figcaption className="mb-4">
          <h3 className="text-base font-semibold">
            Short one {strike} call, hedged {rehedges} times to expiry
          </h3>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            {caption ??
              `Sold at ${Math.round(impliedVol * 100)}% implied volatility. Watch the premium leave through the hedge.`}
          </p>
        </figcaption>
      )}

      <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wider">
        Underlying
      </p>
      <div className={compact ? "h-32 w-full sm:h-36" : "h-44 w-full sm:h-52"}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 6, right: 8, bottom: 0, left: 0 }}
          >
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
            {/* The lower chart carries the shared time axis for both. */}
            <XAxis
              dataKey="day"
              type="number"
              domain={[0, days]}
              tick={false}
              height={4}
              stroke="hsl(var(--border))"
            />
            <YAxis
              domain={spotDomain}
              width={38}
              tick={{ fontSize: 11 }}
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
            />
            <ReferenceLine
              y={strike}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="4 4"
              label={{ value: "strike", fontSize: 10, position: "insideTopLeft" }}
            />
            <Line
              type="monotone"
              dataKey="spot"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-muted-foreground mb-1 mt-3 text-xs font-medium uppercase tracking-wider">
        P&amp;L of the hedged book
      </p>
      <div className={compact ? "h-32 w-full sm:h-36" : "h-40 w-full sm:h-44"}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 6, right: 8, bottom: 16, left: 0 }}
          >
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="day"
              type="number"
              domain={[0, days]}
              tick={{ fontSize: 11 }}
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              label={{
                value: "days elapsed",
                fontSize: 10,
                position: "insideBottom",
                offset: -2,
                fill: "hsl(var(--muted-foreground))",
              }}
            />
            <YAxis
              domain={[-pnlBound, pnlBound]}
              width={38}
              tick={{ fontSize: 11 }}
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
            />
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
            <Line
              type="monotone"
              dataKey="pnl"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <dl className="border-border/60 mt-4 grid grid-cols-2 gap-3 border-t pt-4 text-sm sm:grid-cols-4">
        <Stat label="Premium sold" value={money.format(result.premiumCash)} />
        <Stat label="Cost of hedging" value={money.format(hedgingCost)} />
        <Stat
          label="Kept"
          value={signed(kept)}
          tone={kept >= 0 ? "good" : "bad"}
        />
        <Stat
          label="Realised vol"
          value={`${(result.realisedVol * 100).toFixed(1)}% vs ${Math.round(impliedVol * 100)}%`}
        />
      </dl>

      <div className="text-muted-foreground mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span>
          Simulated path, Black-Scholes greeks, cash earning the risk-free rate.
          Not market data.
          {footer ? <> {footer}</> : null}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground h-8"
          onClick={again}
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden />
          {seed ? "Run again" : "Another path"}
        </Button>
      </div>
    </figure>
  );
};

export default HedgeFigure;
