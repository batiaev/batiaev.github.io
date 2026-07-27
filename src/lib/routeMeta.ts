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
  "/tools": {
    title:
      "Free finance calculators — options P&L, UK take-home, offer comparison",
    description:
      "Free, no-signup calculators that run entirely in your browser: options strategy P&L with Greeks, UK take-home pay, and after-tax job offer comparison.",
  },
  "/tools/options-pnl": {
    title:
      "Options P&L calculator — payoff, Greeks, breakevens | Anton Batiaev",
    description:
      "Free options strategy calculator: exact expiry payoff, Black-Scholes and Black-76 P&L before expiry, Greeks, breakevens and shareable links. No signup, runs in your browser.",
  },
  "/tools/take-home": {
    title: `UK take-home pay calculator ${TAX_YEAR} — tax, NI, pension | Anton Batiaev`,
    description: `Free UK salary calculator for the ${TAX_YEAR} tax year: income tax, National Insurance, pension salary sacrifice, student loans, and your marginal rate — including the 60% personal-allowance trap. Runs entirely in your browser.`,
  },
  "/tools/offer": {
    title:
      "Job offer comparison calculator — salary, bonus, equity | Anton Batiaev",
    description:
      "Compare two job offers after UK tax: base, bonus, sign-on and equity vesting over four years, with income tax, National Insurance and pension applied to each year. Free, no signup.",
  },
};
