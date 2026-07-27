/* Checks the UK PAYE model against hand-computed 2026/27 figures. */
import {
  incomeTaxOn,
  nationalInsuranceOn,
  personalAllowanceFor,
  studentLoanOn,
  takeHome,
} from '../src/lib/tax/uk'

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

// --- Personal allowance and its taper ---
check('PA below the taper', personalAllowanceFor(50_000), 12_570)
check('PA at the taper threshold', personalAllowanceFor(100_000), 12_570)
// £10k over the threshold costs £5k of allowance.
check('PA half-tapered', personalAllowanceFor(110_000), 7_570)
check('PA fully tapered', personalAllowanceFor(125_140), 0)
check('PA stays at zero above the limit', personalAllowanceFor(200_000), 0)

// --- Income tax ---
check('no tax at the personal allowance', incomeTaxOn(12_570), 0)
// £37,430 taxable at 20%.
check('basic rate only', incomeTaxOn(50_000), 7_486)
// Full basic band (37,700 @ 20% = 7,540) and nothing higher yet.
check('top of the basic band', incomeTaxOn(50_270), 7_540)
// 7,540 + 10,000 @ 40%.
check('into the higher band', incomeTaxOn(60_270), 11_540)
// Taper zone: taxable = 110,000 - 7,570 = 102,430.
// 37,700 @ 20% = 7,540; 64,730 @ 40% = 25,892.
check('inside the taper (60% effective band)', incomeTaxOn(110_000), 33_432)
// PA is zero, taxable = 125,140. 37,700 @ 20% + 87,440 @ 40%.
check('at the additional-rate threshold', incomeTaxOn(125_140), 42_516)
// Plus 24,860 @ 45%.
check('into the additional rate', incomeTaxOn(150_000), 53_703)

// --- National Insurance ---
check('no NI at the primary threshold', nationalInsuranceOn(12_570), 0)
// 37,430 @ 8%.
check('NI below the UEL', nationalInsuranceOn(50_000), 2_994.4)
// 37,700 @ 8% = 3,016.
check('NI at the UEL', nationalInsuranceOn(50_270), 3_016)
// 3,016 + 49,730 @ 2%.
check('NI above the UEL', nationalInsuranceOn(100_000), 4_010.6)

// --- Student loans ---
check('no loan below the threshold', studentLoanOn(25_000, 'plan2'), 0)
// (50,000 - 29,385) / 12 = 1,717.91 a month; 9% floored to whole pounds = 154.
check('plan 2 repayment', studentLoanOn(50_000, 'plan2'), 154 * 12)
// (50,000 - 21,000) / 12 = 2,416.66; 6% = 145.00, floored to 145.
check('postgraduate repayment', studentLoanOn(50_000, 'pgl'), 145 * 12)

// --- End to end ---
const base = {
  pensionPct: 0,
  pensionMethod: 'relief' as const,
  studentLoan: 'none' as const,
  bonus: 0,
}

const simple = takeHome({ ...base, gross: 50_000 })
check('£50k net', simple.net, 50_000 - 7_486 - 2_994.4)
check('£50k effective rate', simple.effectiveRate, (7_486 + 2_994.4) / 50_000, 0.0001)
check('£50k marginal rate', simple.marginalRate, 0.28, 0.0001)

// The 60% trap: 40% tax plus 20% from the withdrawn allowance, plus 2% NI.
const taper = takeHome({ ...base, gross: 110_000 })
check('taper-zone marginal rate', taper.marginalRate, 0.62, 0.0001)

// Pension is deferred income, not tax, so it must not inflate the marginal
// rate — otherwise a bigger contribution would look like a bigger tax bill.
const noPension = takeHome({ ...base, gross: 85_000 })
const withPension = takeHome({ ...base, gross: 85_000, pensionPct: 5, pensionMethod: 'sacrifice' })
check('marginal rate without pension', noPension.marginalRate, 0.42, 0.0001)
// A 5% sacrifice means only 95p of the next £1 is exposed to 40% + 2%.
check('marginal rate with sacrifice', withPension.marginalRate, 0.95 * 0.42, 0.0001)
assert('pension does not raise the marginal rate', withPension.marginalRate < noPension.marginalRate)
// It does raise the effective rate, because that figure is take-home based.
assert('pension does raise the effective rate', withPension.effectiveRate > noPension.effectiveRate)

// Salary sacrifice saves NI as well as income tax; relief at source does not.
const sacrifice = takeHome({ ...base, gross: 100_000, pensionPct: 10, pensionMethod: 'sacrifice' })
const relief = takeHome({ ...base, gross: 100_000, pensionPct: 10, pensionMethod: 'relief' })
check('both methods contribute the same pension', sacrifice.pension, relief.pension)
check('both methods pay the same income tax', sacrifice.incomeTax, relief.incomeTax)
assert('salary sacrifice pays less NI', sacrifice.nationalInsurance < relief.nationalInsurance)
// The saving is 2% of the sacrificed amount at this income.
check('sacrifice NI saving', relief.nationalInsurance - sacrifice.nationalInsurance, 10_000 * 0.02)
assert('salary sacrifice nets more', sacrifice.net > relief.net)

// A bonus is taxed as earnings, so it lands on top of salary.
const withBonus = takeHome({ ...base, gross: 50_000, bonus: 10_000 })
const asSalary = takeHome({ ...base, gross: 60_000 })
check('bonus is taxed as salary', withBonus.net, asSalary.net)

// ...but pension is contributed on salary only. £5k of bonus must not pull
// another 5% into the pension the way £5k of salary would.
const bonusPension = takeHome({ ...base, gross: 100_000, bonus: 50_000, pensionPct: 5 })
check('pension is a share of salary, not total earnings', bonusPension.pension, 5_000)
const salaryPension = takeHome({ ...base, gross: 150_000, pensionPct: 5 })
check('the same total as salary contributes more', salaryPension.pension, 7_500)
assert(
  'so equity-heavy packages are taxed more, not less',
  bonusPension.incomeTax > salaryPension.incomeTax,
)

// Monotonicity: earning more never leaves you worse off in absolute terms.
let previous = -Infinity
let monotonic = true
for (let gross = 0; gross <= 300_000; gross += 500) {
  const { net } = takeHome({ ...base, gross })
  if (net < previous - 0.01) monotonic = false
  previous = net
}
assert('net pay never falls as gross rises', monotonic)

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} failure(s).`)
process.exit(failures === 0 ? 0 : 1)
