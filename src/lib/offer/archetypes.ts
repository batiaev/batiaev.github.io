/**
 * Comparing compensation *shapes*, not numbers.
 *
 * Like-for-like tools already exist. The harder question is the one you
 * actually face: a startup that might pay nothing, a scale-up whose paper
 * gains are plausible, or an enterprise seat with no upside at all. Those are
 * different bets, and comparing their headline totals is meaningless — the
 * only honest comparison is a distribution, so every archetype is scored on a
 * downside, an expected and an upside case.
 */

export type ArchetypeId = "startup" | "hypergrowth" | "enterprise" | "custom";
export type EquityKind = "none" | "rsu" | "options";
export type Scenario = "downside" | "expected" | "upside";

export interface Offer {
  id: string;
  label: string;
  archetype: ArchetypeId;

  base: number;
  bonusPct: number;
  signOn: number;

  equityKind: EquityKind;
  /** Share of the company granted, before any future dilution. */
  grantPct: number;
  /** Company valuation today, which the grant is a slice of. */
  valuationNow: number;
  /** Strike as a share of today's valuation. Ignored for RSUs. */
  strikeDiscount: number;

  vestYears: number;
  cliffMonths: number;

  /** Financing rounds expected before an exit, and the dilution each causes. */
  rounds: number;
  dilutionPerRound: number;

  /** The exit case: what the company sells for, and when. */
  exitValuation: number;
  yearsToExit: number;
  /** Probability that the exit happens at all. */
  exitProbability: number;
}

export interface ArchetypePreset {
  id: Exclude<ArchetypeId, "custom">;
  label: string;
  /** One line on what you are actually buying. */
  blurb: string;
  offer: Omit<Offer, "id" | "label" | "archetype">;
}

/**
 * Illustrative London senior/exec shapes, not quoted offers. The point is the
 * relationship between the three, which is stable even when the absolute
 * numbers move.
 */
export const ARCHETYPES: ArchetypePreset[] = [
  {
    id: "startup",
    label: "Startup",
    blurb:
      "Below-market cash for a real slice of the company. Most of the time it is worth nothing; occasionally it is worth more than a decade of salary.",
    offer: {
      base: 110_000,
      bonusPct: 0,
      signOn: 0,
      equityKind: "options",
      grantPct: 0.75,
      valuationNow: 15_000_000,
      strikeDiscount: 0.3,
      vestYears: 4,
      cliffMonths: 12,
      rounds: 3,
      dilutionPerRound: 20,
      // The bet only makes sense on a genuinely large outcome — and the odds
      // have to be priced accordingly. A 40× at one-in-ten is the shape; a
      // modest exit at comfortable odds is a worse version of hypergrowth.
      exitValuation: 600_000_000,
      yearsToExit: 6,
      exitProbability: 10,
    },
  },
  {
    id: "hypergrowth",
    label: "Hypergrowth",
    blurb:
      "Market cash plus equity in something that already works. Dilution is milder, the odds are far better, and the ceiling is lower.",
    offer: {
      base: 150_000,
      bonusPct: 15,
      signOn: 20_000,
      equityKind: "rsu",
      grantPct: 0.03,
      valuationNow: 2_000_000_000,
      strikeDiscount: 0,
      vestYears: 4,
      cliffMonths: 12,
      rounds: 1,
      dilutionPerRound: 10,
      exitValuation: 6_000_000_000,
      yearsToExit: 4,
      exitProbability: 55,
    },
  },
  {
    id: "enterprise",
    label: "Enterprise",
    blurb:
      "The most cash, the most certainty, and no upside whatsoever. Base plus bonus is the entire story.",
    offer: {
      base: 185_000,
      bonusPct: 25,
      signOn: 0,
      equityKind: "none",
      grantPct: 0,
      valuationNow: 0,
      strikeDiscount: 0,
      vestYears: 0,
      cliffMonths: 0,
      rounds: 0,
      dilutionPerRound: 0,
      exitValuation: 0,
      yearsToExit: 0,
      exitProbability: 0,
    },
  },
];

export function offerFromArchetype(preset: ArchetypePreset, id: string): Offer {
  return { id, label: preset.label, archetype: preset.id, ...preset.offer };
}

/** Ownership left after every expected round has diluted the grant. */
export function dilutedPct(offer: Offer): number {
  const survival = Math.pow(1 - offer.dilutionPerRound / 100, offer.rounds);
  return offer.grantPct * survival;
}

/**
 * Gross equity value at exit, before tax. Options only pay out the spread over
 * the strike, which is why a cheap-looking grant at a high strike can be worth
 * far less than the same percentage in shares.
 */
export function equityValueAtExit(offer: Offer): number {
  if (offer.equityKind === "none") return 0;

  const share = dilutedPct(offer) / 100;
  const gross = offer.exitValuation * share;
  if (offer.equityKind === "rsu") return Math.max(gross, 0);

  const strikeCost = offer.valuationNow * offer.strikeDiscount * (offer.grantPct / 100);
  return Math.max(gross - strikeCost, 0);
}

/** The fraction of a grant vested after a given number of years. */
export function vestedFraction(offer: Offer, years: number): number {
  if (offer.vestYears <= 0) return 0;
  if (years * 12 < offer.cliffMonths) return 0;
  return Math.min(years / offer.vestYears, 1);
}

/**
 * Equity actually realised in a scenario. Nothing vests that you did not stay
 * for, and nothing pays out unless the exit happens.
 */
export function equityInScenario(offer: Offer, scenario: Scenario): number {
  if (offer.equityKind === "none") return 0;

  const vested = vestedFraction(offer, offer.yearsToExit);
  const full = equityValueAtExit(offer) * vested;

  if (scenario === "downside") return 0;
  if (scenario === "upside") return full;
  return full * (offer.exitProbability / 100);
}
