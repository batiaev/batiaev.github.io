import { TAX_YEAR } from "@/lib/tax/uk";

export interface RouteMeta {
  title: string;
  description: string;
}

/**
 * Per-route title and description, in one place so the client-side hook and
 * the build-time prerenderer cannot drift. Crawlers that do not run JavaScript
 * only ever see what the prerenderer bakes into the static head.
 */
export const ROUTE_META: Record<string, RouteMeta> = {
  "/advisory": {
    title: "Advisory & technical diligence — Anton Batiaev",
    description:
      "Selective advisory for founders and investors: technical diligence, architecture de-risking, and fractional CTO work in regulated fintech.",
  },
  "/learn": {
    title: "Options, plainly — a working knowledge base | Anton Batiaev",
    description:
      "Free notes on options: calls and puts, the Greeks, implied volatility and the smile, plus a page per strategy with a live payoff chart driven by the same pricing model as the calculator.",
  },
  "/tools": {
    title: "Free finance calculators — options P&L, UK take-home, compensation",
    description:
      "Free, no-signup calculators that run entirely in your browser: options strategy P&L with Greeks, UK take-home across four employment structures, and compensation comparison by archetype.",
  },
  "/tools/options-pnl": {
    title:
      "Options P&L calculator — payoff, Greeks, breakevens | Anton Batiaev",
    description:
      "Free options strategy calculator: exact expiry payoff, Black-Scholes and Black-76 P&L before expiry, Greeks, breakevens and shareable links. No signup, runs in your browser.",
  },
  "/tools/take-home": {
    title: `Employed vs self-employed vs limited company — UK take-home ${TAX_YEAR}`,
    description: `Compare the same income as an employee, a sole trader, through your own limited company, or via an umbrella. ${TAX_YEAR} income tax, Class 1 and Class 4 NI, corporation tax and dividend tax. Free, runs in your browser.`,
  },
  "/tools/offer": {
    title: "Startup vs hypergrowth vs enterprise — compensation comparison",
    description:
      "Compare compensation shapes, not salaries. Price a startup grant, a scale-up RSU package and an enterprise base as distributions — downside, probability-weighted and upside — after dilution and UK tax.",
  },
};
