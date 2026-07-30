import React, { Suspense, lazy, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Settings2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NumberField from "@/components/options/NumberField";
import OfferDetail from "@/components/offer/OfferDetail";
import Field, { SELECT_CLASS } from "@/components/tools/Field";
import ToolLayout from "@/components/tools/ToolLayout";
import ToolNotes from "@/components/tools/ToolNotes";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { ROUTE_META } from "@/lib/routeMeta";
import { STUDENT_LOAN_PLANS, TAX_YEAR, type StudentLoanPlan } from "@/lib/tax/uk";
import {
  ARCHETYPES,
  dilutedPct,
  offerFromArchetype,
  type Offer,
  type Scenario,
} from "@/lib/offer/archetypes";
import {
  DEFAULT_ASSUMPTIONS,
  evaluate,
  scenarioOf,
  type Assumptions,
} from "@/lib/offer/compare";

const OutcomeChart = lazy(() => import("@/components/offer/OutcomeChart"));

const ROUTE = "/tools/offer";

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const SCENARIOS: { id: Scenario; label: string; hint: string }[] = [
  { id: "downside", label: "It doesn't work", hint: "Equity pays nothing" },
  { id: "expected", label: "Probability-weighted", hint: "Equity × the odds" },
  { id: "upside", label: "It works", hint: "The exit happens in full" },
];

let nextId = 0;

const OfferCalculator = () => {
  const [offers, setOffers] = useState<Offer[]>(() =>
    ARCHETYPES.map((preset) => offerFromArchetype(preset, `o${nextId++}`)),
  );
  const [assumptions, setAssumptions] = useState<Assumptions>(DEFAULT_ASSUMPTIONS);
  const [scenario, setScenario] = useState<Scenario>("expected");

  useDocumentMeta(ROUTE_META[ROUTE]);

  const results = useMemo(
    () => offers.map((offer) => evaluate(offer, assumptions)),
    [offers, assumptions],
  );

  const patchOffer = (id: string, patch: Partial<Offer>) =>
    setOffers((current) =>
      current.map((offer) =>
        offer.id === id ? { ...offer, ...patch, archetype: "custom" } : offer,
      ),
    );

  const patchAssumptions = (patch: Partial<Assumptions>) =>
    setAssumptions((current) => ({ ...current, ...patch }));

  const best = results.length
    ? results.reduce((leader, candidate) =>
        scenarioOf(candidate, scenario).totalNet >
        scenarioOf(leader, scenario).totalNet
          ? candidate
          : leader,
      )
    : null;

  return (
    <ToolLayout
      route={ROUTE}
      chip={`Free tool · ${TAX_YEAR}`}
      title="Compare compensation, not salaries"
      intro={
        <>
          A startup grant, a scale-up RSU package and an enterprise base are
          three different bets, and their headline totals are not comparable.
          This prices each one as a distribution — what you get if it fails, if it
          works, and weighted by the odds you give it — after UK tax and after
          dilution.
        </>
      }
      note={
        <>
          I have taken all three: enterprise at Deutsche Bank, hypergrowth at
          Revolut, and 0→1 at Vega and Nevis. The defaults below are the shapes
          those bets tend to have, not quoted offers.
        </>
      }
    >
      <div>
        <h2 className="text-muted-foreground mb-3 text-sm font-medium uppercase tracking-wider">
          Add an offer
        </h2>
        <div className="scroll-row">
          {ARCHETYPES.map((preset) => (
            <Button
              key={preset.id}
              type="button"
              variant="outline"
              size="sm"
              className="min-h-10"
              title={preset.blurb}
              onClick={() =>
                setOffers((current) => [
                  ...current,
                  offerFromArchetype(preset, `o${nextId++}`),
                ])
              }
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              {preset.label}
            </Button>
          ))}
        </div>
        <div className="text-muted-foreground mt-3 grid gap-1 text-xs sm:grid-cols-3">
          {ARCHETYPES.map((preset) => (
            <p key={preset.id} className="leading-relaxed">
              <strong className="text-foreground">{preset.label}.</strong>{" "}
              {preset.blurb}
            </p>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => {
          const result = results.find((r) => r.offer.id === offer.id)!;
          const shown = scenarioOf(result, scenario);

          return (
            <div
              key={offer.id}
              className={`rounded-lg border p-4 ${
                best?.offer.id === offer.id
                  ? "border-primary/40 bg-primary/5"
                  : "border-border/60 bg-background"
              }`}
            >
              <div className="mb-3 flex items-center gap-2">
                <Input
                  aria-label={`Name for ${offer.label}`}
                  value={offer.label}
                  onChange={(event) =>
                    setOffers((current) =>
                      current.map((o) =>
                        o.id === offer.id
                          ? { ...o, label: event.target.value }
                          : o,
                      ),
                    )
                  }
                  className="h-9 flex-1 font-medium"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground h-9 w-9 shrink-0"
                      aria-label={`Edit details of ${offer.label}`}
                    >
                      <Settings2 className="h-4 w-4" aria-hidden />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="max-h-[70vh] w-[calc(100vw-2rem)] overflow-y-auto sm:w-96"
                  >
                    <OfferDetail
                      offer={offer}
                      onChange={(patch) => patchOffer(offer.id, patch)}
                    />
                  </PopoverContent>
                </Popover>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive h-9 w-9 shrink-0"
                  aria-label={`Remove ${offer.label}`}
                  onClick={() =>
                    setOffers((current) =>
                      current.filter((o) => o.id !== offer.id),
                    )
                  }
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </Button>
              </div>

              <dl className="space-y-1.5 text-sm tabular-nums">
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Base + bonus</dt>
                  <dd>
                    {gbp.format(offer.base * (1 + offer.bonusPct / 100))}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Equity</dt>
                  <dd>
                    {offer.equityKind === "none"
                      ? "None"
                      : `${offer.grantPct}% → ${dilutedPct(offer).toFixed(3)}%`}
                  </dd>
                </div>
                {offer.equityKind !== "none" ? (
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">If it exits</dt>
                    <dd>{gbp.format(result.headlineEquity)}</dd>
                  </div>
                ) : null}
              </dl>

              <div className="border-border/60 mt-3 border-t pt-3">
                <p className="text-muted-foreground text-xs uppercase tracking-wider">
                  Net over {assumptions.horizonYears} years
                </p>
                <p className="text-2xl font-semibold tabular-nums">
                  {gbp.format(shown.totalNet)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {results.length > 0 ? (
        <>
          <div>
            <h2 className="text-muted-foreground mb-3 text-sm font-medium uppercase tracking-wider">
              Scenario
            </h2>
            <div
              className="scroll-row"
              role="group"
              aria-label="Outcome scenario"
            >
              {SCENARIOS.map((option) => {
                const active = option.id === scenario;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setScenario(option.id)}
                    aria-pressed={active}
                    title={option.hint}
                    className={`min-h-10 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-border/60 bg-background rounded-lg border p-3 sm:p-5">
            <Suspense
              fallback={
                <div className="text-muted-foreground flex h-[18rem] items-center justify-center text-sm sm:h-[24rem]">
                  Loading chart…
                </div>
              }
            >
              <OutcomeChart results={results} scenario={scenario} />
            </Suspense>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-sm tabular-nums">
              <thead>
                <tr className="text-muted-foreground border-border/60 border-b text-xs uppercase tracking-wider">
                  <th className="py-2 text-left font-medium">Offer</th>
                  <th className="py-2 text-right font-medium">
                    If it doesn&apos;t work
                  </th>
                  <th className="py-2 text-right font-medium">Weighted</th>
                  <th className="py-2 text-right font-medium">If it works</th>
                  <th className="py-2 text-right font-medium">Spread</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr
                    key={result.offer.id}
                    className="border-border/40 border-b last:border-0"
                  >
                    <td className="py-2 font-medium">{result.offer.label}</td>
                    <td className="py-2 text-right">
                      {gbp.format(result.downside.totalNet)}
                    </td>
                    <td className="py-2 text-right">
                      {gbp.format(result.expected.totalNet)}
                    </td>
                    <td className="py-2 text-right">
                      {gbp.format(result.upside.totalNet)}
                    </td>
                    <td className="text-muted-foreground py-2 text-right">
                      {gbp.format(
                        result.upside.totalNet - result.downside.totalNet,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="text-muted-foreground py-12 text-center text-sm">
          Add an offer to start comparing.
        </p>
      )}

      <div className="border-border/60 bg-accent/30 rounded-lg border p-5">
        <h2 className="text-muted-foreground mb-4 text-xs font-medium uppercase tracking-wider">
          Shared assumptions
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <Field label="Horizon">
            <NumberField
              label="Comparison horizon in years"
              suffix="yr"
              value={assumptions.horizonYears}
              onChange={(horizonYears) =>
                patchAssumptions({
                  horizonYears: Math.min(Math.max(horizonYears, 1), 15),
                })
              }
            />
          </Field>
          <Field label="Annual raise">
            <NumberField
              label="Annual base salary raise, percent"
              suffix="%"
              value={assumptions.raisePct}
              onChange={(raisePct) => patchAssumptions({ raisePct })}
            />
          </Field>
          <Field label="Pension">
            <NumberField
              label="Pension contribution, percent of salary"
              suffix="%"
              value={assumptions.pensionPct}
              onChange={(pensionPct) => patchAssumptions({ pensionPct })}
            />
          </Field>
          <Field label="Pension method">
            <select
              aria-label="Pension method"
              className={SELECT_CLASS}
              value={assumptions.pensionMethod}
              onChange={(event) =>
                patchAssumptions({
                  pensionMethod: event.target
                    .value as Assumptions["pensionMethod"],
                })
              }
            >
              <option value="sacrifice">Salary sacrifice</option>
              <option value="relief">Relief at source</option>
            </select>
          </Field>
          <Field label="Student loan">
            <select
              aria-label="Student loan plan"
              className={SELECT_CLASS}
              value={assumptions.studentLoan}
              onChange={(event) =>
                patchAssumptions({
                  studentLoan: event.target.value as StudentLoanPlan,
                })
              }
            >
              <option value="none">None</option>
              {Object.entries(STUDENT_LOAN_PLANS).map(([key, plan]) => (
                <option key={key} value={key}>
                  {plan.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      <ToolNotes>
        <p>
          <strong className="text-foreground">Method.</strong> Your grant
          is diluted by each expected round, then valued at the exit.
          Options pay only the spread over strike, so a large grant at a
          high strike can be worth far less than a smaller share award.
          Only the vested portion at the exit date counts. Equity is
          realised in one year and taxed as income on top of salary, which
          is what pushes it into the additional rate — the tax model is the
          same {TAX_YEAR} engine as the{" "}
          <Link to="/tools/take-home" className="text-primary hover:underline">
            take-home calculator
          </Link>
          .
        </p>
        <p>
          <strong className="text-foreground">
            The weighted column is not a forecast.
          </strong>{" "}
          It is your own probability multiplied by your own exit valuation.
          Both are guesses, and the honest use of this tool is to notice
          how hard you have to squint to make a grant beat cash — and how
          large the spread is either way.
        </p>
        <p>
          Nominal totals, no discounting. Ignores secondaries, liquidation
          preferences, option exercise cost and timing, EMI/CSOP tax
          treatment, and the possibility of leaving before the cliff. Any
          one of those can matter more than the headline number.
        </p>
        <p className="text-xs">
          For thinking, not for deciding. Not investment or tax advice.
        </p>
      </ToolNotes>
    </ToolLayout>
  );
};

export default OfferCalculator;
