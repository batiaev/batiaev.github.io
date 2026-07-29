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
    title: "Options, derivatives risk and trading systems, from the inside | Anton Batiaev",
    description:
      "Written from ten years building the systems that price and margin derivatives: options and the Greeks, a page per strategy with a live payoff chart, SPAN, VAR, DV01 and dynamic hedging, plus the books worth your time. Free, no signup.",
  },
  "/tools": {
    title: "Free finance calculators — options P&L, UK take-home, compensation",
    description:
      "Free, no-signup calculators that run entirely in your browser: options strategy P&L with Greeks, a dynamic hedging simulator, UK take-home across four employment structures, and compensation comparison by archetype.",
  },
  "/tools/options-pnl": {
    title:
      "Options P&L calculator — payoff, Greeks, breakevens | Anton Batiaev",
    description:
      "Free options strategy calculator: exact expiry payoff, Black-Scholes and Black-76 P&L before expiry, Greeks, breakevens and shareable links. No signup, runs in your browser.",
  },
  "/tools/hedging": {
    title: "Dynamic hedging simulator — what the option premium actually buys",
    description:
      "Sell an option, delta-hedge it to expiry and watch the premium leave through the hedge. Set the volatility you sold at against the volatility the market delivers. Free, runs in your browser.",
  },
  "/tools/smile": {
    title: "Volatility smile from a quote board — implied vol, skew, curvature",
    description:
      "Enter bid and ask for a strip of strikes and get an implied volatility for each side, a fitted smile, and the strikes the market prices clear of its own curve. Free, runs in your browser.",
  },
  "/tools/retirement": {
    title: "How much is enough? — retirement Monte Carlo across ISA, LISA and pension",
    description:
      "Model a UK retirement plan across an ISA, a LISA and a pension: contributions, growth, and spending it down. A thousand return paths give the chance the money lasts, the spending it could support, and where a plan fails. Free, runs in your browser.",
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
