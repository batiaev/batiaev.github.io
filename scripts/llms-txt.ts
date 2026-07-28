/*
 * Writes public/llms.txt, public/llms-full.txt and the search index.
 *
 * llms.txt is a proposed convention (llmstxt.org): a single markdown file at a
 * known path describing what a site contains, so a model reading it does not
 * have to reverse-engineer the structure out of HTML. The `-full` variant
 * inlines the prose so an agent can answer from one fetch.
 *
 * This is deliberate: the goal is to be legible to assistants, not to hide
 * from them. Everything published here is already public.
 */
import fs from 'node:fs'
import path from 'node:path'
import { SECTIONS, STRATEGY_NOTES, learnPath } from '../src/learn/registry'
import { ROUTE_META } from '../src/lib/routeMeta'

const ORIGIN = 'https://batiaev.com'

const contentDir = path.resolve('src/learn/content')

/** MDX source with the JSX and fences taken out, so it reads as prose. */
function proseFor(slug: string): string {
  const file = path.join(contentDir, `${slug.replace(/\//g, '-')}.mdx`)
  if (!fs.existsSync(file)) return ''
  return fs
    .readFileSync(file, 'utf8')
    .replace(/^<[A-Z][^>]*\/>\s*$/gm, '')
    .trim()
}

/** Strategy pages are generated, so their prose lives in the note. */
function strategyProse(slug: string): string {
  const note = STRATEGY_NOTES.find((n) => `strategies/${n.slug}` === slug)
  if (!note) return ''
  return [
    `**The view:** ${note.view}`,
    '',
    '## When it fits',
    '',
    note.whenToUse,
    '',
    '## What goes wrong',
    '',
    ...note.risks.map((risk) => `- ${risk}`),
  ].join('\n')
}

const tools = ['/tools/options-pnl', '/tools/take-home', '/tools/offer']

const summary = `# Anton Batiaev

> Fintech founder and builder. Fintecy (personal finance) and SHIP (a typed
> knowledge graph for engineering teams). VP Product & Engineering at
> Capital.com; previously Revolut, Vega, Nevis and Deutsche Bank. Nine years
> building derivatives pricing, margin and risk systems.

This site hosts a free options knowledge base and a set of finance
calculators. Everything runs client-side; there are no accounts and no
tracking beyond analytics.

## Free tools

${tools
  .map((route) => `- [${ROUTE_META[route].title}](${ORIGIN}${route}): ${ROUTE_META[route].description}`)
  .join('\n')}

## Knowledge base

${SECTIONS.map(
  (section) =>
    `### ${section.title}\n\n${section.blurb}\n\n${section.pages
      .map((page) => `- [${page.title}](${ORIGIN}${learnPath(page.slug)}): ${page.summary}`)
      .join('\n')}`,
).join('\n\n')}

## Optional

- [CV](${ORIGIN}/cv)
- [Advisory](${ORIGIN}/advisory): ${ROUTE_META['/advisory'].description}
`

const full = `${summary}
---

# Full text

The complete prose of the knowledge base follows, so this file can be read in
one fetch. Interactive charts are omitted; each page has a live payoff chart
driven by the same pricing model as the calculator.

${SECTIONS.flatMap((section) =>
  section.pages.map((page) => {
    const body = page.slug.startsWith('strategies/')
      ? strategyProse(page.slug)
      : proseFor(page.slug)
    return [
      `## ${page.title}`,
      '',
      `Source: ${ORIGIN}${learnPath(page.slug)}`,
      `Topics: ${page.tags.join(', ')}`,
      '',
      page.summary,
      '',
      body,
    ].join('\n')
  }),
).join('\n\n---\n\n')}
`

/**
 * The knowledge-base search index.
 *
 * Generated here rather than globbed with `?raw` in the client: the MDX plugin
 * runs pre-enforced and claims .mdx before Vite's raw loader, so a raw import
 * hands back a compiled component. Writing it at build time from the same
 * source these files already read removes that fragility, and a test fails if
 * the index drifts from the registry.
 */
const searchIndex = SECTIONS.flatMap((section) =>
  section.pages.map((page) => ({
    slug: page.slug,
    body: (page.slug.startsWith('strategies/')
      ? strategyProse(page.slug)
      : proseFor(page.slug)
    )
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[#*_>|`-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  })),
)

fs.writeFileSync(
  path.resolve('src/learn/search-index.json'),
  `${JSON.stringify(searchIndex, null, 2)}\n`,
)

fs.writeFileSync(path.resolve('public/llms.txt'), summary)
fs.writeFileSync(path.resolve('public/llms-full.txt'), full)

console.log(
  `Wrote llms.txt (${(summary.length / 1024).toFixed(1)} kB), ` +
    `llms-full.txt (${(full.length / 1024).toFixed(1)} kB) and ` +
    `search-index.json (${searchIndex.length} pages)`,
)
