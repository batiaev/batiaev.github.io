import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Settings2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NumberField from "@/components/options/NumberField";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { ROUTE_META } from "@/lib/routeMeta";
import { STUDENT_LOAN_PLANS, TAX_YEAR, type StudentLoanPlan } from "@/lib/tax/uk";
import {
  DEFAULT_INPUT,
  STRUCTURES,
  compareStructures,
  optimalDirectorSalary,
  type StructureInput,
  type StructureResult,
} from "@/lib/tax/structures";

const SELECT_CLASS =
  "h-10 w-full rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const pct = (value: number) => `${(value * 100).toFixed(1)}%`;

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

/** Deduction rows, only shown when they apply to that structure. */
const deductionsOf = (r: StructureResult): { label: string; value: number }[] =>
  [
    { label: "Expenses", value: r.expenses },
    { label: "Umbrella margin", value: r.umbrellaMargin },
    { label: "Employer NI", value: r.employerNi },
    { label: "Corporation tax", value: r.corporationTax },
    { label: "Income tax", value: r.incomeTax },
    {
      label: r.structure === "soleTrader" ? "Class 4 NI" : "Employee NI",
      value: r.nationalInsurance,
    },
    { label: "Dividend tax", value: r.dividendTax },
    { label: "Student loan", value: r.studentLoan },
  ].filter((row) => row.value > 0.5);

const TakeHome = () => {
  const [input, setInput] = useState<StructureInput>(DEFAULT_INPUT);

  useDocumentMeta(ROUTE_META["/tools/take-home"]);

  const results = useMemo(() => compareStructures(input), [input]);
  const patch = (next: Partial<StructureInput>) =>
    setInput((current) => ({ ...current, ...next }));

  const best = results.reduce((a, b) =>
    b.netIncludingPension > a.netIncludingPension ? b : a,
  );
  const suggestedSalary = useMemo(() => optimalDirectorSalary(input), [input]);

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
              <div className="highlight-chip">Free tool · {TAX_YEAR}</div>
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                The same money, four ways
              </h1>
              <p className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg">
                Employed, self-employed, through your own company, or via an
                umbrella. The income tax is nearly identical in all four — the
                difference is employer NI, Class 4, corporation tax and dividend
                tax, and it is worth far more than any band.
              </p>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <div className="container mx-auto space-y-8 px-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="w-44">
                <Control label="Income a year" hint="Salary, or revenue / day rate">
                  <NumberField
                    label="Annual income in pounds"
                    value={input.income}
                    onChange={(income) => patch({ income })}
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
                      Pension {input.pensionPct}% · expenses{" "}
                      {gbp.format(input.expenses)} · draw {input.distributePct}%
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="max-h-[70vh] w-96 space-y-4 overflow-y-auto"
                >
                  <div>
                    <h2 className="text-sm font-medium">Your situation</h2>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                      Everything that changes which wrapper wins.
                    </p>
                  </div>

                  <Control
                    label="Other PAYE income"
                    hint="A day job, so a side business stacks on top of it"
                  >
                    <NumberField
                      label="Other PAYE income in pounds"
                      value={input.otherPaye}
                      onChange={(otherPaye) => patch({ otherPaye })}
                    />
                  </Control>

                  <Control
                    label="Business expenses"
                    hint="Sole trader and limited company only"
                  >
                    <NumberField
                      label="Allowable business expenses in pounds"
                      value={input.expenses}
                      onChange={(expenses) => patch({ expenses })}
                    />
                  </Control>

                  <Control label="Pension contribution">
                    <NumberField
                      label="Pension contribution, percent"
                      suffix="%"
                      value={input.pensionPct}
                      onChange={(pensionPct) => patch({ pensionPct })}
                    />
                  </Control>

                  <Control label="Pension method">
                    <select
                      aria-label="Pension method"
                      className={SELECT_CLASS}
                      value={input.pensionMethod}
                      onChange={(event) =>
                        patch({
                          pensionMethod: event.target
                            .value as StructureInput["pensionMethod"],
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
                      value={input.studentLoan}
                      onChange={(event) =>
                        patch({ studentLoan: event.target.value as StudentLoanPlan })
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

                  <div className="border-border/60 space-y-4 border-t pt-4">
                    <h3 className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                      Limited company
                    </h3>

                    <Control
                      label="Director's salary"
                      hint={`Best on these numbers: ${gbp.format(suggestedSalary)}`}
                    >
                      <NumberField
                        label="Director's salary in pounds"
                        value={input.directorSalary}
                        onChange={(directorSalary) => patch({ directorSalary })}
                      />
                    </Control>

                    <Control
                      label="Profit drawn as dividends"
                      hint="Leaving profit in defers the dividend tax — the main reason to incorporate"
                    >
                      <NumberField
                        label="Percent of profit drawn as dividends"
                        suffix="%"
                        value={input.distributePct}
                        onChange={(distributePct) => patch({ distributePct })}
                      />
                    </Control>

                    <label className="flex items-start gap-2 text-xs">
                      <input
                        type="checkbox"
                        className="accent-primary mt-0.5 h-4 w-4"
                        checked={input.claimEmploymentAllowance}
                        onChange={(event) =>
                          patch({ claimEmploymentAllowance: event.target.checked })
                        }
                      />
                      <span className="text-muted-foreground leading-relaxed">
                        Claim Employment Allowance — usually{" "}
                        <strong className="text-foreground">not</strong> available
                        to a sole director with no other staff.
                      </span>
                    </label>
                  </div>

                  <div className="border-border/60 border-t pt-4">
                    <h3 className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wider">
                      Umbrella
                    </h3>
                    <Control label="Annual margin">
                      <NumberField
                        label="Umbrella margin per year in pounds"
                        value={input.umbrellaMargin}
                        onChange={(umbrellaMargin) => patch({ umbrellaMargin })}
                      />
                    </Control>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {results.map((result) => {
                const meta = STRUCTURES.find((s) => s.id === result.structure)!;
                const isBest = result.structure === best.structure;

                return (
                  <div
                    key={result.structure}
                    className={`flex flex-col rounded-lg border p-5 ${
                      isBest
                        ? "border-primary/40 bg-primary/5"
                        : "border-border/60 bg-background"
                    }`}
                  >
                    <div className="mb-1 flex items-baseline justify-between gap-2">
                      <h2 className="font-semibold">{meta.label}</h2>
                      {isBest ? (
                        <span className="bg-primary text-primary-foreground shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                          Most kept
                        </span>
                      ) : null}
                    </div>
                    <p className="text-muted-foreground mb-4 text-xs leading-relaxed">
                      {meta.blurb}
                    </p>

                    {/*
                      Headline is everything still yours, which is the basis the
                      cards are ranked on. Showing cash here instead would make
                      a company that retains its profit look like a disaster.
                    */}
                    <p className="text-2xl font-semibold tabular-nums">
                      {gbp.format(result.netIncludingPension)}
                    </p>
                    <p className="text-muted-foreground mb-4 text-xs">
                      kept a year · {pct(result.effectiveRate)} lost to tax
                      {result.netIncludingPension - result.net > 0.5 ? (
                        <>
                          <br />
                          {gbp.format(result.net)} of it as cash
                        </>
                      ) : null}
                    </p>

                    <dl className="flex-1 space-y-1 text-xs tabular-nums">
                      {deductionsOf(result).map((row) => (
                        <div key={row.label} className="flex justify-between gap-2">
                          <dt className="text-muted-foreground">{row.label}</dt>
                          <dd className="text-destructive">
                            −{gbp.format(row.value)}
                          </dd>
                        </div>
                      ))}
                      {result.pension > 0 ? (
                        <div className="flex justify-between gap-2">
                          <dt className="text-muted-foreground">Pension</dt>
                          <dd>{gbp.format(result.pension)}</dd>
                        </div>
                      ) : null}
                      {result.retained > 0 ? (
                        <div className="flex justify-between gap-2">
                          <dt className="text-muted-foreground">
                            Retained in company
                          </dt>
                          <dd>{gbp.format(result.retained)}</dd>
                        </div>
                      ) : null}
                    </dl>

                    {result.retained > 0 ? (
                      <p className="border-border/60 text-muted-foreground mt-3 border-t pt-2 text-xs leading-relaxed">
                        Undrawn profit is still yours, but the dividend tax on it
                        is deferred, not avoided.
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="border-border/40 text-muted-foreground space-y-3 border-t pt-8 text-sm leading-relaxed">
              <p>
                <strong className="text-foreground">Why they differ.</strong> An
                employer pays their 15% NI <em>on top of</em> your salary. An
                umbrella pays it <em>out of</em> your assignment rate, so the
                same number is worth noticeably less. A sole trader pays Class 4
                at 6% rather than Class 1 at 8%. A company pays corporation tax
                first — 19% up to £50,000 and an effective 26.5% on the slice to
                £250,000 — and then you pay dividend tax on what is left.
              </p>
              <p>
                <strong className="text-foreground">
                  Incorporating is no longer an automatic win.
                </strong>{" "}
                With the {TAX_YEAR} dividend rates of 10.75% and 35.75%,
                distributing everything you earn through a company usually loses
                to being a sole trader. The advantage now comes from{" "}
                <em>not</em> drawing it — leaving profit in the company defers
                the dividend tax. Move the draw slider to see the answer flip.
              </p>
              <p>
                <strong className="text-foreground">What this ignores.</strong>{" "}
                IR35 status determination, VAT and the flat-rate scheme, the
                trading allowance, splitting income with a spouse, Business Asset
                Disposal Relief on winding up, and the real administrative cost
                of running a company. Scotland sets its own income tax bands and
                is not covered.
              </p>
              <p className="text-xs">
                {TAX_YEAR} rates for England, Wales and Northern Ireland. Assumes
                a standard tax code and no other income beyond what you enter.
                For planning, not for filing — and not tax advice.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TakeHome;
