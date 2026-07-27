/**
 * The same money, earned four different ways.
 *
 * The interesting question is rarely "what is my take-home" — it is "how much
 * does the wrapper cost me". A day rate through an umbrella, the same rate
 * through your own company, and the same number as a salary are three very
 * different net figures, and the gap is mostly employer NI and corporation tax
 * rather than anything in the income tax bands.
 */
import {
  DIVIDEND_ALLOWANCE,
  EMPLOYMENT_ALLOWANCE,
  NI_SECONDARY_THRESHOLD,
  class4On,
  corporationTaxOn,
  dividendTaxOn,
  employerNiOn,
  incomeTaxOn,
  nationalInsuranceOn,
  studentLoanOn,
  type StudentLoanPlan,
} from "./uk";

export type Structure = "employee" | "soleTrader" | "limited" | "umbrella";

export const STRUCTURES: { id: Structure; label: string; blurb: string }[] = [
  {
    id: "employee",
    label: "Employee",
    blurb: "PAYE. Your employer pays their NI on top of your salary, not out of it.",
  },
  {
    id: "soleTrader",
    label: "Sole trader",
    blurb: "Self-employed. Income tax plus Class 4 NI on profit after expenses.",
  },
  {
    id: "limited",
    label: "Own limited company",
    blurb: "Small salary plus dividends. Corporation tax first, dividend tax second.",
  },
  {
    id: "umbrella",
    label: "Umbrella / inside IR35",
    blurb: "Employer NI and the umbrella's margin come out of your assignment rate.",
  },
];

export interface StructureInput {
  /**
   * Money in. For an employee that is gross salary; for everyone else it is
   * annual revenue, or the day rate multiplied by billable days.
   */
  income: number;
  /** Allowable business expenses — sole trader and limited company only. */
  expenses: number;
  /** Director's salary. The rest of the profit is taken as dividends. */
  directorSalary: number;
  /** PAYE income from a day job, so a side business stacks on top of it. */
  otherPaye: number;
  pensionPct: number;
  pensionMethod: "sacrifice" | "relief";
  studentLoan: StudentLoanPlan;
  /** Usually unavailable to a sole director with no other staff. */
  claimEmploymentAllowance: boolean;
  /** The umbrella's weekly margin, annualised. */
  umbrellaMargin: number;
  /**
   * Share of post-tax company profit taken as dividends this year. Anything
   * left behind defers the dividend tax rather than avoiding it — but deferral
   * is the main reason incorporating still pays, so it has to be a lever.
   */
  distributePct: number;
}

export interface StructureResult {
  structure: Structure;
  /** Total money entering the arrangement. */
  income: number;
  expenses: number;
  corporationTax: number;
  employerNi: number;
  umbrellaMargin: number;
  incomeTax: number;
  /** Class 1 for employees, Class 4 for the self-employed. */
  nationalInsurance: number;
  dividendTax: number;
  studentLoan: number;
  pension: number;
  /** Cash in your pocket, excluding the pension pot. */
  net: number;
  /** Net plus the pension, since that money is still yours. */
  netIncludingPension: number;
  effectiveRate: number;
  /** Salary and dividends, for the limited-company breakdown. */
  salary: number;
  dividends: number;
  /** Post-tax profit left in the company — still yours, just not drawn yet. */
  retained: number;
}

const DEFAULT_RESULT = {
  expenses: 0,
  corporationTax: 0,
  employerNi: 0,
  umbrellaMargin: 0,
  dividendTax: 0,
  salary: 0,
  dividends: 0,
  retained: 0,
};

export const DEFAULT_INPUT: StructureInput = {
  income: 120_000,
  expenses: 0,
  directorSalary: NI_SECONDARY_THRESHOLD,
  otherPaye: 0,
  pensionPct: 0,
  pensionMethod: "relief",
  studentLoan: "none",
  claimEmploymentAllowance: false,
  umbrellaMargin: 1_500,
  distributePct: 100,
};

function finalise(
  partial: Omit<StructureResult, "net" | "netIncludingPension" | "effectiveRate">,
): StructureResult {
  const net =
    partial.income -
    partial.expenses -
    partial.corporationTax -
    partial.employerNi -
    partial.umbrellaMargin -
    partial.incomeTax -
    partial.nationalInsurance -
    partial.dividendTax -
    partial.studentLoan -
    partial.pension -
    partial.retained;

  // Expenses are money spent on the business, not a tax — exclude them from
  // the base so the rate answers "what share of my income went in tax".
  const base = partial.income - partial.expenses;

  // Pension and retained profit are still the owner's money, so the effective
  // rate measures only what actually left for HMRC or the umbrella.
  const kept = net + partial.pension + partial.retained;

  return {
    ...partial,
    net,
    netIncludingPension: kept,
    effectiveRate: base > 0 ? (base - kept) / base : 0,
  };
}

function payeOn(
  salary: number,
  otherPaye: number,
  input: StructureInput,
): { incomeTax: number; ni: number; loan: number; pension: number } {
  const pension = salary * (Math.max(input.pensionPct, 0) / 100);
  const sacrificing = input.pensionMethod === "sacrifice";
  const niBase = sacrificing ? salary - pension : salary;
  const taxBase = salary - pension + otherPaye;

  return {
    incomeTax: incomeTaxOn(taxBase) - incomeTaxOn(otherPaye),
    ni: nationalInsuranceOn(niBase),
    loan: studentLoanOn(niBase + otherPaye, input.studentLoan),
    pension,
  };
}

export function evaluateStructure(
  structure: Structure,
  input: StructureInput,
): StructureResult {
  const income = Math.max(input.income, 0);
  const expenses = Math.max(input.expenses, 0);

  if (structure === "employee") {
    const paye = payeOn(income, input.otherPaye, input);
    return finalise({
      ...DEFAULT_RESULT,
      structure,
      income,
      salary: income,
      incomeTax: paye.incomeTax,
      nationalInsurance: paye.ni,
      studentLoan: paye.loan,
      pension: paye.pension,
    });
  }

  if (structure === "soleTrader") {
    const profit = Math.max(income - expenses, 0);
    // A personal pension for the self-employed gets relief at source; it never
    // reduces Class 4, which is charged on profit before any contribution.
    const pension = profit * (Math.max(input.pensionPct, 0) / 100);
    const taxable = profit - pension + input.otherPaye;

    return finalise({
      ...DEFAULT_RESULT,
      structure,
      income,
      expenses,
      incomeTax: incomeTaxOn(taxable) - incomeTaxOn(input.otherPaye),
      nationalInsurance: class4On(profit),
      studentLoan: studentLoanOn(profit + input.otherPaye, input.studentLoan),
      pension,
    });
  }

  if (structure === "umbrella") {
    const margin = Math.max(input.umbrellaMargin, 0);
    // The assignment rate has to cover salary and the employer NI on it:
    //   salary + 0.15 × (salary − threshold) = income − margin
    const salary = Math.max(
      (income - margin + NI_SECONDARY_THRESHOLD * 0.15) / 1.15,
      0,
    );
    const employerNi = employerNiOn(salary);
    const paye = payeOn(salary, input.otherPaye, input);

    return finalise({
      ...DEFAULT_RESULT,
      structure,
      income,
      salary,
      umbrellaMargin: margin,
      employerNi,
      incomeTax: paye.incomeTax,
      nationalInsurance: paye.ni,
      studentLoan: paye.loan,
      pension: paye.pension,
    });
  }

  // Limited company: salary first, corporation tax on what is left, then
  // dividends out of post-tax profit.
  const salary = Math.min(Math.max(input.directorSalary, 0), income);
  const employerNi = employerNiOn(
    salary,
    input.claimEmploymentAllowance ? EMPLOYMENT_ALLOWANCE : 0,
  );
  // Employer pension contributions are a deductible company expense, which is
  // why a company pension beats a personal one for a director.
  const pension = salary * (Math.max(input.pensionPct, 0) / 100);
  const profit = Math.max(income - expenses - salary - employerNi - pension, 0);
  const corporationTax = corporationTaxOn(profit);
  const distributable = Math.max(profit - corporationTax, 0);
  const share = Math.min(Math.max(input.distributePct, 0), 100) / 100;
  const dividends = distributable * share;
  const retained = distributable - dividends;

  const paye = payeOn(salary, input.otherPaye, {
    ...input,
    // The pension is paid by the company, so it is not a salary deduction.
    pensionPct: 0,
  });

  return finalise({
    structure,
    income,
    expenses,
    salary,
    dividends,
    retained,
    employerNi,
    umbrellaMargin: 0,
    corporationTax,
    incomeTax: paye.incomeTax,
    nationalInsurance: paye.ni,
    dividendTax: dividendTaxOn(dividends, salary + input.otherPaye),
    studentLoan: paye.loan,
    pension,
  });
}

export function compareStructures(input: StructureInput): StructureResult[] {
  return STRUCTURES.map(({ id }) => evaluateStructure(id, input));
}

/** Salary that leaves the most in your pocket, found by scanning. */
export function optimalDirectorSalary(input: StructureInput): number {
  let best = NI_SECONDARY_THRESHOLD;
  let bestNet = -Infinity;

  for (let salary = 0; salary <= Math.min(input.income, 60_000); salary += 250) {
    const { netIncludingPension } = evaluateStructure("limited", {
      ...input,
      directorSalary: salary,
    });
    if (netIncludingPension > bestNet) {
      bestNet = netIncludingPension;
      best = salary;
    }
  }

  return best;
}

export { DIVIDEND_ALLOWANCE, NI_SECONDARY_THRESHOLD };
