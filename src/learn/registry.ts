import { presets } from "@/lib/options/presets";

/**
 * One definition of the knowledge base: navigation, routing, prev/next,
 * prerendering and the sitemap all read from here, so a new page cannot
 * appear in the sidebar and be missing from the build.
 */

export interface LearnPage {
  slug: string;
  title: string;
  /** Sentence used on index cards and as the meta description. */
  summary: string;
  section: string;
  /** Drives "related pages" and widens what search will match. */
  tags: string[];
}

export interface LearnSection {
  id: string;
  title: string;
  blurb: string;
  pages: LearnPage[];
}

/** Editorial notes per strategy; the numbers come from the options engine. */
export interface StrategyNote {
  /** Matches a preset id in lib/options/presets. */
  id: string;
  slug: string;
  title: string;
  summary: string;
  /** When this trade is the right shape. */
  whenToUse: string;
  /** What actually goes wrong, stated plainly. */
  risks: string[];
  /** The view the position expresses, in one line. */
  view: string;
  tags: string[];
}

export const STRATEGY_NOTES: StrategyNote[] = [
  {
    id: "long-call",
    slug: "long-call",
    title: "Long call",
    summary:
      "The simplest bullish option: defined risk, unlimited upside, and a bill for time decay every day you are wrong.",
    view: "Up, and soon enough to beat theta.",
    tags: ["directional", "long premium", "beginner", "theta"],
    whenToUse:
      "You want exposure to a rise without putting up the cash for the shares, and you can name a date by which you expect it. The premium is the most you can lose, which makes this the usual first option anyone buys.",
    risks: [
      "Time decay works against you every day, and accelerates as expiry approaches.",
      "Being right about direction but late is the same as being wrong.",
      "A fall in implied volatility can lose you money even if the underlying rises.",
    ],
  },
  {
    id: "long-put",
    slug: "long-put",
    title: "Long put",
    summary:
      "Downside exposure with a floor on the loss — the cleanest way to be short without unlimited risk.",
    view: "Down, or a hedge against something you own.",
    tags: ["directional", "long premium", "hedging", "beginner"],
    whenToUse:
      "Either an outright bearish view, or insurance on a holding you do not want to sell. As a hedge it is expensive precisely when you most want it, because volatility rises as markets fall.",
    risks: [
      "Puts are usually priced above their theoretical value, because everyone wants the same insurance.",
      "The premium is a certain cost against an uncertain payoff.",
      "Time decay again — a slow decline can still lose money.",
    ],
  },
  {
    id: "covered-call",
    slug: "covered-call",
    title: "Covered call",
    summary:
      "Own the underlying, sell someone the right to take it from you above a set price, and keep the premium either way.",
    view: "Flat to mildly up, and you are content to sell at the strike.",
    tags: ["income", "short premium", "assignment", "beginner"],
    whenToUse:
      "You hold the asset, you would be happy selling at a particular level, and you want to be paid for the wait. Popular as an income trade, and reasonable when you genuinely mean the sell.",
    risks: [
      "You keep the entire downside and cap the upside — the payoff is the opposite shape to the one people assume they are buying.",
      "A sharp rally means you sell at the strike and watch it keep going.",
      "The premium is small compensation for a large move in either direction.",
    ],
  },
  {
    id: "cash-secured-put",
    slug: "cash-secured-put",
    title: "Cash-secured put",
    summary:
      "Get paid to bid below the market, with the cash set aside to buy if you are filled.",
    view: "You want to own it, but lower.",
    tags: ["income", "short premium", "assignment", "beginner"],
    whenToUse:
      "You are a willing buyer at a price below spot. Selling the put pays you to wait, and if it is assigned you buy at a level you already chose.",
    risks: [
      "Identical payoff to a covered call — the downside is the whole move to zero, less the premium.",
      "You get assigned exactly when you least want to buy, because the price fell for a reason.",
      "The cash is tied up for the life of the trade.",
    ],
  },
  {
    id: "bull-call-spread",
    slug: "bull-call-spread",
    title: "Bull call spread",
    summary:
      "Buy a call, sell a higher one. Cheaper than the call alone, with the upside capped at the short strike.",
    view: "Up, but only so far.",
    tags: ["directional", "spread", "defined risk"],
    whenToUse:
      "You have a target rather than a hope. Selling the upper strike funds part of the position and cuts the amount time decay can take from you.",
    risks: [
      "The cap is real: everything above the short strike belongs to someone else.",
      "Both legs have to be closed, so spreads cost more to trade than they look.",
      "Maximum profit only arrives at expiry, not on the way there.",
    ],
  },
  {
    id: "bear-put-spread",
    slug: "bear-put-spread",
    title: "Bear put spread",
    summary: "The same trade pointed down: buy a put, sell a lower one.",
    view: "Down, to a level you can name.",
    tags: ["directional", "spread", "defined risk"],
    whenToUse:
      "A bearish view with a floor in mind — support, a valuation, a level you do not expect to break. Cheaper than the outright put for the same reason.",
    risks: [
      "Capped at the lower strike, so a crash pays no more than a slide.",
      "Still a debit: you can lose the whole premium.",
      "Short put legs can be assigned early if they go deep in the money.",
    ],
  },
  {
    id: "long-straddle",
    slug: "long-straddle",
    title: "Long straddle",
    summary:
      "Buy the call and the put at the same strike. A bet on movement, indifferent to direction.",
    view: "Something is about to happen. No idea which way.",
    tags: ["volatility", "long premium", "vega", "events"],
    whenToUse:
      "Ahead of a binary event — earnings, a ruling, a launch — where the size of the move matters more than its sign.",
    risks: [
      "You are buying volatility that is already priced for the event, so the move has to beat expectations, not just happen.",
      "Implied volatility usually collapses the moment the news lands, which can lose money even on a correct call.",
      "Two premiums to recover means the breakevens are further out than they feel.",
    ],
  },
  {
    id: "short-strangle",
    slug: "short-strangle",
    title: "Short strangle",
    summary:
      "Sell an out-of-the-money put and call. Collect premium while nothing happens — and carry an undefined tail.",
    view: "Quiet, and quieter than the market is pricing.",
    tags: ["volatility", "short premium", "vega", "margin", "tail risk"],
    whenToUse:
      "When implied volatility looks expensive relative to what you expect to be realised. It wins most of the time, which is exactly what makes it dangerous.",
    risks: [
      "Losses are unbounded on the upside and very large on the downside.",
      "A high win rate hides the shape: many small gains and occasional catastrophic ones.",
      "Margin requirements expand as the position moves against you, forcing you out at the worst moment.",
    ],
  },
  {
    id: "iron-condor",
    slug: "iron-condor",
    title: "Iron condor",
    summary:
      "A short strangle with both tails bought back. Same idea, defined risk, smaller credit.",
    view: "Range-bound, and you want to sleep.",
    tags: ["volatility", "short premium", "defined risk", "margin"],
    whenToUse:
      "The disciplined version of selling volatility. The wings cost part of the premium and convert an unbounded loss into a known one.",
    risks: [
      "The maximum loss is usually several times the credit received.",
      "Four legs means four lots of spread and commission.",
      "It needs the underlying to stay inside the range at expiry, not merely to pass through it.",
    ],
  },
  {
    id: "long-butterfly",
    slug: "long-butterfly",
    title: "Long butterfly",
    summary:
      "A cheap, narrow bet that the underlying finishes at a particular price.",
    view: "It pins, right here.",
    tags: ["volatility", "defined risk", "pinning"],
    whenToUse:
      "A precise view on where something settles, with very little capital at risk. The payoff peak is sharp and only exists at expiry.",
    risks: [
      "The profit zone is narrow and the peak is only reached at expiry.",
      "Three strikes, four contracts — execution costs eat a low-premium trade.",
      "Usually expires worthless, which is the price of the asymmetry.",
    ],
  },
  {
    id: "collar",
    slug: "collar",
    title: "Collar",
    summary:
      "Hold the asset, buy a protective put, and sell a call to pay for it.",
    view: "I want to keep this, but not the tail risk.",
    tags: ["hedging", "income", "concentrated position"],
    whenToUse:
      "A concentrated holding you cannot or will not sell — vested shares being the obvious case. The short call funds the insurance, sometimes entirely.",
    risks: [
      "You give up the upside above the call strike, which on a concentrated position is often the whole reason you held it.",
      "Selling calls against shares you cannot deliver creates a real problem if assigned.",
      "For employee shares, the tax treatment of a collar is rarely as simple as the payoff diagram.",
    ],
  },
];

const conceptPages: LearnPage[] = [
  {
    slug: "options/basics",
    tags: ["beginner", "calls and puts", "intrinsic value", "theta"],
    title: "What an option actually is",
    summary:
      "Calls, puts, strike, expiry and the difference between intrinsic and extrinsic value — the vocabulary everything else assumes.",
    section: "options",
  },
  {
    slug: "options/greeks",
    tags: ["greeks", "delta", "gamma", "vega", "theta"],
    title: "The Greeks, without the calculus",
    summary:
      "Delta, gamma, vega and theta as four questions about the same position, and which one actually kills you.",
    section: "options",
  },
  {
    slug: "options/volatility",
    tags: ["volatility", "implied volatility", "smile", "vega", "pricing"],
    title: "Implied volatility is the price",
    summary:
      "Why an option's quoted premium is really a volatility number, and what the smile is telling you.",
    section: "options",
  },
];

const strategyPages: LearnPage[] = STRATEGY_NOTES.map((note) => ({
  slug: `strategies/${note.slug}`,
  title: note.title,
  summary: note.summary,
  section: "strategies",
  tags: note.tags,
}));

const riskPages: LearnPage[] = [
  {
    slug: "risk/span",
    tags: ["margin", "span", "portfolio margin", "short premium", "exchange", "risk systems", "measurement"],
    title: "SPAN, and why your margin is not what you expected",
    summary:
      "How exchange portfolio margining actually works: the sixteen-scenario risk array, spread charges, and the short option minimum that catches people out.",
    section: "risk",
  },
  {
    slug: "risk/var-and-es",
    tags: ["var", "expected shortfall", "risk measure", "basel", "tail risk", "risk systems", "measurement"],
    title: "VAR, and what it does not tell you",
    summary:
      "Value at Risk in one sentence, the three ways to compute it, the reason it is not a coherent risk measure, and why regulators moved to Expected Shortfall.",
    section: "risk",
  },
  {
    slug: "risk/dv01",
    tags: ["dv01", "duration", "convexity", "rates", "hedging", "risk systems", "measurement"],
    title: "DV01 and the shape of rate risk",
    summary:
      "The one number a rates desk actually watches, how it relates to duration and convexity, and why a single parallel shift is not enough.",
    section: "risk",
  },
];

const libraryPages: LearnPage[] = [
  {
    slug: "library/books",
    // Also tagged with what the recommendations are about, so each page is
    // reachable from the topics it covers rather than being a dead end.
    tags: [
      "books",
      "further reading",
      "culture",
      "volatility",
      "greeks",
      "risk measure",
      "pricing",
    ],
    title: "Books",
    summary:
      "The reference texts worth owning, the narratives worth reading, and where to look when both run out.",
    section: "library",
  },
  {
    slug: "library/series",
    tags: ["series", "further reading", "culture", "risk measure"],
    title: "TV series",
    summary:
      "Longer form gets closer to the texture of the job than any film has managed — desk culture, hierarchy, and the parts nobody puts in a prospectus.",
    section: "library",
  },
  {
    slug: "library/films",
    tags: ["films", "further reading", "culture", "pricing"],
    title: "Films",
    summary:
      "Which films get the culture right even when they bend the mechanics, and which ones to watch knowing exactly what they are.",
    section: "library",
  },
];

export const SECTIONS: LearnSection[] = [
  {
    id: "options",
    title: "Options",
    blurb: "The concepts every strategy page assumes you already have.",
    pages: conceptPages,
  },
  {
    id: "strategies",
    title: "Strategies",
    blurb:
      "One page per structure, each with a live payoff chart you can edit and open in the calculator.",
    pages: strategyPages,
  },
  {
    id: "risk",
    title: "Risk",
    blurb:
      "How the positions above are margined and measured — the systems side, which is the part I actually built.",
    pages: riskPages,
  },
  {
    id: "library",
    title: "Library",
    blurb: "Where to go when this runs out — one page each for books, series and films.",
    pages: libraryPages,
  },
];

export const ALL_PAGES: LearnPage[] = SECTIONS.flatMap((s) => s.pages);

export function learnPath(slug: string): string {
  return `/learn/${slug}`;
}

export function pageBySlug(slug: string): LearnPage | undefined {
  return ALL_PAGES.find((page) => page.slug === slug);
}

export function noteBySlug(slug: string): StrategyNote | undefined {
  return STRATEGY_NOTES.find((note) => `strategies/${note.slug}` === slug);
}

/** Ordered neighbours, for the prev/next footer. */
export function neighbours(slug: string): {
  previous?: LearnPage;
  next?: LearnPage;
} {
  const index = ALL_PAGES.findIndex((page) => page.slug === slug);
  if (index < 0) return {};
  return {
    previous: index > 0 ? ALL_PAGES[index - 1] : undefined,
    next: index < ALL_PAGES.length - 1 ? ALL_PAGES[index + 1] : undefined,
  };
}

/**
 * Pages sharing the most tags, nearest first. Tag overlap beats a hand-curated
 * list here because the alternative is remembering to update every neighbour
 * whenever a page is added.
 */
export function relatedPages(slug: string, limit = 3): LearnPage[] {
  const page = pageBySlug(slug);
  if (!page) return [];

  return ALL_PAGES.filter((other) => other.slug !== slug)
    .map((other) => ({
      other,
      score: other.tags.filter((tag) => page.tags.includes(tag)).length,
      // A page from another section is more useful than a fifth near-identical
      // strategy, so break ties towards cross-section links.
      crossSection: other.section === page.section ? 0 : 1,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.crossSection - a.crossSection)
    .slice(0, limit)
    .map(({ other }) => other);
}

/** Every tag in use, with how many pages carry it. */
export function tagCounts(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  ALL_PAGES.forEach((page) =>
    page.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1)),
  );
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Guards against a note referencing a preset that no longer exists. */
export function orphanedNotes(): string[] {
  const ids = new Set(presets.map((preset) => preset.id));
  return STRATEGY_NOTES.filter((note) => !ids.has(note.id)).map((n) => n.id);
}
