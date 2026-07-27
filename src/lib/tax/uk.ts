/**
 * UK PAYE model for the 2026/27 tax year (England, Wales and Northern Ireland).
 *
 * Scotland sets its own income tax bands and is deliberately out of scope
 * rather than approximated — a wrong number is worse than an absent one.
 *
 * Sources (all GOV.UK, checked against the 2026 to 2027 guidance):
 * - Rates and thresholds for employers 2026 to 2027
 * - Personal Allowance and basic rate limit, 6 April 2026 to 5 April 2028
 * - 2026 to 2027 Student and Postgraduate Loan deduction tables
 */

export const TAX_YEAR = "2026/27";

export const PERSONAL_ALLOWANCE = 12_570;
/** Taxable income taxed at the basic rate, i.e. £12,571–£50,270 of gross. */
export const BASIC_RATE_LIMIT = 37_700;
/** Above this, taxable income is charged at the additional rate. */
export const ADDITIONAL_RATE_LIMIT = 125_140;
/** The Personal Allowance tapers by £1 for every £2 of income above this. */
export const TAPER_THRESHOLD = 100_000;

export const BASIC_RATE = 0.2;
export const HIGHER_RATE = 0.4;
export const ADDITIONAL_RATE = 0.45;

/** Class 1 employee NI: aligned to the Personal Allowance and higher-rate threshold. */
export const NI_PRIMARY_THRESHOLD = 12_570;
export const NI_UPPER_EARNINGS_LIMIT = 50_270;
export const NI_MAIN_RATE = 0.08;
export const NI_UPPER_RATE = 0.02;

export type StudentLoanPlan = "none" | "plan1" | "plan2" | "plan4" | "plan5" | "pgl";

interface LoanPlan {
  label: string;
  threshold: number;
  rate: number;
}

export const STUDENT_LOAN_PLANS: Record<Exclude<StudentLoanPlan, "none">, LoanPlan> = {
  plan1: { label: "Plan 1", threshold: 26_900, rate: 0.09 },
  plan2: { label: "Plan 2", threshold: 29_385, rate: 0.09 },
  plan4: { label: "Plan 4 (Scotland)", threshold: 33_795, rate: 0.09 },
  plan5: { label: "Plan 5", threshold: 25_000, rate: 0.09 },
  pgl: { label: "Postgraduate", threshold: 21_000, rate: 0.06 },
};

export interface TakeHomeInput {
  /** Gross annual salary before any deduction. */
  gross: number;
  /**
   * Employee pension contribution as a percent of *salary*. Bonuses and
   * vesting shares are excluded, which is how nearly every UK scheme works —
   * contributing 5% of an RSU vest would overstate both the pot and the relief.
   */
  pensionPct: number;
  /**
   * Salary sacrifice reduces gross for both income tax and NI. "Relief at
   * source" (the default for most workplace schemes) reduces income tax only.
   */
  pensionMethod: "sacrifice" | "relief";
  studentLoan: StudentLoanPlan;
  /** Untaxed cash on top of salary, e.g. an annual bonus. Taxed as earnings. */
  bonus: number;
}

export interface TakeHomeResult {
  gross: number;
  /** Earnings after any salary sacrifice — the base for tax and NI. */
  taxableGross: number;
  pension: number;
  personalAllowance: number;
  incomeTax: number;
  nationalInsurance: number;
  studentLoan: number;
  net: number;
  /** Total deductions, pension included, as a share of gross. */
  effectiveRate: number;
  /**
   * Tax, NI and student loan on the next £1 of gross. Pension is excluded on
   * purpose — it is deferred income, not a deduction, and folding it in would
   * disguise the thing this number exists to show (the 60% taper band).
   */
  marginalRate: number;
}

/** The Personal Allowance tapers away entirely by £125,140. */
export function personalAllowanceFor(income: number): number {
  if (income <= TAPER_THRESHOLD) return PERSONAL_ALLOWANCE;
  const lost = (income - TAPER_THRESHOLD) / 2;
  return Math.max(PERSONAL_ALLOWANCE - lost, 0);
}

export function incomeTaxOn(income: number): number {
  const allowance = personalAllowanceFor(income);
  const taxable = Math.max(income - allowance, 0);

  const basic = Math.min(taxable, BASIC_RATE_LIMIT);
  const higher = Math.min(
    Math.max(taxable - BASIC_RATE_LIMIT, 0),
    ADDITIONAL_RATE_LIMIT - BASIC_RATE_LIMIT,
  );
  const additional = Math.max(taxable - ADDITIONAL_RATE_LIMIT, 0);

  return basic * BASIC_RATE + higher * HIGHER_RATE + additional * ADDITIONAL_RATE;
}

export function nationalInsuranceOn(earnings: number): number {
  const main =
    Math.min(Math.max(earnings - NI_PRIMARY_THRESHOLD, 0), NI_UPPER_EARNINGS_LIMIT - NI_PRIMARY_THRESHOLD) *
    NI_MAIN_RATE;
  const upper = Math.max(earnings - NI_UPPER_EARNINGS_LIMIT, 0) * NI_UPPER_RATE;
  return main + upper;
}

export function studentLoanOn(earnings: number, plan: StudentLoanPlan): number {
  if (plan === "none") return 0;
  const { threshold, rate } = STUDENT_LOAN_PLANS[plan];
  // Repayments are assessed per pay period, and the deduction itself is
  // rounded down to a whole pound — so annualise the monthly figure rather
  // than taking 9% of the annual excess, which overstates it slightly.
  //
  // Settle to whole pence before flooring: in binary a repayment of exactly
  // £145 evaluates to 144.999…, which would otherwise floor to £144.
  const pence = Math.round((Math.max(earnings - threshold, 0) / 12) * rate * 100);
  return Math.floor(pence / 100) * 12;
}

export function takeHome(input: TakeHomeInput): TakeHomeResult {
  const salary = Math.max(input.gross, 0);
  const gross = salary + Math.max(input.bonus, 0);
  const pension = salary * (Math.max(input.pensionPct, 0) / 100);

  const sacrificing = input.pensionMethod === "sacrifice";
  // Salary sacrifice lowers the earnings figure for both taxes; relief at
  // source only lowers the income-tax base, so NI is still charged on the lot.
  const taxableGross = sacrificing ? gross - pension : gross;
  const incomeTaxBase = gross - pension;

  const incomeTax = incomeTaxOn(incomeTaxBase);
  const nationalInsurance = nationalInsuranceOn(taxableGross);
  const loan = studentLoanOn(taxableGross, input.studentLoan);

  const net = gross - pension - incomeTax - nationalInsurance - loan;

  return {
    gross,
    taxableGross,
    pension,
    personalAllowance: personalAllowanceFor(incomeTaxBase),
    incomeTax,
    nationalInsurance,
    studentLoan: loan,
    net,
    effectiveRate: gross > 0 ? (gross - net) / gross : 0,
    marginalRate: marginalRateAt(gross, input),
  };
}

/**
 * Tax charged on the next £1, measured rather than derived from the bands, so
 * the taper and every threshold fall out of the model instead of being
 * special-cased. A sacrificed pension still lowers the base it is charged on.
 */
function marginalRateAt(total: number, input: TakeHomeInput): number {
  if (total <= 0) return 0;
  const step = 1;
  const chargedAt = (value: number) => {
    // The extra pound is salary, so it attracts the pension percentage too.
    const pension = (value - input.bonus) * (Math.max(input.pensionPct, 0) / 100);
    const taxableGross =
      input.pensionMethod === "sacrifice" ? value - pension : value;
    return (
      incomeTaxOn(value - pension) +
      nationalInsuranceOn(taxableGross) +
      studentLoanOn(taxableGross, input.studentLoan)
    );
  };
  return (chargedAt(total + step) - chargedAt(total)) / step;
}
