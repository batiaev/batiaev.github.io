import React, { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowUpRight,
  Link2,
  RotateCcw,
  Settings2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LegsEditor from "@/components/options/LegsEditor";
import MetricsBar from "@/components/options/MetricsBar";
import NumberField from "@/components/options/NumberField";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { ROUTE_META } from "@/lib/routeMeta";
import {
  DEFAULT_EXPIRY_DAYS,
  applyPreset,
  buildQuickLeg,
  defaultPosition,
  presets,
  repriceAutoLegs,
  theoreticalPremium,
} from "@/lib/options/presets";
import {
  metrics as computeMetrics,
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
  const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);

  useDocumentMeta(ROUTE_META["/tools/options-pnl"]);

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
    .filter((id) => !hiddenKeys.includes(`legs.${id}`));

  /** Every mutation funnels through here so "auto" legs stay priced at market. */
  const patchPosition = (patch: Partial<Position>) =>
    setPosition((current) => repriceAutoLegs({ ...current, ...patch }));

  const updateLeg = (id: string, patch: Partial<Leg>) =>
    setPosition((current) =>
      repriceAutoLegs({
        ...current,
        legs: current.legs.map((leg) =>
          leg.id === id ? { ...leg, ...patch } : leg,
        ),
      }),
    );

  const removeLeg = (id: string) =>
    setPosition((current) => ({
      ...current,
      legs: current.legs.filter((leg) => leg.id !== id),
    }));

  const addLeg = (kind: Leg["kind"], side: Leg["side"]) =>
    setPosition((current) => {
      // Carry the strike over from the last option leg so building a spread is
      // add-then-nudge rather than add-then-retype.
      const inherited = [...current.legs]
        .reverse()
        .find((leg) => leg.kind !== "underlying")?.strike;

      const leg = buildQuickLeg(kind, side, current, maxLegDays, inherited);
      return { ...current, legs: [...current.legs, leg] };
    });

  /** Drops a manual premium back onto the model price. */
  const repriceLeg = (id: string) =>
    setPosition((current) => ({
      ...current,
      legs: current.legs.map((leg) => {
        if (leg.id !== id) return leg;
        const premium =
          leg.kind === "underlying"
            ? current.price
            : theoreticalPremium(leg.kind, leg.strike, leg.days, current);
        return { ...leg, premium, premiumMode: "auto" as const };
      }),
    }));

  const toggleKey = (dataKey: string) =>
    setHiddenKeys((current) =>
      current.includes(dataKey)
        ? current.filter((hidden) => hidden !== dataKey)
        : [...current, dataKey],
    );

  const toggleLeg = (id: string) => toggleKey(`legs.${id}`);

  const pct = (value: number) => `${Math.round(value * 10000) / 100}%`;

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
    setHiddenKeys([]);
    window.history.replaceState(null, "", window.location.pathname);
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
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
                      setHiddenKeys([]);
                    }}
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-4">
              <div className="w-36">
                <Control
                  label={
                    position.underlying === "future"
                      ? "Futures price"
                      : "Spot price"
                  }
                >
                  <NumberField
                    label="Underlying price"
                    value={position.price}
                    onChange={(price) => patchPosition({ price })}
                  />
                </Control>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-10 gap-2 font-normal"
                  >
                    <Settings2 className="h-4 w-4" aria-hidden />
                    <span className="text-muted-foreground tabular-nums">
                      {position.underlying === "future" ? "Future" : "Spot"} · IV{" "}
                      {pct(position.vol)} · r {pct(position.rate)}
                      {position.underlying === "future"
                        ? ""
                        : ` · q ${pct(position.dividend)}`}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-80 space-y-4">
                  <div>
                    <h2 className="text-sm font-medium">Market assumptions</h2>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                      These drive the model price, the pre-expiry curve, and the
                      Greeks.
                    </p>
                  </div>

                  <Control label="Underlying">
                    <select
                      aria-label="Underlying type"
                      className={SELECT_CLASS}
                      value={position.underlying}
                      onChange={(event) =>
                        patchPosition({
                          underlying: event.target
                            .value as Position["underlying"],
                        })
                      }
                    >
                      <option value="spot">Spot</option>
                      <option value="future">Future</option>
                    </select>
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
                        ? "Ignored: Black-76 uses the rate as carry"
                        : undefined
                    }
                  >
                    <NumberField
                      label="Dividend yield, percent"
                      suffix="%"
                      disabled={position.underlying === "future"}
                      value={Math.round(position.dividend * 10000) / 100}
                      onChange={(dividend) =>
                        patchPosition({ dividend: dividend / 100 })
                      }
                    />
                  </Control>
                </PopoverContent>
              </Popover>

              <div className="min-w-[16rem] flex-1">
                <span className="text-muted-foreground mb-1 block text-xs font-medium uppercase tracking-wider">
                  P&amp;L in {position.valuationDays} day
                  {position.valuationDays === 1 ? "" : "s"}
                  <span className="normal-case tracking-normal">
                    {" "}
                    — 0 is today, {maxLegDays} is expiry
                  </span>
                </span>
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
              </div>
            </div>

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
                  hiddenKeys={hiddenKeys}
                  onToggleKey={toggleKey}
                />
              </Suspense>
            </div>

            <a
              href="https://fintecy.co"
              target="_blank"
              rel="noopener noreferrer"
              className="group border-border/60 bg-accent/30 hover:border-border flex flex-col gap-1 rounded-lg border p-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:items-center sm:justify-between sm:gap-6"
            >
              <span>
                <span className="block text-base font-semibold">
                  Want this against your real positions?
                </span>
                <span className="text-muted-foreground mt-1 block text-sm leading-relaxed">
                  Fintecy connects your brokers read-only and runs the same
                  maths on what you actually hold — live Greeks, realised P&amp;L
                  and payoff across every account. Private beta.
                </span>
              </span>
              <span className="text-primary inline-flex shrink-0 items-center gap-1 text-sm font-medium">
                Join the waitlist
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </a>

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
                onReprice={repriceLeg}
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
