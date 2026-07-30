/*
 * Bakes static HTML into dist/ for every route.
 *
 * The app stays a client-rendered SPA — this only fills the #root div and the
 * <head> so crawlers, link unfurlers and text-only clients get real content on
 * first byte instead of an empty shell. React hydrates over it on load.
 */
import fs from 'node:fs'
import path from 'node:path'
import React from 'react'
import { renderToString } from 'react-dom/server'
// react-router v7 dropped the `/server` subpath; MemoryRouter pinned to a
// single entry renders identically for a one-shot static pass.
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const DIST = path.resolve('dist')

// Enough of the DOM for module-scope browser code to import cleanly under Node.
const store = new Map<string, string>()
Object.assign(globalThis, {
  window: {
    location: { search: '', origin: 'https://batiaev.com', pathname: '/' },
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => void store.set(key, value),
      removeItem: (key: string) => void store.delete(key),
    },
    matchMedia: () => ({ matches: false }),
    addEventListener: () => {},
    removeEventListener: () => {},
    history: { replaceState: () => {} },
    scrollTo: () => {},
    innerWidth: 1280,
    devicePixelRatio: 1,
  },
})

// Recharts measures a container that has no size in Node, and lazy boundaries
// only reach their fallback. Neither is a defect worth failing the build over.
const IGNORED = ['useLayoutEffect', 'Suspense', 'suspended', 'should be greater than 0']
const originalError = console.error
let unexpectedErrors = 0
console.error = (...args: unknown[]) => {
  if (IGNORED.some((p) => String(args[0] ?? '').includes(p))) return
  unexpectedErrors += 1
  originalError(...args)
}

const [
  { default: Index },
  { default: Advisory },
  { default: Tools },
  { default: OptionsPnl },
  { default: TakeHome },
  { default: OfferCalculator },
  { default: Hedging },
  { default: Smile },
  { default: Retirement },
  { default: LearnIndex },
  { default: LearnRoute },
  { ROUTE_META },
  { ALL_PAGES, learnPath, pageBySlug },
  { structuredDataFor },
] = await Promise.all([
  import('../src/pages/Index'),
  import('../src/pages/Advisory'),
  import('../src/pages/Tools'),
  import('../src/pages/OptionsPnl'),
  import('../src/pages/TakeHome'),
  import('../src/pages/OfferCalculator'),
  import('../src/pages/Hedging'),
  import('../src/pages/Smile'),
  import('../src/pages/Retirement'),
  import('../src/pages/learn/LearnIndex'),
  import('../src/pages/learn/LearnRoute'),
  import('../src/lib/routeMeta'),
  import('../src/learn/registry'),
  import('../src/lib/structuredData'),
])

/**
 * Route → component and the file it is written to, mirroring Pages' directory
 * serving. `pattern` matters for routes that read their own params: rendering
 * the component bare leaves useParams empty, so those must go through Routes.
 */
const ROUTES: {
  route: string
  file: string
  Page: React.ComponentType
  pattern?: string
}[] = [
  { route: '/', file: 'index.html', Page: Index },
  { route: '/advisory', file: 'advisory/index.html', Page: Advisory },
  { route: '/tools', file: 'tools/index.html', Page: Tools },
  { route: '/tools/options-pnl', file: 'tools/options-pnl/index.html', Page: OptionsPnl },
  { route: '/tools/take-home', file: 'tools/take-home/index.html', Page: TakeHome },
  { route: '/tools/offer', file: 'tools/offer/index.html', Page: OfferCalculator },
  { route: '/tools/hedging', file: 'tools/hedging/index.html', Page: Hedging },
  { route: '/tools/smile', file: 'tools/smile/index.html', Page: Smile },
  { route: '/tools/retirement', file: 'tools/retirement/index.html', Page: Retirement },
  { route: '/learn', file: 'learn/index.html', Page: LearnIndex },
  // Every knowledge-base page comes from the registry, so a page that exists
  // in the sidebar is always built and always in the sitemap.
  ...ALL_PAGES.map((page) => ({
    route: learnPath(page.slug),
    file: `learn/${page.slug}/index.html`,
    Page: LearnRoute,
    pattern: '/learn/*',
  })),
]

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
if (!template.includes('<div id="root"></div>')) {
  throw new Error(
    'dist/index.html has no empty #root to fill. Run `npm run build` first — ' +
      'prerendering twice over its own output would nest the markup.',
  )
}

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

/**
 * `useDocumentMeta` sets the title and description at runtime, which a crawler
 * that does not execute JavaScript never sees — so rewrite the static head to
 * match. Both read the same ROUTE_META, so they cannot disagree.
 */
function applyMeta(html: string, route: string): string {
  const learn = route.startsWith('/learn/')
    ? pageBySlug(route.replace('/learn/', ''))
    : undefined
  const meta = learn
    ? { title: `${learn.title} — Learn | Anton Batiaev`, description: learn.summary }
    : ROUTE_META[route]
  if (!meta) return html

  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(meta.title)}</title>`)
    .replace(
      /(<meta\s+name="description"\s+content=")[\s\S]*?(")/,
      `$1${escapeAttr(meta.description)}$2`,
    )
    .replace(
      /(<meta\s+property="og:title"\s+content=")[\s\S]*?(")/,
      `$1${escapeAttr(meta.title)}$2`,
    )
    .replace(
      /(<meta\s+property="og:url"\s+content=")[\s\S]*?(")/,
      `$1${canonicalFor(route)}$2`,
    )
    // The template hard-codes the home page canonical; every other route was
    // inheriting it, telling crawlers the whole site was one page.
    .replace(
      /(<link\s+rel="canonical"\s+href=")[\s\S]*?(")/,
      `$1${canonicalFor(route)}$2`,
    )
    .replace('</head>', `${structuredData(route)}</head>`)
}

const canonicalFor = (route: string) =>
  `https://batiaev.com${route === '/' ? '/' : route}`

/**
 * Route-specific schema.org blocks, appended to the head so a crawler that
 * runs no JavaScript still gets them.
 */
function structuredData(route: string): string {
  const blocks = structuredDataFor(route)
  if (blocks.length === 0) return ''
  return blocks
    .map(
      (block) =>
        `    <script type="application/ld+json">${JSON.stringify(block)}</script>\n`,
    )
    .join('')
}

for (const { route, file, Page, pattern } of ROUTES) {
  const markup = renderToString(
    <MemoryRouter initialEntries={[route]}>
      {pattern ? (
        <Routes>
          <Route path={pattern} element={<Page />} />
        </Routes>
      ) : (
        <Page />
      )}
    </MemoryRouter>,
  )

  const html = applyMeta(
    template.replace('<div id="root"></div>', `<div id="root">${markup}</div>`),
    route,
  )

  const target = path.join(DIST, file)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, html)
  console.log(`  ${route.padEnd(20)} → ${file.padEnd(32)} ${(markup.length / 1024).toFixed(1)} kB`)
}

// GitHub Pages serves this for unknown paths. Keep it as the bare shell so a
// 404 never shows another page's prerendered content.
fs.writeFileSync(path.join(DIST, '404.html'), template)

if (unexpectedErrors > 0) {
  console.error(`\n${unexpectedErrors} unexpected render error(s).`)
  process.exit(1)
}

console.log(`\nPrerendered ${ROUTES.length} routes.`)
