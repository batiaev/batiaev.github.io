import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import NumberField from "@/components/options/NumberField";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { ROUTE_META } from "@/lib/routeMeta";
import { STUDENT_LOAN_PLANS, TAX_YEAR, type StudentLoanPlan } from "@/lib/tax/uk";
import {
  DEFAULT_ASSUMPTIONS,
  emptyOffer,
  evaluate,
  type Assumptions,
  type Offer,
} from "@/lib/offer/compare";

const SELECT_CLASS =
  "h-10 w-full rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

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

const OfferCard = ({
  offer,
  onChange,
}: {
  offer: Offer;
  onChange: (patch: Partial<Offer>) => void;
}) => (
  <div className="border-border/60 bg-background space-y-4 rounded-lg border p-5">
    <Input
      aria-label={`Name for ${offer.label}`}
      value={offer.label}
      onChange={(event) => onChange({ label: event.target.value })}
      className="h-10 font-medium"
    />

    <div className="grid grid-cols-2 gap-3">
      <Control label="Base salary">
        <NumberField
          label={`Base salary for ${offer.label}`}
          value={offer.base}
          onChange={(base) => onChange({ base })}
        />
      </Control>
      <Control label="Target bonus">
        <NumberField
          label={`Target bonus percent for ${offer.label}`}
          suffix="%"
          value={offer.bonusPct}
          onChange={(bonusPct) => onChange({ bonusPct })}
        />
      </Control>
      <Control label="Sign-on">
        <NumberField
          label={`Sign-on bonus for ${offer.label}`}
          value={offer.signOn}
          onChange={(signOn) => onChange({ signOn })}
        />
      </Control>
      <Control label="Equity grant" hint="Total, at today's valuation">
        <NumberField
          label={`Equity grant for ${offer.label}`}
          value={offer.equity}
          onChange={(equity) => onChange({ equity })}
        />
      </Control>
      <Control label="Vests over">
        <NumberField
          label={`Vesting years for ${offer.label}`}
          suffix="yr"
          value={offer.vestYears}
          onChange={(vestYears) => onChange({ vestYears })}
        />
      </Control>
      <Control label="Share growth" hint="Assumed, per year">
        <NumberField
          label={`Annual share price growth for ${offer.label}`}
          suffix="%"
          value={offer.growthPct}
          onChange={(growthPct) => onChange({ growthPct })}
        />
      </Control>
    </div>
  </div>
);

const OfferCalculator = () => {
  const [offers, setOffers] = useState<Offer[]>([
    emptyOffer("a", "Offer A"),
    { ...emptyOffer("b", "Offer B"), base: 140_000, bonusPct: 10, equity: 40_000 },
  ]);
  const [assumptions, setAssumptions] = useState<Assumptions>(DEFAULT_ASSUMPTIONS);

  useDocumentMeta(ROUTE_META["/tools/offer"]);

  const results = useMemo(
    () => offers.map((offer) => evaluate(offer, assumptions)),
    [offers, assumptions],
  );

  const patchOffer = (id: string, patch: Partial<Offer>) =>
    setOffers((current) =>
      current.map((offer) => (offer.id === id ? { ...offer, ...patch } : offer)),
    );

  const patchAssumptions = (patch: Partial<Assumptions>) =>
    setAssumptions((current) => ({ ...current, ...patch }));

  const best = results.reduce((leader, candidate) =>
    candidate.totalNet > leader.totalNet ? candidate : leader,
  );
  const runnerUp = results.find((r) => r !== best);
  const gap = runnerUp ? best.totalNet - runnerUp.totalNet : 0;

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
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
              <div className="highlight-chip">Free tool · {TAX_YEAR}</div>
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Job offer comparison
              </h1>
              <p className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg">
                Two offers, four years, after UK tax. Headline packages are
                built to be compared badly — a bigger grant that vests slower,
                or a bonus that lands in a higher band, can lose to a plainer
                offer once the tax runs.
              </p>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <div className="container mx-auto space-y-8 px-4">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {offers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onChange={(patch) => patchOffer(offer.id, patch)}
                />
              ))}
            </div>

            <div className="border-border/60 bg-accent/30 rounded-lg border p-5">
              <h2 className="text-muted-foreground mb-4 text-xs font-medium uppercase tracking-wider">
                Shared assumptions
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                <Control label="Horizon">
                  <NumberField
                    label="Comparison horizon in years"
                    suffix="yr"
                    value={assumptions.horizonYears}
                    onChange={(horizonYears) =>
                      patchAssumptions({
                        horizonYears: Math.min(Math.max(horizonYears, 1), 10),
                      })
                    }
                  />
                </Control>
                <Control label="Annual raise">
                  <NumberField
                    label="Annual base salary raise, percent"
                    suffix="%"
                    value={assumptions.raisePct}
                    onChange={(raisePct) => patchAssumptions({ raisePct })}
                  />
                </Control>
                <Control label="Pension">
                  <NumberField
                    label="Pension contribution, percent of gross"
                    suffix="%"
                    value={assumptions.pensionPct}
                    onChange={(pensionPct) => patchAssumptions({ pensionPct })}
                  />
                </Control>
                <Control label="Pension method">
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
                </Control>
                <Control label="Student loan">
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
                </Control>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {results.map((result) => (
                <div
                  key={result.offer.id}
                  className={`rounded-lg border p-5 ${
                    result === best
                      ? "border-primary/40 bg-primary/5"
                      : "border-border/60 bg-background"
                  }`}
                >
                  <div className="mb-4 flex items-baseline justify-between gap-3">
                    <h3 className="font-semibold">{result.offer.label}</h3>
                    {result === best && gap !== 0 ? (
                      <span className="bg-primary text-primary-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">
                        +{gbp.format(gap)} net
                      </span>
                    ) : null}
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider">
                        Total gross
                      </p>
                      <p className="text-xl font-semibold tabular-nums">
                        {gbp.format(result.totalGross)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider">
                        Total net
                      </p>
                      <p className="text-xl font-semibold tabular-nums">
                        {gbp.format(result.totalNet)}
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm tabular-nums">
                      <thead>
                        <tr className="text-muted-foreground border-border/60 border-b text-xs uppercase tracking-wider">
                          <th className="py-2 text-left font-medium">Year</th>
                          <th className="py-2 text-right font-medium">Cash</th>
                          <th className="py-2 text-right font-medium">Equity</th>
                          <th className="py-2 text-right font-medium">Net</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.years.map((row) => (
                          <tr key={row.year} className="border-border/40 border-b last:border-0">
                            <td className="py-2">{row.year}</td>
                            <td className="py-2 text-right">
                              {gbp.format(row.base + row.bonus + row.signOn)}
                            </td>
                            <td className="py-2 text-right">
                              {row.equity > 0 ? gbp.format(row.equity) : "—"}
                            </td>
                            <td className="py-2 text-right font-medium">
                              {gbp.format(row.net)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-border/40 text-muted-foreground space-y-3 border-t pt-8 text-sm leading-relaxed">
              <p>
                <strong className="text-foreground">Method.</strong> Equity
                vests in equal annual tranches, each valued at the share price
                implied by your growth assumption in the year it lands. Vesting
                shares, bonuses and sign-on are all taxed as employment income,
                so they stack on top of salary rather than being taxed in
                isolation — which is what pushes a large grant into the higher
                or additional band. Tax is the same {TAX_YEAR} model as the{" "}
                <Link to="/tools/take-home" className="text-primary hover:underline">
                  take-home calculator
                </Link>
                .
              </p>
              <p>
                Totals are nominal — no discounting, and no attempt to price the
                risk that private equity never becomes liquid. A 10% growth
                assumption on an illiquid private grant is doing far more work
                than the same number on listed stock. Treat the equity column as
                a scenario, not a forecast.
              </p>
              <p>For planning, not investment or tax advice.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OfferCalculator;
