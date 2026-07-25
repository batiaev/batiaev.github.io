import { valueOption, type OptionType } from "./blackScholes";
import { newLegId, type Leg, type Position } from "./strategy";

interface PresetLeg {
  kind: Leg["kind"];
  side: Leg["side"];
  qty: number;
  /** Strike as a multiple of the current underlying price. */
  strikeRatio?: number;
}

export interface Preset {
  id: string;
  name: string;
  blurb: string;
  legs: PresetLeg[];
}

export const DEFAULT_EXPIRY_DAYS = 30;
export const DEFAULT_MULTIPLIER = 100;

export const presets: Preset[] = [
  {
    id: "long-call",
    name: "Long call",
    blurb: "Defined risk, unlimited upside.",
    legs: [{ kind: "call", side: "long", qty: 1, strikeRatio: 1 }],
  },
  {
    id: "long-put",
    name: "Long put",
    blurb: "Defined risk, pays off on the way down.",
    legs: [{ kind: "put", side: "long", qty: 1, strikeRatio: 1 }],
  },
  {
    id: "covered-call",
    name: "Covered call",
    blurb: "Own the underlying, sell upside for premium.",
    legs: [
      { kind: "underlying", side: "long", qty: 100 },
      { kind: "call", side: "short", qty: 1, strikeRatio: 1.05 },
    ],
  },
  {
    id: "cash-secured-put",
    name: "Cash-secured put",
    blurb: "Get paid to bid below the market.",
    legs: [{ kind: "put", side: "short", qty: 1, strikeRatio: 0.95 }],
  },
  {
    id: "bull-call-spread",
    name: "Bull call spread",
    blurb: "Vertical: capped cost, capped upside.",
    legs: [
      { kind: "call", side: "long", qty: 1, strikeRatio: 1 },
      { kind: "call", side: "short", qty: 1, strikeRatio: 1.1 },
    ],
  },
  {
    id: "bear-put-spread",
    name: "Bear put spread",
    blurb: "Vertical: the same trade, pointed down.",
    legs: [
      { kind: "put", side: "long", qty: 1, strikeRatio: 1 },
      { kind: "put", side: "short", qty: 1, strikeRatio: 0.9 },
    ],
  },
  {
    id: "long-straddle",
    name: "Long straddle",
    blurb: "Long volatility, indifferent to direction.",
    legs: [
      { kind: "call", side: "long", qty: 1, strikeRatio: 1 },
      { kind: "put", side: "long", qty: 1, strikeRatio: 1 },
    ],
  },
  {
    id: "short-strangle",
    name: "Short strangle",
    blurb: "Short volatility with an undefined tail.",
    legs: [
      { kind: "put", side: "short", qty: 1, strikeRatio: 0.9 },
      { kind: "call", side: "short", qty: 1, strikeRatio: 1.1 },
    ],
  },
  {
    id: "iron-condor",
    name: "Iron condor",
    blurb: "Short volatility, both tails bought back.",
    legs: [
      { kind: "put", side: "long", qty: 1, strikeRatio: 0.85 },
      { kind: "put", side: "short", qty: 1, strikeRatio: 0.93 },
      { kind: "call", side: "short", qty: 1, strikeRatio: 1.07 },
      { kind: "call", side: "long", qty: 1, strikeRatio: 1.15 },
    ],
  },
  {
    id: "long-butterfly",
    name: "Long butterfly",
    blurb: "Pins the underlying at the body strike.",
    legs: [
      { kind: "call", side: "long", qty: 1, strikeRatio: 0.95 },
      { kind: "call", side: "short", qty: 2, strikeRatio: 1 },
      { kind: "call", side: "long", qty: 1, strikeRatio: 1.05 },
    ],
  },
  {
    id: "collar",
    name: "Collar",
    blurb: "Hold the underlying, fund the put with a call.",
    legs: [
      { kind: "underlying", side: "long", qty: 100 },
      { kind: "put", side: "long", qty: 1, strikeRatio: 0.95 },
      { kind: "call", side: "short", qty: 1, strikeRatio: 1.05 },
    ],
  },
];

function strikeStep(price: number): number {
  if (price < 25) return 0.5;
  if (price < 100) return 1;
  if (price < 500) return 5;
  return 10;
}

function roundStrike(price: number, ratio: number): number {
  const step = strikeStep(price);
  return Math.max(Math.round((price * ratio) / step) * step, step);
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

type Market = Pick<
  Position,
  "underlying" | "price" | "vol" | "rate" | "dividend"
>;

export function buildLegs(preset: Preset, market: Market, days: number): Leg[] {
  return preset.legs.map((template) => {
    if (template.kind === "underlying") {
      return {
        id: newLegId(),
        kind: "underlying" as const,
        side: template.side,
        qty: template.qty,
        strike: 0,
        premium: round2(market.price),
        days,
        multiplier: 1,
      };
    }

    const strike = roundStrike(market.price, template.strikeRatio ?? 1);
    const { price } = valueOption(template.kind as OptionType, {
      price: market.price,
      strike,
      years: days / 365,
      rate: market.rate,
      carry: market.underlying === "future" ? market.rate : market.dividend,
      vol: market.vol,
    });

    return {
      id: newLegId(),
      kind: template.kind,
      side: template.side,
      qty: template.qty,
      strike,
      premium: Math.max(round2(price), 0.01),
      days,
      multiplier: DEFAULT_MULTIPLIER,
    };
  });
}

export function applyPreset(preset: Preset, position: Position): Position {
  const days =
    position.legs.find((leg) => leg.kind !== "underlying")?.days ??
    DEFAULT_EXPIRY_DAYS;

  return { ...position, legs: buildLegs(preset, position, days) };
}

const defaultMarket: Market = {
  underlying: "spot",
  price: 100,
  vol: 0.25,
  rate: 0.04,
  dividend: 0,
};

export function defaultPosition(): Position {
  const base: Position = {
    ...defaultMarket,
    valuationDays: 0,
    legs: [],
  };

  return applyPreset(presets[4], base);
}
