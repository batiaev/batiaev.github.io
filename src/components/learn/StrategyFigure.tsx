import React, { Suspense, lazy, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatSigned } from "@/lib/options/format";
import {
  DEFAULT_EXPIRY_DAYS,
  applyPreset,
  presets,
} from "@/lib/options/presets";
import {
  metrics as computeMetrics,
  payoffCurve,
  type Position,
} from "@/lib/options/strategy";
import { encodePosition } from "@/lib/options/share";

const PayoffChart = lazy(() => import("@/components/options/PayoffChart"));

const BASE: Omit<Position, "legs"> = {
  underlying: "spot",
  price: 100,
  vol: 0.25,
  rate: 0.04,
  dividend: 0,
  valuationDays: 0,
};

const gbpish = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 });

/**
 * A live payoff chart built from the same preset the calculator uses, so a
 * strategy page can never describe a shape the tool does not produce. The
 * spot and volatility sliders make it a toy you can poke rather than a
 * screenshot, and "open in the calculator" carries the exact position across.
 */
const StrategyFigure = ({ presetId }: { presetId: string }) => {
  const preset = presets.find((p) => p.id === presetId);
  const [spot, setSpot] = useState(BASE.price);
  const [vol, setVol] = useState(BASE.vol);
  const [days, setDays] = useState(0);

  const position = useMemo<Position | null>(() => {
    if (!preset) return null;
    return applyPreset(preset, {
      ...BASE,
      price: spot,
      vol,
      valuationDays: days,
      legs: [],
    });
  }, [preset, spot, vol, days]);

  const curve = useMemo(() => (position ? payoffCurve(position) : []), [position]);
  const metrics = useMemo(
    () => (position ? computeMetrics(position) : null),
    [position],
  );

  if (!preset || !position || !metrics) {
    return (
      <p className="border-border/60 text-muted-foreground my-6 rounded-lg border border-dashed p-4 text-sm">
        No preset named <code>{presetId}</code>.
      </p>
    );
  }

  const reset = () => {
    setSpot(BASE.price);
    setVol(BASE.vol);
    setDays(0);
  };

  return (
    <figure className="border-border/60 bg-background my-8 rounded-lg border p-4 sm:p-5">
      <Suspense
        fallback={
          <div className="text-muted-foreground flex h-[18rem] items-center justify-center text-sm">
            Loading chart…
          </div>
        }
      >
        <PayoffChart
          curve={curve}
          position={position}
          metrics={metrics}
          hiddenKeys={[]}
          onToggleKey={() => {}}
        />
      </Suspense>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-muted-foreground mb-1 flex justify-between text-xs font-medium">
            <span>Spot</span>
            <span className="tabular-nums">{gbpish.format(spot)}</span>
          </span>
          <input
            type="range"
            min={60}
            max={140}
            step={1}
            value={spot}
            onChange={(event) => setSpot(Number(event.target.value))}
            aria-label="Underlying price"
            className="accent-primary h-2 w-full cursor-pointer"
          />
        </label>
        <label className="block">
          <span className="text-muted-foreground mb-1 flex justify-between text-xs font-medium">
            <span>Volatility</span>
            <span className="tabular-nums">{Math.round(vol * 100)}%</span>
          </span>
          <input
            type="range"
            min={5}
            max={120}
            step={1}
            value={Math.round(vol * 100)}
            onChange={(event) => setVol(Number(event.target.value) / 100)}
            aria-label="Implied volatility"
            className="accent-primary h-2 w-full cursor-pointer"
          />
        </label>
        <label className="block">
          <span className="text-muted-foreground mb-1 flex justify-between text-xs font-medium">
            <span>Days elapsed</span>
            <span className="tabular-nums">{days}</span>
          </span>
          <input
            type="range"
            min={0}
            max={DEFAULT_EXPIRY_DAYS}
            step={1}
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            aria-label="Days from today"
            className="accent-primary h-2 w-full cursor-pointer"
          />
        </label>
      </div>

      <dl className="border-border/60 mt-4 grid grid-cols-2 gap-3 border-t pt-4 text-sm tabular-nums sm:grid-cols-4">
        <div>
          <dt className="text-muted-foreground text-xs uppercase tracking-wider">
            Max profit
          </dt>
          <dd className="font-medium">{formatSigned(metrics.maxProfit)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs uppercase tracking-wider">
            Max loss
          </dt>
          <dd className="font-medium">{formatSigned(metrics.maxLoss)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs uppercase tracking-wider">
            Breakeven
          </dt>
          <dd className="font-medium">
            {metrics.breakEvens.length
              ? metrics.breakEvens.map((b) => gbpish.format(b)).join(" / ")
              : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs uppercase tracking-wider">
            Net cash
          </dt>
          <dd className="font-medium">{formatSigned(metrics.netCash)}</dd>
        </div>
      </dl>

      <figcaption className="text-muted-foreground mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span>
          Priced at {gbpish.format(spot)} spot, {Math.round(vol * 100)}% vol,{" "}
          {DEFAULT_EXPIRY_DAYS - days} days left. Move the sliders.
        </span>
        <span className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground h-8"
            onClick={reset}
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Reset
          </Button>
          <Link
            to={`/tools/options-pnl?${encodePosition(position)}`}
            className="text-primary inline-flex items-center gap-1 font-medium hover:underline"
          >
            Open in the calculator
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </span>
      </figcaption>
    </figure>
  );
};

export default StrategyFigure;
