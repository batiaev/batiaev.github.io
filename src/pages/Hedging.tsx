import React, { Suspense, lazy, useState } from "react";
import { Link } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import NumberField from "@/components/options/NumberField";
import Field from "@/components/tools/Field";
import ToolLayout from "@/components/tools/ToolLayout";
import ToolNotes from "@/components/tools/ToolNotes";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { ROUTE_META } from "@/lib/routeMeta";
import { HEDGE_DEFAULTS } from "@/lib/options/hedging";

const HedgeFigure = lazy(() => import("@/components/learn/HedgeFigure"));

const ROUTE = "/tools/hedging";

interface Settings {
  spot: number;
  strike: number;
  days: number;
  impliedVol: number;
  realisedVol: number;
  rehedges: number;
  multiplier: number;
}

const INITIAL: Settings = {
  spot: HEDGE_DEFAULTS.spot,
  strike: HEDGE_DEFAULTS.strike,
  days: HEDGE_DEFAULTS.days,
  impliedVol: HEDGE_DEFAULTS.impliedVol * 100,
  realisedVol: HEDGE_DEFAULTS.impliedVol * 100,
  rehedges: HEDGE_DEFAULTS.rehedges,
  multiplier: HEDGE_DEFAULTS.multiplier,
};

const Hedging = () => {
  useDocumentMeta(ROUTE_META[ROUTE]);
  const [s, setS] = useState<Settings>(INITIAL);

  const set = <K extends keyof Settings>(key: K) => (value: number) =>
    setS((prev) => ({ ...prev, [key]: value }));

  const gap = s.realisedVol - s.impliedVol;

  return (
    <ToolLayout
      route={ROUTE}
      chip="Free tool"
      title="Dynamic hedging simulator"
      width="narrow"
      intro={
        <>
          Sell an option, delta-hedge it to expiry, and see what the premium
          actually buys. Set the volatility you sold at and the volatility the
          market goes on to deliver, and the difference between them shows up as
          P&amp;L. Runs in your browser on generated paths — no market data, no
          signup.
        </>
      }
    >
      <div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Spot">
            <NumberField
              value={s.spot}
              onChange={set("spot")}
              label="Spot price"
            />
          </Field>
          <Field label="Strike">
            <NumberField
              value={s.strike}
              onChange={set("strike")}
              label="Strike"
            />
          </Field>
          <Field label="Days to expiry">
            <NumberField
              value={s.days}
              onChange={set("days")}
              label="Days to expiry"
            />
          </Field>
          <Field label="Contract size">
            <NumberField
              value={s.multiplier}
              onChange={set("multiplier")}
              label="Contract multiplier"
            />
          </Field>
          <Field label="Sold at">
            <NumberField
              value={s.impliedVol}
              onChange={set("impliedVol")}
              label="Implied volatility sold"
              suffix="%"
            />
          </Field>
          <Field label="Market realises">
            <NumberField
              value={s.realisedVol}
              onChange={set("realisedVol")}
              label="Realised volatility"
              suffix="%"
            />
          </Field>
          <Field label="Rehedges">
            <NumberField
              value={s.rehedges}
              onChange={set("rehedges")}
              label="Number of rehedges"
            />
          </Field>
          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full"
              onClick={() => setS(INITIAL)}
            >
              <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
              Reset
            </Button>
          </div>
        </div>

        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          {Math.abs(gap) < 0.5
            ? "Selling and realising the same volatility: the hedge should cost about what you were paid."
            : gap < 0
              ? `Selling ${Math.abs(gap).toFixed(0)} vol points above what the market delivers — the quiet case, where you keep part of the premium.`
              : `Selling ${gap.toFixed(0)} vol points below what the market delivers — the hedge costs more than you were paid.`}
        </p>
      </div>

      <Suspense
        fallback={
          <div className="text-muted-foreground py-16 text-center text-sm">
            Loading simulation…
          </div>
        }
      >
        <HedgeFigure
          bare
          spot={s.spot}
          strike={s.strike}
          days={s.days}
          impliedVol={s.impliedVol / 100}
          realisedVol={s.realisedVol / 100}
          rehedges={s.rehedges}
          multiplier={s.multiplier}
        />
      </Suspense>

      <ToolNotes>
        <p>
          <strong className="text-foreground">Method.</strong> The path is a
          geometric Brownian motion with a risk-neutral drift, generated from a
          seed so the same button always gives the same story. Deltas come from
          the same Black-Scholes implementation as the{" "}
          <Link
            to="/tools/options-pnl"
            className="text-primary hover:underline"
          >
            options P&amp;L calculator
          </Link>
          . Cash is a real account: it receives the premium, pays for each
          rebalance and earns the risk-free rate in between.
        </p>
        <p>
          Transaction costs are zero here, which is the one assumption most
          likely to mislead. Hedging more often narrows the spread of outcomes
          but multiplies the turnover, and on a real desk that trade-off is where
          the argument actually happens — the reasoning is in{" "}
          <Link
            to="/learn/risk/dynamic-hedging"
            className="text-primary hover:underline"
          >
            the note on dynamic hedging
          </Link>
          .
        </p>
        <p className="text-xs">
          For education and analysis. Not investment advice, and not a
          substitute for your own risk figures.
        </p>
      </ToolNotes>
    </ToolLayout>
  );
};

export default Hedging;
