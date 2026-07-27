import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NumberField from "@/components/options/NumberField";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { ROUTE_META } from "@/lib/routeMeta";
import {
  STUDENT_LOAN_PLANS,
  TAX_YEAR,
  takeHome,
  type StudentLoanPlan,
  type TakeHomeInput,
} from "@/lib/tax/uk";

const SELECT_CLASS =
  "h-10 w-full rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const gbpExact = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
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

const Row = ({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: number;
  hint?: string;
  tone?: "default" | "deduction" | "total";
}) => (
  <div
    className={`flex items-baseline justify-between gap-4 py-3 ${
      tone === "total" ? "border-border/60 border-t font-medium" : ""
    }`}
  >
    <span className={tone === "total" ? "" : "text-muted-foreground text-sm"}>
      {label}
      {hint ? (
        <span className="text-muted-foreground/70 block text-xs">{hint}</span>
      ) : null}
    </span>
    <span
      className={`shrink-0 tabular-nums ${
        tone === "deduction" ? "text-destructive" : ""
      } ${tone === "total" ? "text-lg font-semibold" : "text-sm"}`}
    >
      {tone === "deduction" && value > 0 ? "−" : ""}
      {gbpExact.format(value)}
    </span>
  </div>
);

const TakeHome = () => {
  const [input, setInput] = useState<TakeHomeInput>({
    gross: 85_000,
    pensionPct: 5,
    pensionMethod: "sacrifice",
    studentLoan: "none",
    bonus: 0,
  });

  useDocumentMeta(ROUTE_META["/tools/take-home"]);

  const result = useMemo(() => takeHome(input), [input]);
  const patch = (next: Partial<TakeHomeInput>) =>
    setInput((current) => ({ ...current, ...next }));

  const monthly = result.net / 12;
  const inTaper = result.gross > 100_000 && result.gross < 125_140;

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
                UK take-home pay calculator
              </h1>
              <p className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg">
                Income tax, National Insurance, pension and student loan, with
                the marginal rate on your next pound — including the 60% band
                most calculators hide. Runs in your browser; nothing is sent
                anywhere.
              </p>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[22rem_1fr]">
              <div className="space-y-4">
                <Control label="Gross annual salary">
                  <NumberField
                    label="Gross annual salary in pounds"
                    value={input.gross}
                    onChange={(gross) => patch({ gross })}
                  />
                </Control>

                <Control label="Annual bonus" hint="Taxed as earnings, on top of salary">
                  <NumberField
                    label="Annual bonus in pounds"
                    value={input.bonus}
                    onChange={(bonus) => patch({ bonus })}
                  />
                </Control>

                <Control
                  label="Pension contribution"
                  hint="Percent of salary — bonuses excluded, as most schemes do"
                >
                  <NumberField
                    label="Pension contribution, percent of salary"
                    suffix="%"
                    value={input.pensionPct}
                    onChange={(pensionPct) => patch({ pensionPct })}
                  />
                </Control>

                <Control
                  label="Pension method"
                  hint={
                    input.pensionMethod === "sacrifice"
                      ? "Salary sacrifice also saves National Insurance"
                      : "Relief at source saves income tax only"
                  }
                >
                  <select
                    aria-label="Pension method"
                    className={SELECT_CLASS}
                    value={input.pensionMethod}
                    onChange={(event) =>
                      patch({
                        pensionMethod: event.target
                          .value as TakeHomeInput["pensionMethod"],
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
                      patch({
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

              <div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="border-border/60 bg-background rounded-lg border p-5">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                      Take-home a month
                    </p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums">
                      {gbp.format(monthly)}
                    </p>
                  </div>
                  <div className="border-border/60 bg-background rounded-lg border p-5">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                      Take-home a year
                    </p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums">
                      {gbp.format(result.net)}
                    </p>
                  </div>
                  <div className="border-border/60 bg-background rounded-lg border p-5">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                      Marginal rate
                    </p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums">
                      {pct(result.marginalRate)}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Tax, NI and loan on your next £1
                    </p>
                  </div>
                </div>

                {inTaper ? (
                  <p className="border-border/60 bg-accent/40 text-muted-foreground mt-4 rounded-lg border p-4 text-sm leading-relaxed">
                    <strong className="text-foreground">
                      You are in the 60% band.
                    </strong>{" "}
                    Between £100,000 and £125,140 the Personal Allowance is
                    withdrawn at £1 for every £2 earned, so each extra pound is
                    taxed at 40% plus the 20% on the allowance you lose — before
                    National Insurance. Pension contributions in this range are
                    unusually efficient.
                  </p>
                ) : null}

                <div className="border-border/60 bg-background mt-6 rounded-lg border p-5 sm:p-6">
                  <h2 className="mb-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Breakdown
                  </h2>
                  <Row label="Gross" value={result.gross} />
                  <Row
                    label="Pension"
                    value={result.pension}
                    tone="deduction"
                    hint={
                      input.pensionMethod === "sacrifice"
                        ? "Salary sacrifice"
                        : "Relief at source"
                    }
                  />
                  <Row
                    label="Income tax"
                    value={result.incomeTax}
                    tone="deduction"
                    hint={`Personal Allowance ${gbp.format(result.personalAllowance)}`}
                  />
                  <Row
                    label="National Insurance"
                    value={result.nationalInsurance}
                    tone="deduction"
                  />
                  {result.studentLoan > 0 ? (
                    <Row
                      label="Student loan"
                      value={result.studentLoan}
                      tone="deduction"
                      hint={
                        input.studentLoan !== "none"
                          ? STUDENT_LOAN_PLANS[input.studentLoan].label
                          : undefined
                      }
                    />
                  ) : null}
                  <Row label="Take-home" value={result.net} tone="total" />
                  <p className="text-muted-foreground mt-3 text-xs">
                    Effective rate {pct(result.effectiveRate)} of gross.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-border/40 text-muted-foreground mt-10 space-y-3 border-t pt-8 text-sm leading-relaxed">
              <p>
                <strong className="text-foreground">Method.</strong> {TAX_YEAR}{" "}
                rates for England, Wales and Northern Ireland. Personal
                Allowance £12,570, tapered by £1 for every £2 above £100,000;
                20% to £37,700 of taxable income, 40% to £125,140, 45% above.
                Employee National Insurance is 8% between £12,570 and £50,270
                and 2% above. Student loan deductions are assessed monthly and
                rounded down to the pound.
              </p>
              <p>
                <strong className="text-foreground">Scotland is not covered.</strong>{" "}
                It sets its own income tax bands, and an approximation would be
                worse than an honest gap.
              </p>
              <p>
                Assumes a standard tax code with no other income, benefits in
                kind, or allowances. For planning, not for filing — and not
                financial advice.
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
