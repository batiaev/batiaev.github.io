/* Renders the routes once in Node to catch crashes the type-checker cannot see. */
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import data from '../src/data/data.json'

const store = new Map<string, string>()

Object.assign(globalThis, {
  window: {
    location: {
      search: '',
      origin: 'https://batiaev.com',
      pathname: '/tools/options-pnl',
    },
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => void store.set(key, value),
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

async function render(name: string, path: string) {
  const [
    { default: Index },
    { default: Advisory },
    { default: Tools },
    { default: OptionsPnl },
    { default: TakeHome },
    { default: OfferCalculator },
  ] = await Promise.all([
    import('../src/pages/Index'),
    import('../src/pages/Advisory'),
    import('../src/pages/Tools'),
    import('../src/pages/OptionsPnl'),
    import('../src/pages/TakeHome'),
    import('../src/pages/OfferCalculator'),
  ])

  const Page = {
    '/': Index,
    '/advisory': Advisory,
    '/tools': Tools,
    '/tools/options-pnl': OptionsPnl,
    '/tools/take-home': TakeHome,
    '/tools/offer': OfferCalculator,
  }[path]!

  const html = renderToStaticMarkup(
    <MemoryRouter initialEntries={[path]}>
      <Page />
    </MemoryRouter>,
  )

  console.log(`PASS  ${name} rendered (${html.length} chars)`)
  return html
}

const originalError = console.error
let errorCount = 0

// Expected noise: this app is client-only, so anything the server renderer
// cannot express is not a real defect. Recharts measures its container, which
// has no size in Node, so its charts render empty rather than wrong.
const IGNORED = ['useLayoutEffect', 'Suspense', 'suspended', 'should be greater than 0']

const isIgnored = (args: unknown[]) => {
  const message = String(args[0] ?? '')
  return IGNORED.some((pattern) => message.includes(pattern))
}

console.error = (...args: unknown[]) => {
  if (isIgnored(args)) return
  errorCount += 1
  originalError(...args)
}

console.warn = (...args: unknown[]) => {
  if (isIgnored(args)) return
  originalError(...args)
}

const optionsHtml = await render('Options P&L', '/tools/options-pnl')
const homeHtml = await render('Home', '/')
await render('Advisory', '/advisory')
const toolsHtml = await render('Tools index', '/tools')
const takeHomeHtml = await render('Take-home', '/tools/take-home')
const offerHtml = await render('Offer comparison', '/tools/offer')

// The charts are lazy, so the route renders above only reach their fallbacks.
const [
  { default: ScopeChart },
  { default: PayoffChart },
  { scopeRows },
  strategy,
  presets,
] = await Promise.all([
  import('../src/components/ScopeChart'),
  import('../src/components/options/PayoffChart'),
  import('../src/lib/scopeRows'),
  import('../src/lib/options/strategy'),
  import('../src/lib/options/presets'),
])

const scopeHtml = renderToStaticMarkup(<ScopeChart />)
console.log(`PASS  ScopeChart rendered (${scopeHtml.length} chars)`)

const position = presets.defaultPosition()
const payoffHtml = renderToStaticMarkup(
  <PayoffChart
    curve={strategy.payoffCurve(position)}
    position={position}
    metrics={strategy.metrics(position)}
    hiddenKeys={[]}
    onToggleKey={() => {}}
  />,
)
console.log(`PASS  PayoffChart rendered (${payoffHtml.length} chars)`)

/** Names like "Options P&L calculator" arrive escaped in the rendered markup. */
const escapeHtml = (value: string) => value.replace(/&/g, '&amp;')

const expectations: [string, boolean][] = [
  ['metrics tile rendered', optionsHtml.includes('Max profit')],
  ['breakeven computed', optionsHtml.includes('Breakeven')],
  // Legs render collapsed, so the summary and quick-add row are what's on screen;
  // the per-field editor (Premium, Days…) only mounts once a row is expanded.
  ['legs collapse to a summary', optionsHtml.includes('call · 30d ·')],
  ['quick-add row rendered', optionsHtml.includes('Short underlying')],
  ['market assumptions behind the cog', optionsHtml.includes('IV 25%')],
  ['presets rendered', optionsHtml.includes('Iron condor')],
  ['fintecy funnel line', optionsHtml.includes('fintecy.co')],
  ['scope chart caption rendered', scopeHtml.includes('Direct reports')],
  ['scope rows newest first', scopeRows[0].role.startsWith('Capital.com')],
  [
    'scope rows include the IC step at zero reports',
    scopeRows.some((row) => row.year === 2016 && row.engineers === 0),
  ],
  [
    'scope rows include the 10-report step',
    scopeRows.some((row) => row.year === 2018 && row.engineers === 10),
  ],
  ['every scope row carries a scale note', scopeRows.every((row) => row.note.length > 0)],
  [
    'scope rows descend, so the trend reads cleanly',
    scopeRows.every((row, i) => i === 0 || row.engineers < scopeRows[i - 1].engineers),
  ],
  ['hero falls back to a wordmark when a logo is missing', homeHtml.includes('>Nevis<')],
  ['hero renders the Vega mark', homeHtml.includes('/images/logo-vega.png')],
  [
    'hero separates the current role from past ones',
    homeHtml.includes('Now') &&
      homeHtml.includes('Previously') &&
      homeHtml.includes('/images/logo-capital.png'),
  ],
  ['hero logos link to their role anchors', homeHtml.includes('href="#role-revolut"')],
  ['experience cards expose those anchors', homeHtml.includes('id="role-revolut"')],
  ['Nevis role rendered', homeHtml.includes('id="role-nevis"')],
  // Vega's AUM is sourced from vega-alts.com; $500B+ is an older, unsupported
  // figure that still appears on the CV. Keep the site on the citable number.
  ['Vega AUM matches the public figure', homeHtml.includes('$300B+')],
  ['no unsourced Vega AUM claim', !homeHtml.includes('$500B')],
  [
    'Vega raise and valuation are distinguished',
    homeHtml.includes('valuation $10M → $90M'),
  ],
  // Year-level periods keep the four-month Nevis stint and the Revolut/Vega
  // handover from drawing the eye for the wrong reason.
  ['periods are year-level', !/\b(Jan|Feb|Jun|Sep|Nov)\s20\d\d/.test(homeHtml)],
  ['education block rendered', homeHtml.includes('City Business School')],
  ['teaching record rendered', homeHtml.includes('GeekBrains')],
  ['options vocabulary present', homeHtml.includes('SPAN')],

  // --- Tools ---
  ['tools index lists every tool', data.teaching.tools.every((t) => toolsHtml.includes(escapeHtml(t.name)))],
  ['home surfaces every tool too', data.teaching.tools.every((t) => homeHtml.includes(escapeHtml(t.name)))],
  ['take-home states the tax year', takeHomeHtml.includes('2026/27')],
  ['take-home is explicit about Scotland', takeHomeHtml.includes('Scotland is not covered')],
  ['offer page compares two offers', offerHtml.includes('Offer A') && offerHtml.includes('Offer B')],
  [
    'offer page flags the illiquidity caveat',
    offerHtml.includes('illiquid') || offerHtml.includes('never becomes liquid'),
  ],
  [
    'product cards use their own logos',
    homeHtml.includes('/images/logo-fintecy.png') &&
      homeHtml.includes('/images/logo-ship.png'),
  ],
]

expectations.forEach(([label, ok]) => {
  if (!ok) errorCount += 1
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`)
})

console.log(errorCount === 0 ? '\nSmoke render clean.' : `\n${errorCount} problem(s).`)
process.exit(errorCount === 0 ? 0 : 1)
