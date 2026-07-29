import React, { Suspense, lazy, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import NumberField from "@/components/options/NumberField";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { ROUTE_META } from "@/lib/routeMeta";
import {
  simulatePlan,
  ISA_ANNUAL_LIMIT,
  LISA_ANNUAL_LIMIT,
  LISA_ACCESS_AGE,
  PENSION_ACCESS_AGE,
  TARGET_CONFIDENCE,
  type PlanInput,
} from "@/lib/retirement/plan";

const WealthFan = lazy(() => import("@/components/retirement/WealthFan"));

const ROUTE = "/tools/retirement";

const INITIAL: PlanInput = {
  currentAge: 40,
  retireAge: 60,
  planToAge: 95,
  isaBalance: 150_000,
  lisaBalance: 0,
  pensionBalance: 250_000,
  isaContribution: 12_000,
  lisaContribution: 0,
  pensionContribution: 12_000,
  employerContribution: 8_000,
  pensionReliefRate: 40,
  spending: 50_000,
  otherIncome: 12_000,
  otherIncomeAge: 68,
  realReturn: 4.5,
  volatility: 15,
  fees: 0.4,
  paths: 1_000,
  seed: 7,
};

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

/**
 * A number you can type or drag.
 *
 * Retirement inputs are guesses, and the useful move is nudging one to see
 * which way the answer goes — which is a slider's job. The box stays because
 * some of these are known exactly, and because a slider cannot express
 * £412,806. The slider clamps to a sensible range; the box does not.
 */
const Control = ({
  label,
  hint,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
}) => (
  <div>
    <span className="text-muted-foreground mb-1 block text-xs font-medium uppercase tracking-wider">
      {label}
    </span>
    <NumberField
      value={value}
      onChange={onChange}
      label={label}
      suffix={suffix}
    />
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={Math.min(Math.max(value, min), max)}
      onChange={(event) => onChange(Number(event.target.value))}
      aria-label={`${label} slider`}
      className="accent-primary mt-2 h-1.5 w-full cursor-pointer"
    />
    {hint ? (
      <span className="text-muted-foreground/80 mt-1 block text-xs">{hint}</span>
    ) : null}
  </div>
);

const Group = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
      {title}
    </h2>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{children}</div>
  </div>
);

const Retirement = () => {
  useDocumentMeta(ROUTE_META[ROUTE]);
  const [s, setS] = useState<PlanInput>(INITIAL);
  const [tailClipped, setTailClipped] = useState(false);

  const set = <K extends keyof PlanInput>(key: K) => (value: number) =>
    setS((prev) => ({ ...prev, [key]: value }));

  // Percentages live as whole numbers in the form and become decimals here, so
  // the inputs read the way people say them.
  const result = useMemo(
    () =>
      simulatePlan({
        ...s,
        pensionReliefRate: s.pensionReliefRate / 100,
        realReturn: s.realReturn / 100,
        volatility: s.volatility / 100,
        fees: s.fees / 100,
      }),
    [s],
  );

  const success = result.successRate;
  const tone =
    success >= 0.85
      ? "text-emerald-600"
      : success >= 0.6
        ? "text-amber-600"
        : "text-red-600";

  const verdict =
    success >= 0.9
      ? "Comfortable. The plan survives all but the worst sequences."
      : success >= 0.75
        ? "Workable, with room to be unlucky — but not much."
        : success >= 0.5
          ? "A coin flip. Worth changing something while there is time to."
          : "This plan runs out in most futures, not just the bad ones.";

  const isaHeadroom = Math.max(
    ISA_ANNUAL_LIMIT - s.isaContribution - s.lisaContribution,
    0,
  );

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <Header />
      <main>
        <section className="border-border/40 border-b py-10 sm:py-14">
          <div className="container mx-auto px-4">
            <Link
              to="/tools"
              className="text-muted-foreground hover:text-foreground mb-6 inline-flex min-h-11 items-center gap-2 text-sm"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              All tools
            </Link>
            <div className="max-w-2xl">
              <div className="highlight-chip">Free tool</div>
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                How much is enough?
              </h1>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                Build a pot across an ISA, a LISA and a pension, then spend it
                down and see how often the money lasts. A thousand return paths
                rather than one average, because the order the good and bad
                years arrive in decides the answer. Everything is in today's
                money and runs in your browser.
              </p>
            </div>
          </div>
        </section>

        <section className="section py-10 sm:py-14">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="border-border/60 bg-background rounded-lg border p-5">
                <p className="text-muted-foreground text-xs uppercase tracking-wider">
                  Chance the money lasts to {s.planToAge}
                </p>
                <p className={`mt-1 text-4xl font-semibold tabular-nums ${tone}`}>
                  {(success * 100).toFixed(0)}%
                </p>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {verdict}
                </p>
              </div>
              <div className="border-border/60 bg-background rounded-lg border p-5">
                <p className="text-muted-foreground text-xs uppercase tracking-wider">
                  Spending it could support
                </p>
                <p className="mt-1 text-4xl font-semibold tabular-nums">
                  {money.format(result.sustainableSpend)}
                </p>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  A year, at {(TARGET_CONFIDENCE * 100).toFixed(0)}% confidence.
                  You are planning to spend{" "}
                  {money.format(s.spending)}.
                </p>
              </div>
              <div className="border-border/60 bg-background rounded-lg border p-5">
                <p className="text-muted-foreground text-xs uppercase tracking-wider">
                  Median pot at {s.retireAge}
                </p>
                <p className="mt-1 text-4xl font-semibold tabular-nums">
                  {money.format(result.medianAtRetirement)}
                </p>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {result.medianRuinAge === null
                    ? "No path in this run ran out early."
                    : `Where it fails, the money typically goes at ${Math.round(result.medianRuinAge)}.`}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Suspense
                fallback={
                  <div className="text-muted-foreground py-16 text-center text-sm">
                    Running paths…
                  </div>
                }
              >
                <WealthFan
                  result={result}
                  retireAge={s.retireAge}
                  onClip={setTailClipped}
                />
              </Suspense>
              <p className="text-muted-foreground mt-1 text-xs">
                Line is the median path. The darker band holds the middle half
                of outcomes, the lighter one the tenth to the ninetieth
                percentile.
                {tailClipped
                  ? " The luckiest paths run off the top of the scale — compounding a volatile return for this long makes the upper tail enormous, and it is not the part you are asking about."
                  : ""}
              </p>
            </div>

            <div className="mt-10 space-y-8">
              <Group title="Timing">
                <Control label="Age now" value={s.currentAge} onChange={set("currentAge")} min={18} max={80} />
                <Control label="Retire at" value={s.retireAge} onChange={set("retireAge")} min={40} max={80} />
                <Control label="Plan to age" hint="Where success is measured" value={s.planToAge} onChange={set("planToAge")} min={70} max={110} />
              </Group>

              <Group title="What you have">
                <Control label="ISA" value={s.isaBalance} onChange={set("isaBalance")} min={0} max={1_000_000} step={5_000} />
                <Control label="LISA" hint={`Locked until ${LISA_ACCESS_AGE}`} value={s.lisaBalance} onChange={set("lisaBalance")} min={0} max={200_000} step={1_000} />
                <Control label="Pension" hint={`Locked until ${PENSION_ACCESS_AGE}`} value={s.pensionBalance} onChange={set("pensionBalance")} min={0} max={2_000_000} step={10_000} />
              </Group>

              <Group title="Added each year, until you retire">
                <Control
                  label="ISA"
                  hint={`${money.format(isaHeadroom)} of allowance left`}
                  value={s.isaContribution}
                  onChange={set("isaContribution")}
                  min={0}
                  max={ISA_ANNUAL_LIMIT}
                  step={500}
                />
                <Control
                  label="LISA"
                  hint={`Capped at ${money.format(LISA_ANNUAL_LIMIT)}, plus 25% bonus`}
                  value={s.lisaContribution}
                  onChange={set("lisaContribution")}
                  min={0}
                  max={LISA_ANNUAL_LIMIT}
                  step={100}
                />
                <Control label="Pension, you" hint="Before tax relief" value={s.pensionContribution} onChange={set("pensionContribution")} min={0} max={60_000} step={500} />
                <Control label="Pension, employer" value={s.employerContribution} onChange={set("employerContribution")} min={0} max={40_000} step={500} />
              </Group>

              <Group title="Retirement">
                <Control label="Spending a year" hint="Today's money, after tax" value={s.spending} onChange={set("spending")} min={0} max={150_000} step={1_000} />
                <Control label="State or DB pension" value={s.otherIncome} onChange={set("otherIncome")} min={0} max={40_000} step={500} />
                <Control label="From age" value={s.otherIncomeAge} onChange={set("otherIncomeAge")} min={55} max={75} />
                <Control label="Tax relief rate" hint="Your marginal rate" value={s.pensionReliefRate} onChange={set("pensionReliefRate")} min={0} max={45} suffix="%" />
              </Group>

              <Group title="Markets">
                <Control label="Real return" hint="After inflation" value={s.realReturn} onChange={set("realReturn")} min={0} max={10} step={0.1} suffix="%" />
                <Control label="Volatility" value={s.volatility} onChange={set("volatility")} min={0} max={35} suffix="%" />
                <Control label="Fees" value={s.fees} onChange={set("fees")} min={0} max={2} step={0.05} suffix="%" />
                <div className="flex items-start pt-5">
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
              </Group>
            </div>

            <div className="border-border/40 text-muted-foreground mt-10 space-y-3 border-t pt-8 text-sm leading-relaxed">
              <p>
                <strong className="text-foreground">Method.</strong> A thousand
                paths of annual real returns, drawn lognormally around the mean
                you set. Real means after inflation, so the spending figure you
                type keeps the same standard of living for the whole plan and
                there is no second inflation assumption compounding against the
                first — which is why the numbers here look smaller, and truer,
                than a calculator that shows you a nominal pot.
              </p>
              <p>
                Withdrawals come from the ISA first, then the LISA once it
                unlocks at {LISA_ACCESS_AGE}, and the pension last from{" "}
                {PENSION_ACCESS_AGE}, because a quarter of the pension is
                tax-free and the rest is charged as income at{" "}
                <Link to="/tools/take-home" className="text-primary hover:underline">
                  the usual bands
                </Link>
                . That order is worth more than most people expect, and it is
                why a plan can be well funded in total and still fail: retire
                before {PENSION_ACCESS_AGE} and only the ISA can carry you.
              </p>
              <p>
                Returns are drawn independently each year. Real markets are not
                quite that well behaved — crashes cluster and valuations mean
                revert — so treat the tails as optimistic rather than
                conservative. State pension and any defined-benefit income are
                treated as guaranteed and inflation-linked.
              </p>
              <p className="text-xs">
                For planning, not advice. I am not a financial adviser, and a
                model that agrees with you is not a reason to act.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Retirement;
