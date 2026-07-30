# batiaev.com

[![License: MIT](https://img.shields.io/dub/l/vibe-d.svg)](https://opensource.org/licenses/MIT)

Personal site for Anton Batiaev — the operator record, a knowledge base on
options and derivatives risk, and a set of free calculators that run entirely in
the browser.

**Working on this? Read [AGENTS.md](AGENTS.md) first.** It carries the brief,
the copy rules and the conventions that are not recoverable from the code.

## Stack

Vite · TypeScript · React · Tailwind · shadcn-ui · Recharts · MDX.
No backend; static files served from `docs/` by GitHub Pages.

## Commands

- `npm run dev` — local dev server
- `npm run verify` — the quality gate (see below)
- `npm run lint`
- `npm run build` — production build to `dist/` (gitignored)
- `npm run prodBuild` — sitemap, llms.txt, build and prerender into `docs/`

Only `prodBuild` deploys. Nothing is live until `docs/` is rebuilt and committed.

## Checks

`npm run verify` runs every suite below plus a render smoke test — around 295
assertions in total.

| Command | What it pins down |
| --- | --- |
| `verify:options` | Black-Scholes and Black-76 against textbook values, payoff metrics, share-URL round-tripping |
| `verify:hedging` | Delta-hedging a short option: closed-form compounding, break-even at matched volatility against the Monte Carlo standard error, discrete hedging error shrinking with rehedge count |
| `verify:smile` | Implied-vol inversion round-tripping to 1e-7, refusal where a quote carries no vega, recovery of a known smile's level, skew and curvature |
| `verify:retirement` | Real-terms compounding, the 4% rule as a sanity anchor, monotonicity in every lever, wrapper access ages, hostile input |
| `verify:tax` | 2026/27 income tax, NI, corporation and dividend tax |
| `verify:structures` | Employment structures for the take-home comparison |
| `verify:offer` | Compensation archetypes and dilution |
| `verify:render` | Renders every route in Node and asserts on the HTML |

Pre-existing lint and type errors live in unused `src/components/ui/` shadcn
components. Everything outside that directory stays clean.

## Licence

[MIT](https://choosealicense.com/licenses/mit/)

## Contact

anton@batiaev.com
