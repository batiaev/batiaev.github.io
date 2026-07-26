import { newLegId, positionSchema, type Leg, type Position } from "./strategy";

const STORAGE_KEY = "batiaev:options-pnl:v1";
const SCHEMA_VERSION = "1";

const KIND_CODES: Record<Leg["kind"], string> = {
  call: "c",
  put: "p",
  underlying: "u",
};

const KINDS: Record<string, Leg["kind"]> = {
  c: "call",
  p: "put",
  u: "underlying",
};

function num(value: number): string {
  return String(Number(value.toFixed(4)));
}

function parseNum(value: string | null): number | null {
  if (value === null || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function encodePosition(position: Position): string {
  const params = new URLSearchParams({
    v: SCHEMA_VERSION,
    u: position.underlying === "future" ? "f" : "s",
    s: num(position.price),
    iv: num(position.vol * 100),
    r: num(position.rate * 100),
    q: num(position.dividend * 100),
    t: num(position.valuationDays),
    l: position.legs
      .map((leg) =>
        [
          KIND_CODES[leg.kind],
          leg.side === "long" ? "l" : "s",
          num(leg.qty),
          num(leg.strike),
          num(leg.premium),
          num(leg.days),
          num(leg.multiplier),
          leg.premiumMode === "manual" ? "m" : "a",
        ].join("-"),
      )
      .join("_"),
  });

  return params.toString();
}

function decodeLeg(encoded: string): Leg | null {
  const parts = encoded.split("-");
  // Links minted before the premium-mode field carry 7 parts; treat those legs
  // as "manual" so a shared position keeps the premiums it was shared with.
  if (parts.length !== 7 && parts.length !== 8) return null;

  const kind = KINDS[parts[0]];
  if (!kind) return null;

  const [qty, strike, premium, days, multiplier] = parts
    .slice(2, 7)
    .map((part) => parseNum(part));

  if (
    qty === null ||
    strike === null ||
    premium === null ||
    days === null ||
    multiplier === null
  ) {
    return null;
  }

  return {
    id: newLegId(),
    kind,
    side: parts[1] === "s" ? "short" : "long",
    qty,
    strike,
    premium,
    days,
    multiplier,
    premiumMode: parts[7] === "a" ? "auto" : "manual",
  };
}

export function decodePosition(search: string): Position | null {
  const params = new URLSearchParams(search);
  if (params.get("v") !== SCHEMA_VERSION) return null;

  const legs = (params.get("l") ?? "")
    .split("_")
    .filter(Boolean)
    .map(decodeLeg);

  if (legs.some((leg) => leg === null)) return null;

  const candidate = {
    underlying: params.get("u") === "f" ? "future" : "spot",
    price: parseNum(params.get("s")),
    vol: (parseNum(params.get("iv")) ?? 0) / 100,
    rate: (parseNum(params.get("r")) ?? 0) / 100,
    dividend: (parseNum(params.get("q")) ?? 0) / 100,
    valuationDays: parseNum(params.get("t")) ?? 0,
    legs,
  };

  const parsed = positionSchema.safeParse(candidate);
  return parsed.success ? parsed.data : null;
}

export function shareUrl(position: Position): string {
  const { origin, pathname } = window.location;
  return `${origin}${pathname}?${encodePosition(position)}`;
}

export function savePosition(position: Position): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
  } catch {
    // Private browsing or a full quota — the URL is still shareable.
  }
}

export function loadPosition(): Position | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = positionSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
