/* Checks the employment-structure models against hand-computed 2026/27 figures. */
import {
  class4On,
  corporationTaxOn,
  dividendTaxOn,
  employerNiOn,
} from '../src/lib/tax/uk'
import {
  DEFAULT_INPUT,
  compareStructures,
  evaluateStructure,
  optimalDirectorSalary,
  type StructureInput,
} from '../src/lib/tax/structures'

let failures = 0

function check(label: string, got: number, want: number, tolerance = 0.01) {
  const ok = Math.abs(got - want) <= tolerance
  if (!ok) failures += 1
  console.log(
    `${ok ? 'PASS' : 'FAIL'}  ${label}: got ${got.toFixed(2)}, want ${want.toFixed(2)}`,
  )
}

function assert(label: string, ok: boolean) {
  if (!ok) failures += 1
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`)
}

// --- Corporation tax and its marginal relief ---
check('CT at the small profits rate', corporationTaxOn(50_000), 9_500)
check('CT at the main rate', corporationTaxOn(250_000), 62_500)
check('CT at the main rate, above the limit', corporationTaxOn(400_000), 100_000)
// 25% of 100,000 less 3/200 × 150,000.
check('CT inside marginal relief', corporationTaxOn(100_000), 25_000 - 2_250)
// The relief makes the slice between the limits cost 26.5%, not 25%.
check(
  'CT marginal rate between the limits',
  corporationTaxOn(100_001) - corporationTaxOn(100_000),
  0.265,
  0.0001,
)
check('no CT on a loss', corporationTaxOn(-10_000), 0)

// --- Employer NI ---
check('no employer NI at the secondary threshold', employerNiOn(5_000), 0)
check('employer NI above it', employerNiOn(50_000), 45_000 * 0.15)
// 95,000 × 15% = 14,250, less the 10,500 allowance.
check('employment allowance offsets it', employerNiOn(100_000, 10_500), 3_750)
check('employment allowance cannot make NI negative', employerNiOn(50_000, 10_500), 0)

// --- Class 4 ---
check('no Class 4 at the lower limit', class4On(12_570), 0)
check('Class 4 in the main band', class4On(50_270), 37_700 * 0.06)
check('Class 4 above the upper limit', class4On(100_000), 37_700 * 0.06 + 49_730 * 0.02)
// Self-employment is cheaper than employment on NI: 6% versus 8%.
assert('Class 4 is lighter than Class 1', class4On(50_000) < 50_000 * 0.08)

// --- Dividend tax ---
check('dividend allowance is free', dividendTaxOn(500, 50_000), 0)
// Salary uses the whole personal allowance and most of the basic band.
// Taxable other income = 50,000 − 12,570 = 37,430; 270 of basic band is left.
// Of 10,000 dividends: 500 free (consumes band, leaving 0 at basic after 270
// is eaten by the allowance), so 9,500 falls into higher rate... check exactly:
// position after allowance = 37,430 + 500 = 37,930, already past 37,700.
check('dividends stack on top of salary', dividendTaxOn(10_000, 50_000), 9_500 * 0.3575)
// With no other income the personal allowance covers the first 12,570.
check('unused personal allowance covers dividends', dividendTaxOn(12_570, 0), 0)
check(
  'then the allowance, then basic rate',
  dividendTaxOn(20_000, 0),
  (20_000 - 12_570 - 500) * 0.1075,
)

// --- Structures, compared on the same money ---
const input: StructureInput = { ...DEFAULT_INPUT, income: 120_000 }
const results = compareStructures(input)
const by = Object.fromEntries(results.map((r) => [r.structure, r]))

results.forEach((r) => {
  console.log(
    `      ${r.structure.padEnd(11)} net ${r.net.toFixed(0).padStart(7)}  ` +
      `effective ${(r.effectiveRate * 100).toFixed(1)}%`,
  )
})

assert('every structure nets less than it earns', results.every((r) => r.net < r.income))
assert('every structure nets something', results.every((r) => r.net > 0))

// The wrapper is the whole story: a company keeps materially more of the same
// money than an umbrella, because the umbrella pays employer NI out of the rate.
assert('limited beats umbrella on the same rate', by.limited.net > by.umbrella.net)
assert('umbrella is the most expensive wrapper', by.umbrella.net < by.soleTrader.net)
// An employee is not charged employer NI at all — it sits on top of salary —
// so £120k of salary beats £120k of assignment rate through an umbrella.
assert('salary beats the same number as a day rate', by.employee.net > by.umbrella.net)
check('an employee bears no employer NI', by.employee.employerNi, 0)
check('an umbrella bears employer NI', by.umbrella.employerNi > 0 ? 1 : 0, 1)

// The umbrella arithmetic must reconcile exactly.
check(
  'umbrella rate covers salary, employer NI and margin',
  by.umbrella.salary + by.umbrella.employerNi + by.umbrella.umbrellaMargin,
  120_000,
)

// The company's money must all be accounted for.
check(
  'company income reconciles',
  by.limited.salary +
    by.limited.employerNi +
    by.limited.pension +
    by.limited.corporationTax +
    by.limited.dividends,
  120_000,
)

// --- Director salary optimisation ---
const optimal = optimalDirectorSalary(input)
console.log(`      optimal director salary: £${optimal.toLocaleString()}`)
const atOptimal = evaluateStructure('limited', { ...input, directorSalary: optimal })
const atZero = evaluateStructure('limited', { ...input, directorSalary: 0 })
assert('paying some salary beats paying none', atOptimal.netIncludingPension > atZero.netIncludingPension)
assert('the optimum is a real salary, not the cap', optimal > 0 && optimal < 60_000)

// --- Side hustle: extra income stacks on a day job, so it is taxed at the top ---
const soloTrade = evaluateStructure('soleTrader', { ...DEFAULT_INPUT, income: 20_000, otherPaye: 0 })
const sideTrade = evaluateStructure('soleTrader', {
  ...DEFAULT_INPUT,
  income: 20_000,
  otherPaye: 80_000,
})
assert('a side hustle is taxed harder than the same trade alone', sideTrade.net < soloTrade.net)
check(
  'the side hustle loses its personal allowance',
  sideTrade.incomeTax,
  // All 20,000 sits in the higher band on top of an 80,000 salary.
  20_000 * 0.4,
)

// --- Who wins, and why ---
// Compare on everything still owned — cash, pension and undrawn profit —
// otherwise retaining looks like a loss simply because it is not in the bank.
const winnerAt = (income: number, over: StructureInput = DEFAULT_INPUT) =>
  compareStructures({ ...over, income }).reduce((a, b) =>
    b.netIncludingPension > a.netIncludingPension ? b : a,
  ).structure

const winners = [40_000, 80_000, 120_000, 200_000, 400_000].map((i) => winnerAt(i))
console.log(`      winners by income (full distribution): ${winners.join(', ')}`)

// Class 4 is 6% where Class 1 is 8%, and income tax is identical, so a sole
// trader always keeps more of the same money than an employee. That is real,
// not a modelling artefact — it is the NI difference, nothing else.
assert(
  'sole trader always beats employee on identical income',
  [40_000, 80_000, 120_000, 200_000, 400_000].every((income) => {
    const r = compareStructures({ ...DEFAULT_INPUT, income })
    const by = Object.fromEntries(r.map((x) => [x.structure, x]))
    return by.soleTrader.net > by.employee.net
  }),
)
check(
  'and the gap is exactly the Class 4 saving',
  compareStructures({ ...DEFAULT_INPUT, income: 40_000 }).find((r) => r.structure === 'soleTrader')!
    .net -
    compareStructures({ ...DEFAULT_INPUT, income: 40_000 }).find((r) => r.structure === 'employee')!
      .net,
  (40_000 - 12_570) * 0.02,
)

// With 2026/27 rates, distributing everything makes incorporation lose: 26.5%
// marginal corporation tax plus 35.75% dividend tax beats 40% + 2% PAYE. The
// classic contractor advantage now depends on *not* drawing the profit.
assert(
  'distributing everything, the company does not win',
  winnerAt(120_000) !== 'limited',
)
const retaining = { ...DEFAULT_INPUT, distributePct: 0 }
assert(
  'retaining profit flips the answer',
  winnerAt(120_000, retaining) === 'limited',
)
const drawnAll = evaluateStructure('limited', { ...DEFAULT_INPUT, income: 120_000 })
const drawnNone = evaluateStructure('limited', { ...retaining, income: 120_000 })
check('retaining pays no dividend tax', drawnNone.dividendTax, 0)
assert('retained profit is still counted as yours', drawnNone.retained > 0)
assert(
  'so retaining keeps more overall',
  drawnNone.netIncludingPension > drawnAll.netIncludingPension,
)

// --- Monotonicity across the range ---
let monotonic = true
for (const structure of ['employee', 'soleTrader', 'limited', 'umbrella'] as const) {
  let previous = -Infinity
  for (let income = 0; income <= 300_000; income += 1_000) {
    const { net } = evaluateStructure(structure, { ...DEFAULT_INPUT, income })
    if (net < previous - 0.01) monotonic = false
    previous = net
  }
}
assert('net never falls as income rises, in any structure', monotonic)

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} failure(s).`)
process.exit(failures === 0 ? 0 : 1)
