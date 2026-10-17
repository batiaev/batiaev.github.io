/* Properties the market-making formulas — and the note that quotes them — have to satisfy. Run: npm run verify:market-making */
import fs from "node:fs";
import {
  inventorySkew,
  markoutTicks,
  optimalSpread,
  quotes,
  reservationPrice,
  type InventoryInput,
} from "../src/lib/markets/marketMaking";

let failures = 0;

function check(label: string, ok: boolean, detail = "") {
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `: ${detail}` : ""}`);
}

function near(label: string, actual: number, expected: number, tol = 1e-9) {
  check(
    label,
    Math.abs(actual - expected) <= tol,
    `got ${actual}, want ${expected} ±${tol}`,
  );
}

const note = fs.readFileSync("src/learn/content/markets-market-making.mdx", "utf8");

// --- The worked example printed in the note ---------------------------------
// Mid 100.00, long 10, γ = 0.01, σ = 2 per √day, half a day left.
const example: InventoryInput = {
  mid: 100,
  inventory: 10,
  riskAversion: 0.01,
  volatility: 2,
  horizon: 0.5,
};
const skew = inventorySkew(example);
const reservation = reservationPrice(example);
near("worked example: skew is 0.20", skew, 0.2);
near("worked example: reservation price is 99.80", reservation, 99.8);
check(
  "the note prints the computed skew",
  note.includes(`10 × 0.01 × 4 × 0.5 = ${skew.toFixed(2)}`),
);
check("the note prints the computed reservation price", note.includes(reservation.toFixed(2)));

// --- Shape of the skew --------------------------------------------------------
near("flat book quotes around the mid", reservationPrice({ ...example, inventory: 0 }), 100);
near(
  "short inventory skews up by the same amount",
  reservationPrice({ ...example, inventory: -10 }) - 100,
  100 - reservation,
);
near(
  "double the position, double the skew",
  inventorySkew({ ...example, inventory: 20 }) / skew,
  2,
);
near(
  "double the volatility, four times the skew",
  inventorySkew({ ...example, volatility: 4 }) / skew,
  4,
);
check("the note says so", /Double the position and the skew\s+doubles/.test(note) && note.includes("quadruples"));
near("no time left, no skew", reservationPrice({ ...example, horizon: 0 }), 100);
check(
  "more risk aversion skews harder",
  inventorySkew({ ...example, riskAversion: 0.02 }) > skew,
);

// --- The spread -----------------------------------------------------------------
const spreadBase = { riskAversion: 0.01, volatility: 2, horizon: 0.5, intensityDecay: 1.5 };
const spread = optimalSpread(spreadBase);
check("spread is positive", spread > 0, spread.toFixed(4));
check(
  "spread widens with volatility",
  optimalSpread({ ...spreadBase, volatility: 3 }) > spread,
);
check(
  "spread widens with time left to carry",
  optimalSpread({ ...spreadBase, horizon: 1 }) > spread,
);
check(
  "spread narrows as fills fall away faster (higher k)",
  optimalSpread({ ...spreadBase, intensityDecay: 3 }) < spread,
);
near(
  "γ → 0 recovers the 2/k limit",
  optimalSpread({ ...spreadBase, riskAversion: 1e-9 }),
  optimalSpread({ ...spreadBase, riskAversion: 0 }) + 1e-9 * 4 * 0.5,
  1e-6,
);
near("γ = 0 returns 2/k exactly", optimalSpread({ ...spreadBase, riskAversion: 0 }), 2 / 1.5);

// The note claims risk aversion does not necessarily widen the spread. Pin both
// halves: a quiet market where more γ narrows it, a fast one where it widens.
const quiet = { riskAversion: 0.1, volatility: 0.1, horizon: 0.1, intensityDecay: 1.5 };
check(
  "in a quiet market more risk aversion narrows the spread",
  optimalSpread({ ...quiet, riskAversion: 1 }) < optimalSpread(quiet),
);
const fast = { riskAversion: 0.1, volatility: 3, horizon: 1, intensityDecay: 1.5 };
check(
  "in a fast market more risk aversion widens it",
  optimalSpread({ ...fast, riskAversion: 1 }) > optimalSpread(fast),
);
check(
  "the note does not claim the spread always widens with risk aversion",
  !/widens with[^.]*risk\s+aversion/.test(note) && note.includes("does not necessarily quote wider"),
);

// --- Quotes ---------------------------------------------------------------------
const q = quotes({ ...example, intensityDecay: 1.5 });
check("bid below reservation below ask", q.bid < q.reservation && q.reservation < q.ask);
near("ask minus bid is the spread", q.ask - q.bid, q.spread, 1e-12);
near("quotes are centred on the reservation price", (q.ask + q.bid) / 2, q.reservation, 1e-12);

// --- Markouts -------------------------------------------------------------------
near("note example: bought 99.98, mid 99.90 a second later, −8 ticks", markoutTicks("buy", 99.98, 99.9, 0.01), -8);
near("the same move after a sale is +8", markoutTicks("sell", 99.98, 99.9, 0.01), 8);
near("no move, no markout", markoutTicks("buy", 100, 100, 0.01), 0);
check("the note prints −8 ticks", note.includes("−8 ticks"));

// --- Hostile input ----------------------------------------------------------------
check("cleared field gives NaN, not a price", Number.isNaN(reservationPrice({ ...example, mid: NaN })));
check("negative volatility is refused", Number.isNaN(inventorySkew({ ...example, volatility: -1 })));
check("negative risk aversion is refused", Number.isNaN(optimalSpread({ ...spreadBase, riskAversion: -0.1 })));
check("zero k is refused", Number.isNaN(optimalSpread({ ...spreadBase, intensityDecay: 0 })));
check("zero tick is refused", Number.isNaN(markoutTicks("buy", 100, 99, 0)));
check("infinite inventory is refused", Number.isNaN(inventorySkew({ ...example, inventory: Infinity })));

console.log(
  failures === 0 ? "\nMarket-making formulas clean." : `\n${failures} problem(s).`,
);
process.exit(failures === 0 ? 0 : 1);
