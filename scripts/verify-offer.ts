/* Checks the compensation-archetype model. */
import {
  ARCHETYPES,
  dilutedPct,
  equityInScenario,
  equityValueAtExit,
  offerFromArchetype,
  vestedFraction,
  type Offer,
} from '../src/lib/offer/archetypes'
import { DEFAULT_ASSUMPTIONS, evaluate } from '../src/lib/offer/compare'

let failures = 0

function check(label: string, got: number, want: number, tolerance = 0.01) {
  const ok = Math.abs(got - want) <= tolerance
  if (!ok) failures += 1
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}: got ${got.toFixed(2)}, want ${want.toFixed(2)}`)
}

function assert(label: string, ok: boolean) {
  if (!ok) failures += 1
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`)
}

const startup = offerFromArchetype(ARCHETYPES[0], 'a')
const hyper = offerFromArchetype(ARCHETYPES[1], 'b')
const enterprise = offerFromArchetype(ARCHETYPES[2], 'c')

// --- Dilution ---
// 0.75% through three 20% rounds: 0.75 × 0.8³.
check('dilution compounds across rounds', dilutedPct(startup), 0.75 * 0.8 ** 3)
assert('dilution always reduces ownership', dilutedPct(startup) < startup.grantPct)
check('no rounds means no dilution', dilutedPct({ ...startup, rounds: 0 }), 0.75)

// --- Equity value ---
// Options pay the spread only: exit share less the strike cost. Derived from
// the offer so tuning a preset cannot silently invalidate the check.
const share = dilutedPct(startup) / 100
const strikeCost = startup.valuationNow * startup.strikeDiscount * (startup.grantPct / 100)
check(
  'options pay the spread over strike',
  equityValueAtExit(startup),
  startup.exitValuation * share - strikeCost,
)
// The same grant as RSUs is worth more, because there is nothing to pay for.
assert(
  'RSUs are worth more than options on the same grant',
  equityValueAtExit({ ...startup, equityKind: 'rsu' }) > equityValueAtExit(startup),
)
// Underwater options are worth nothing, not a negative number.
check(
  'underwater options are worth zero',
  equityValueAtExit({ ...startup, exitValuation: 1_000_000 }),
  0,
)
check('no equity means no value', equityValueAtExit(enterprise), 0)

// --- Vesting ---
check('nothing vests before the cliff', vestedFraction(startup, 0.5), 0)
check('a quarter vests at the cliff', vestedFraction(startup, 1), 0.25)
check('vesting caps at the full grant', vestedFraction(startup, 10), 1)

// --- Scenarios ---
check('the downside is always zero equity', equityInScenario(startup, 'downside'), 0)
assert(
  'the expected case is the upside times the odds',
  Math.abs(
    equityInScenario(startup, 'expected') -
      equityInScenario(startup, 'upside') * (startup.exitProbability / 100),
  ) < 0.01,
)
assert(
  'a longer shot is worth less in expectation',
  equityInScenario({ ...startup, exitProbability: 5 }, 'expected') <
    equityInScenario(startup, 'expected'),
)

// --- The comparison the tool exists to make ---
const results = [startup, hyper, enterprise].map((o) => evaluate(o, DEFAULT_ASSUMPTIONS))
const [s, h, e] = results

results.forEach((r) => {
  console.log(
    `      ${r.offer.label.padEnd(12)} down ${(r.downside.totalNet / 1000).toFixed(0).padStart(4)}k  ` +
      `exp ${(r.expected.totalNet / 1000).toFixed(0).padStart(4)}k  ` +
      `up ${(r.upside.totalNet / 1000).toFixed(0).padStart(5)}k`,
  )
})

// Enterprise has no equity, so every scenario is identical — that *is* the
// product being sold, and it should fall out of the model rather than be
// special-cased.
check('enterprise downside equals its upside', e.downside.totalNet, e.upside.totalNet)
assert('enterprise wins the downside', e.downside.totalNet > s.downside.totalNet)
assert('enterprise beats the startup downside on cash alone', e.downside.totalNet > h.downside.totalNet)

// The startup only makes sense on the upside — that is the whole bet.
assert('the startup wins the upside', s.upside.totalNet > e.upside.totalNet)
assert('and wins it against hypergrowth too', s.upside.totalNet > h.upside.totalNet)
assert('the startup loses on cash', s.downside.totalNet < h.downside.totalNet)

// Ordering within an offer must hold by construction.
results.forEach((r) => {
  assert(
    `${r.offer.label}: downside ≤ expected ≤ upside`,
    r.downside.totalNet <= r.expected.totalNet + 0.01 &&
      r.expected.totalNet <= r.upside.totalNet + 0.01,
  )
})

// Equity is taxed, so the net gain must be materially below the gross grant.
assert('equity is taxed, not banked whole', s.upside.equityNet < s.headlineEquity)
assert('but it is still most of the startup upside', s.upside.equityNet > s.upside.totalCashNet)

// An exit beyond the horizon simply never lands.
const late = evaluate({ ...startup, yearsToExit: 20 } as Offer, DEFAULT_ASSUMPTIONS)
check('an exit past the horizon pays nothing', late.upside.equityNet, 0)

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} failure(s).`)
process.exit(failures === 0 ? 0 : 1)
