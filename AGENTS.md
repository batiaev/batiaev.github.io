# batiaev.com

Personal site for Anton Batiaev. React + TypeScript + Vite + Tailwind, no
backend, deployed as static files to GitHub Pages.

This file is the brief. Read it before changing copy or adding pages — most of
what follows is judgement that is not recoverable from the code.

---

## What the site is for

It has one job: make a senior operator's depth **checkable** by people who are
deciding whether to hire, back, or partner with him.

The audience is small and high-value — boards, investors, exec recruiters,
founders, integration partners. Perhaps a couple of hundred people a year who
matter. It is not a traffic play, and it is not a consumer marketing site.

Three claims the site exists to substantiate:

1. **Ten years in fintech without skipping a rung** — individual contributor,
   lead, head of division, tribe lead, CTO, VP over a 1,300-person org.
2. **Breadth of company type** — enterprise banks, a hyperscaler, two 0→1
   startups, a platform transformation. Every role card is labelled with which
   it was.
3. **Real depth in one domain** — execution, derivatives pricing and risk. This
   is the narrowing. Options are the through-line, and the working tools are the
   evidence.

Alongside the operator role he builds **Fintecy** (read-only personal finance
aggregation) and **SHIP** (a typed knowledge graph for engineering teams). Both
are registered companies in private beta.

### What "good" looks like here

Working artefacts beat prose. A correct pricing engine, a payoff chart driven by
the same model as the calculator, a simulation whose properties are verified —
these do the persuading. Adjectives do not. When choosing between explaining
something and demonstrating it, demonstrate it.

---

## Hard rules

**Nothing is live until `docs/` is rebuilt.** GitHub Pages serves `docs/`, which
is committed. `npm run prodBuild` regenerates it. `npm run build` only writes
`dist/`, which is gitignored. A change that is not in `docs/` is not deployed.

**Keep the phrase "fintech founder and builder."** It belongs in the hero chip,
`data.json` (`description`, `metaDescription`) and the `index.html` title, OG,
Twitter and JSON-LD blocks. Do not replace it with operator-only framing. Anton
needs the founder framing for client and partner conversations; propose changes
around it rather than making them.

**Never fabricate market data.** No `Math.random()` tickers, no invented price
feeds, no "live" anything. Every number on the site is either computed from a
stated model, supplied by the user, or a cited fact about a real role. Where a
figure is simulated, the page says so in plain words. This is the single biggest
credibility risk on a site whose whole claim is that he built the real systems.

**No investment advice.** Tools are framed as education and analysis. Say
"rich / cheap versus the fitted curve", never "buy" or "sell". Every finance
tool carries an explicit disclaimer. Anton is a VP at an FCA/CySEC-regulated
firm; a public tool that emits trade signals is a materially different object
from a calculator.

**Motion must compute something.** The hero dot-field is the only decoration.
Everything else that moves — a hedging simulation playing out, a scroll reveal —
does so because it is calculating or because the reader has arrived. No rotating
globes, no parallax, no scroll-jacking. Competing with Revolut's design team on
spectacle is a fight lost by entering; motion that is doing arithmetic is a
category where nobody is competing.

**`overflow-x-clip`, never `overflow-x-hidden`, on page wrappers.**
`hidden` computes to `overflow-y: auto`, which makes the wrapper a scroll
container and silently breaks the sticky header. This has been fixed twice.

---

## Voice

- British English. En dashes in ranges (`Feb 2023 – Jun 2025`), never hyphens.
- Plain and specific. No marketing superlatives, no "cutting-edge", no "leverage".
- Concede what is true before claiming what is not obvious. "Explanations of
  this material are not scarce. Knowing which details decide whether it holds up
  is."
- Never defensive. Copy that pre-empts an objection announces the worry. State
  the fact and move on.
- Never a student's posture. "Things I wrote down to check I understood them"
  undersells a decade of building the systems. Depth comes from having run it.
- Code comments explain *why*, especially where a choice looks odd. Several
  non-obvious decisions in this repo are load-bearing and documented in place.

---

## Commands

```
npm run dev          # local dev server
npm run verify       # the quality gate — run before saying anything works
npm run lint
npm run build        # dist/ only, gitignored
npm run prodBuild    # sitemap + llms.txt + build + prerender → docs/  (deploys)
```

`npm run verify` runs seven numeric suites plus a render smoke test (~295
checks). Run it before claiming anything works.

There is a standing baseline of lint and type noise: unused shadcn components
under `src/components/ui/`, plus three long-standing items in
`scripts/prerender.tsx`, `src/components/GoogleTagManager.tsx` and
`tailwind.config.ts`. Do not add to it. New or edited files must be clean, and
`npx tsc -p tsconfig.app.json --noEmit` should report nothing outside
`src/components/ui/`.

---

## Architecture

```
src/
  data/data.json        Nearly all site copy. Edit here, not in components.
  lib/
    options/            blackScholes, strategy, presets, impliedVol, smile, hedging
    retirement/plan.ts  Monte Carlo across ISA / LISA / pension
    tax/uk.ts           2026/27 PAYE, reused by take-home and pension drawdown
    reveal.ts           The one scroll-reveal implementation (was nine)
    routeMeta.ts        Per-route title + description, single source
  learn/
    registry.ts         THE definition of the knowledge base
    content/*.mdx       Prose
scripts/
  verify-*.ts           Numeric properties per library
  smoke-render.tsx      ~70 assertions over rendered HTML
  prerender.tsx         Static HTML per route
```

### The registry pattern

`src/learn/registry.ts` drives the sidebar, routing, prev/next, related pages,
the index cards, prerendering, the sitemap and the search index. A page cannot
appear in the nav and be missing from the build. Add knowledge-base pages there
plus a `ContentPage` mapping — nothing else.

### Adding a tool route

Seven places, and `npm run verify` will catch some but not all:

1. `src/pages/<Name>.tsx`
2. `src/App.tsx` — lazy import + `<Route>`
3. `src/lib/routeMeta.ts` — title and description
4. `scripts/sitemap.ts`
5. `scripts/prerender.tsx` — import, destructure, route entry
6. `scripts/llms-txt.ts` — the `tools` array (hardcoded; easy to forget)
7. `src/data/data.json` — `teaching.tools`, so it appears in the Toolkit grid

Then `npm run sitemap && npm run llms`.

### Numeric work gets a verify script

Every library that computes something has `scripts/verify-<thing>.ts` asserting
*properties*, not snapshots. The pattern that has repeatedly caught real bugs:

- Closed-form anchors — zero-volatility hedging compounds to `exp(rt)` exactly.
- Known-answer inversion — price at a vol, invert, get the vol back to 1e-7.
- Textbook sanity — 25× spending survives 30 years in 87% of paths (the 4% rule).
- Monotonicity — every lever must pull the right way.
- Statistical tolerances, not magic numbers — break-even is tested against the
  Monte Carlo standard error.
- Degenerate and hostile input — NaN from a cleared text box, crossed markets,
  quotes below intrinsic, absurd lifespans.

Write the verification before claiming the maths is right. It has been wrong.

---

## Domain notes that matter

**Options.** One `blackScholes.ts` serves everything, so a strategy page cannot
describe a shape the calculator does not produce. Preset strikes snap to an
exchange-like grid via `roundStrike` — display the snapped strike, not the raw
ratio, or the page contradicts its own chart.

**Implied vol.** `impliedVol` returns `null` rather than guessing when a quote
carries no vega — a deep ITM option prices identically at 8% and 15% vol, so no
volatility is recoverable. That refusal is why smiles are built from
out-of-the-money options, and the tool says so.

**Retirement.** Everything in real terms — one inflation assumption, not two
compounding against each other. Wrappers are modelled separately because their
access ages differ: ISA now, LISA at 60, pension at 57. That is the tool's real
insight — the same £400k retiring at 50 succeeds 47% of the time in an ISA and
5% locked in a pension.

**Charts.** Long-horizon lognormal fans have enormous upper tails. Cap the axis
by the upper-middle of the distribution and let the lucky tail leave the frame —
the question is always the downside. Say so in the caption.

---

## Known state

- `/cv` redirects to Google Drive, and the CV there is **stale** — headed
  "Chief Technology Officer", says "currently CTO at Nevis", omits Capital.com.
  It contradicts the site. Do not link it more prominently until it is updated.
- Testimonials are from Deutsche Bank and Otkritie, both pre-2020. The last six
  years are unvouched; recent ones are coming.
- No photo on the page by choice — the only professional shot is ten years old.
  If `og:image` points at it, that stale photo renders in every link preview,
  which is worse than none.
- Recharts is v3. `Customized` reads internals that changed and will crash;
  `ReferenceLine segment` is the stable way to draw arbitrary marks.

---

## Verifying work

Use the dev server and check the real thing. Two traps in this environment:

- The preview pane often runs with `document.visibilityState === "hidden"`,
  which **pauses CSS animations and stops IntersectionObserver**. An element
  reading `opacity: 1` may be a frozen transition rather than a completed
  reveal. Prefer DOM assertions, and force a real paint (a genuine click) before
  trusting a screenshot.
- The console reader can return a stale buffer across HMR reloads and server
  restarts. Check the module timestamp in the stack before believing an error is
  current; `npm run prerender` executes every page server-side and is a
  trustworthy independent check.
