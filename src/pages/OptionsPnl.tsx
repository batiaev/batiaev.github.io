import React, { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Link2, RotateCcw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import LegsEditor from "@/components/options/LegsEditor";
import MetricsBar from "@/components/options/MetricsBar";
import NumberField from "@/components/options/NumberField";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { valueOption } from "@/lib/options/blackScholes";
import {
  DEFAULT_EXPIRY_DAYS,
  DEFAULT_MULTIPLIER,
  applyPreset,
  defaultPosition,
  presets,
} from "@/lib/options/presets";
import {
  metrics as computeMetrics,
  newLegId,
  payoffCurve,
  type Leg,
  type Position,
} from "@/lib/options/strategy";
import {
  decodePosition,
  loadPosition,
  savePosition,
  shareUrl,
} from "@/lib/options/share";

const PayoffChart = lazy(() => import("@/components/options/PayoffChart"));

const SELECT_CLASS =
  "h-10 w-full rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function initialPosition(): Position {
  return (
    decodePosition(window.location.search) ??
    loadPosition() ??
    defaultPosition()
  );
}

const Control = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="text-muted-foreground mb-1 block text-xs font-medium uppercase tracking-wider">
      {label}
    </span>
    {children}
    {hint ? (
      <span className="text-muted-foreground mt-1 block text-xs">{hint}</span>
    ) : null}
  </label>
);

const OptionsPnl = () => {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [hiddenLegs, setHiddenLegs] = useState<string[]>([]);

  useDocumentMeta({
    title: "Options P&L calculator — payoff, Greeks, breakevens | Anton Batiaev",
    description:
      "Free options strategy calculator: exact expiry payoff, Black-Scholes and Black-76 P&L before expiry, Greeks, breakevens and shareable links. No signup, runs in your browser.",
  });

  useEffect(() => {
    savePosition(position);
  }, [position]);

  const curve = useMemo(() => payoffCurve(position), [position]);
  const metrics = useMemo(() => computeMetrics(position), [position]);

  const maxLegDays = useMemo(
    () =>
      position.legs.reduce(
        (longest, leg) =>
          leg.kind === "underlying" ? longest : Math.max(longest, leg.days),
        DEFAULT_EXPIRY_DAYS,
      ),
    [position.legs],
  );

  const visibleLegs = position.legs
    .map((leg) => leg.id)
    .filter((id) => !hiddenLegs.includes(id));

  const patchPosition = (patch: Partial<Position>) =>
    setPosition((current) => ({ ...current, ...patch }));

  const updateLeg = (id: string, patch: Partial<Leg>) =>
    setPosition((current) => ({
      ...current,
      legs: current.legs.map((leg) =>
        leg.id === id ? { ...leg, ...patch } : leg,
      ),
    }));

  const removeLeg = (id: string) =>
    setPosition((current) => ({
      ...current,
      legs: current.legs.filter((leg) => leg.id !== id),
    }));

  const addLeg = () =>
    setPosition((current) => {
      const strike = Math.round(current.price);
      const { price } = valueOption("call", {
        price: current.price,
        strike,
        years: DEFAULT_EXPIRY_DAYS / 365,
        rate: current.rate,
        carry:
          current.underlying === "future" ? current.rate : current.dividend,
        vol: current.vol,
      });

      const leg: Leg = {
        id: newLegId(),
        kind: "call",
        side: "long",
        qty: 1,
        strike,
        premium: Math.max(Math.round(price * 100) / 100, 0.01),
        days: maxLegDays,
        multiplier: DEFAULT_MULTIPLIER,
      };

      return { ...current, legs: [...current.legs, leg] };
    });

  const toggleLeg = (id: string) =>
    setHiddenLegs((current) =>
      current.includes(id)
        ? current.filter((hidden) => hidden !== id)
        : [...current, id],
    );

  const copyLink = async () => {
    const url = shareUrl(position);
    window.history.replaceState(null, "", url);

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied", {
        description: "The URL carries the full strategy.",
      });
    } catch {
      toast.info("Share link is in the address bar");
    }
  };

  const reset = () => {
    setPosition(defaultPosition());
    setHiddenLegs([]);
    window.history.replaceState(null, "", window.location.pathname);
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header />
      <main>
        <section className="border-border/40 border-b py-10 sm:py-14">
          <div className="container mx-auto px-4">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground mb-6 inline-flex min-h-11 items-center gap-2 text-sm"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to home
            </Link>
            <div className="max-w-2xl">
              <div className="highlight-chip">Free tool</div>
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Options P&amp;L calculator
              </h1>
              <p className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg">
                Build a strategy leg by leg and see the exact payoff at expiry,
                the modelled P&amp;L before expiry, breakevens, and aggregate
                Greeks. Everything runs in your browser — no signup, no data
                leaves the page, and the URL carries the whole position.
              </p>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <div className="container mx-auto space-y-8 px-4">
            <div>
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Presets
              </h2>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <Button
                    key={preset.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="min-h-10"
                    title={preset.blurb}
                    onClick={() => {
                      setPosition((current) => applyPreset(preset, current));
                      setHiddenLegs([]);
                    }}
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              <Control label="Underlying">
                <select
                  aria-label="Underlying type"
                  className={SELECT_CLASS}
                  value={position.underlying}
                  onChange={(event) =>
                    patchPosition({
                      underlying: event.target.value as Position["underlying"],
                    })
                  }
                >
                  <option value="spot">Spot</option>
                  <option value="future">Future</option>
                </select>
              </Control>

              <Control label={position.underlying === "future" ? "Futures price" : "Spot price"}>
                <NumberField
                  label="Underlying price"
                  value={position.price}
                  onChange={(price) => patchPosition({ price })}
                />
              </Control>

              <Control label="Volatility">
                <NumberField
                  label="Implied volatility, percent"
                  suffix="%"
                  value={Math.round(position.vol * 10000) / 100}
                  onChange={(vol) => patchPosition({ vol: vol / 100 })}
                />
              </Control>

              <Control label="Rate">
                <NumberField
                  label="Risk-free rate, percent"
                  suffix="%"
                  value={Math.round(position.rate * 10000) / 100}
                  onChange={(rate) => patchPosition({ rate: rate / 100 })}
                />
              </Control>

              <Control
                label="Dividend"
                hint={
                  position.underlying === "future"
                    ? "Ignored: Black-76"
                    : undefined
                }
              >
                <NumberField
                  label="Dividend yield, percent"
                  suffix="%"
                  disabled={position.underlying === "future"}
                  value={Math.round(position.dividend * 10000) / 100}
                  onChange={(dividend) => patchPosition({ dividend: dividend / 100 })}
                />
              </Control>

              <Control label="P&L in (days)" hint={`0 = today, ${maxLegDays} = expiry`}>
                <NumberField
                  label="Days from today for the modelled P&L curve"
                  value={position.valuationDays}
                  onChange={(valuationDays) =>
                    patchPosition({
                      valuationDays: Math.min(
                        Math.max(valuationDays, 0),
                        maxLegDays,
                      ),
                    })
                  }
                />
              </Control>
            </div>

            <input
              type="range"
              min={0}
              max={maxLegDays}
              step={1}
              value={Math.min(position.valuationDays, maxLegDays)}
              onChange={(event) =>
                patchPosition({ valuationDays: Number(event.target.value) })
              }
              aria-label="Days from today for the modelled P&L curve"
              className="accent-primary h-2 w-full cursor-pointer"
            />

            <MetricsBar metrics={metrics} />

            <div className="border-border/60 bg-background rounded-lg border p-3 sm:p-5">
              <Suspense
                fallback={
                  <div className="text-muted-foreground flex h-[22rem] items-center justify-center text-sm sm:h-[26rem]">
                    Loading chart…
                  </div>
                }
              >
                <PayoffChart
                  curve={curve}
                  position={position}
                  metrics={metrics}
                  visibleLegs={visibleLegs}
                />
              </Suspense>
            </div>

            <div>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Legs
                </h2>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="min-h-10"
                    onClick={copyLink}
                  >
                    <Link2 className="mr-2 h-4 w-4" aria-hidden />
                    Copy share link
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="min-h-10"
                    onClick={reset}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
                    Reset
                  </Button>
                </div>
              </div>

              <LegsEditor
                legs={position.legs}
                visibleLegs={visibleLegs}
                onChange={updateLeg}
                onRemove={removeLeg}
                onAdd={addLeg}
                onToggleVisible={toggleLeg}
              />
            </div>

            <div className="border-border/40 text-muted-foreground space-y-3 border-t pt-8 text-sm leading-relaxed">
              <p>
                <strong className="text-foreground">Method.</strong> The expiry
                line is exact intrinsic value, so its kinks sit precisely on the
                strikes. The pre-expiry line and the Greeks come from
                Black-Scholes-Merton with a continuous dividend yield for spot
                underlyings, and Black-76 for futures. European exercise, one
                volatility across all legs, quantities in contracts × multiplier.
              </p>
              <p>
                Vega is quoted per one volatility point, theta per calendar day.
                Positions are kept in this browser only, and the share link
                encodes them in the URL rather than on a server.
              </p>
              <p>
                Want this against your real positions?{" "}
                <a
                  href="https://fintecy.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Fintecy
                </a>{" "}
                connects brokers read-only and does the same maths on what you
                actually hold.
              </p>
              <p className="text-xs">
                For education and analysis. Not investment advice, and not a
                substitute for your broker&apos;s risk figures.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OptionsPnl;
