import { takeHome, type StudentLoanPlan } from "@/lib/tax/uk";

export interface Offer {
  id: string;
  label: string;
  base: number;
  /** Target annual bonus, as a percent of base. */
  bonusPct: number;
  /** One-off cash on joining, counted in year 1 only. */
  signOn: number;
  /** Total equity grant at today's valuation. */
  equity: number;
  /** Years the grant vests over. */
  vestYears: number;
  /** Expected annual change in the share price, as a percent. */
  growthPct: number;
}

export interface YearRow {
  year: number;
  base: number;
  bonus: number;
  signOn: number;
  equity: number;
  gross: number;
  net: number;
}

export interface OfferResult {
  offer: Offer;
  years: YearRow[];
  totalGross: number;
  totalNet: number;
}

export interface Assumptions {
  horizonYears: number;
  pensionPct: number;
  pensionMethod: "sacrifice" | "relief";
  studentLoan: StudentLoanPlan;
  /** Annual base-salary rise, as a percent. */
  raisePct: number;
}

export const DEFAULT_ASSUMPTIONS: Assumptions = {
  horizonYears: 4,
  pensionPct: 5,
  pensionMethod: "sacrifice",
  studentLoan: "none",
  raisePct: 3,
};

export function emptyOffer(id: string, label: string): Offer {
  return {
    id,
    label,
    base: 120_000,
    bonusPct: 15,
    signOn: 0,
    equity: 100_000,
    vestYears: 4,
    growthPct: 10,
  };
}

/**
 * Vesting is modelled as equal annual tranches, each valued at the share price
 * expected in the year it lands. A one-year cliff makes no difference on an
 * annual grid — the first tranche vests at the end of year one either way.
 */
function equityVestedIn(offer: Offer, year: number): number {
  if (offer.vestYears <= 0 || year > offer.vestYears) return 0;
  const tranche = offer.equity / offer.vestYears;
  return tranche * Math.pow(1 + offer.growthPct / 100, year);
}

export function evaluate(offer: Offer, assumptions: Assumptions): OfferResult {
  const years: YearRow[] = [];

  for (let year = 1; year <= assumptions.horizonYears; year += 1) {
    const base = offer.base * Math.pow(1 + assumptions.raisePct / 100, year - 1);
    const bonus = base * (offer.bonusPct / 100);
    const signOn = year === 1 ? offer.signOn : 0;
    const equity = equityVestedIn(offer, year);

    // Vesting RSUs and cash bonuses are both taxed as employment income, so
    // they ride on top of salary rather than being taxed in isolation.
    const { net } = takeHome({
      gross: base,
      bonus: bonus + signOn + equity,
      pensionPct: assumptions.pensionPct,
      pensionMethod: assumptions.pensionMethod,
      studentLoan: assumptions.studentLoan,
    });

    years.push({
      year,
      base,
      bonus,
      signOn,
      equity,
      gross: base + bonus + signOn + equity,
      net,
    });
  }

  return {
    offer,
    years,
    totalGross: years.reduce((sum, row) => sum + row.gross, 0),
    totalNet: years.reduce((sum, row) => sum + row.net, 0),
  };
}
