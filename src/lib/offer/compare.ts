import { takeHome, type StudentLoanPlan } from "@/lib/tax/uk";
import {
  equityInScenario,
  equityValueAtExit,
  vestedFraction,
  type Offer,
  type Scenario,
} from "./archetypes";

export interface Assumptions {
  /** Years compared. Equity lands in the exit year, if it lands at all. */
  horizonYears: number;
  pensionPct: number;
  pensionMethod: "sacrifice" | "relief";
  studentLoan: StudentLoanPlan;
  /** Annual base-salary rise, as a percent. */
  raisePct: number;
}

export const DEFAULT_ASSUMPTIONS: Assumptions = {
  horizonYears: 6,
  pensionPct: 5,
  pensionMethod: "sacrifice",
  studentLoan: "none",
  raisePct: 3,
};

export interface YearRow {
  year: number;
  cash: number;
  equity: number;
  net: number;
  cumulativeNet: number;
}

export interface ScenarioResult {
  scenario: Scenario;
  years: YearRow[];
  totalCashNet: number;
  totalNet: number;
  /** Equity component of totalNet, after tax. */
  equityNet: number;
}

export interface OfferResult {
  offer: Offer;
  downside: ScenarioResult;
  expected: ScenarioResult;
  upside: ScenarioResult;
  /** Gross equity if everything goes right — the number recruiters quote. */
  headlineEquity: number;
}

function evaluateScenario(
  offer: Offer,
  assumptions: Assumptions,
  scenario: Scenario,
): ScenarioResult {
  const equityTotal = equityInScenario(offer, scenario);
  // Equity is realised at the exit, so it is taxed in one year rather than
  // spread — which is exactly what pushes it into the additional rate.
  const exitYear = Math.min(
    Math.max(Math.round(offer.yearsToExit), 1),
    assumptions.horizonYears,
  );
  const equityLands = offer.yearsToExit <= assumptions.horizonYears;

  const years: YearRow[] = [];
  let cumulativeNet = 0;
  let totalCashNet = 0;
  let equityNet = 0;

  for (let year = 1; year <= assumptions.horizonYears; year += 1) {
    const base = offer.base * Math.pow(1 + assumptions.raisePct / 100, year - 1);
    const bonus = base * (offer.bonusPct / 100);
    const signOn = year === 1 ? offer.signOn : 0;
    const equity = equityLands && year === exitYear ? equityTotal : 0;

    const cashOnly = takeHome({
      gross: base,
      bonus: bonus + signOn,
      pensionPct: assumptions.pensionPct,
      pensionMethod: assumptions.pensionMethod,
      studentLoan: assumptions.studentLoan,
    });

    const withEquity =
      equity > 0
        ? takeHome({
            gross: base,
            bonus: bonus + signOn + equity,
            pensionPct: assumptions.pensionPct,
            pensionMethod: assumptions.pensionMethod,
            studentLoan: assumptions.studentLoan,
          })
        : cashOnly;

    const net = withEquity.net;
    cumulativeNet += net;
    totalCashNet += cashOnly.net;
    equityNet += withEquity.net - cashOnly.net;

    years.push({
      year,
      cash: base + bonus + signOn,
      equity,
      net,
      cumulativeNet,
    });
  }

  return {
    scenario,
    years,
    totalCashNet,
    totalNet: cumulativeNet,
    equityNet,
  };
}

export function evaluate(offer: Offer, assumptions: Assumptions): OfferResult {
  return {
    offer,
    downside: evaluateScenario(offer, assumptions, "downside"),
    expected: evaluateScenario(offer, assumptions, "expected"),
    upside: evaluateScenario(offer, assumptions, "upside"),
    headlineEquity:
      equityValueAtExit(offer) * vestedFraction(offer, offer.yearsToExit),
  };
}

export function scenarioOf(result: OfferResult, scenario: Scenario): ScenarioResult {
  if (scenario === "downside") return result.downside;
  if (scenario === "upside") return result.upside;
  return result.expected;
}
