import type { PensionDeferResponse, PensionDeferComparisonRow } from '../types/pensionDefer'
import { RATE_OPTIONS } from '../types/pensionDefer'

const BASE_MONTHLY = 1_200_000
const TARGET_LIVING_COST = 2_040_000
const DIVIDEND_INCOME = 0
const ANNUAL_BONUS_RATE = 0.072

function calcDuring(base: number, rate: number) {
  return Math.floor((base * (100 - rate)) / 100)
}

function calcAfter(base: number, rate: number, years: number) {
  const immediate = (base * (100 - rate)) / 100
  const deferred = (base * rate) / 100
  return Math.floor(immediate + deferred * (1 + ANNUAL_BONUS_RATE * years))
}

function calcBreakEven(base: number, rate: number, years: number, after: number): number | null {
  if (rate === 0) return null
  const lostTotal = ((base * rate) / 100) * 12 * years
  const gain = after - base
  return gain <= 0 ? null : Math.ceil(lostTotal / gain)
}

function calcCoverage(monthly: number) {
  return Math.floor(((monthly + DIVIDEND_INCOME) / TARGET_LIVING_COST) * 100)
}

function toStability(coverage: number) {
  return coverage >= 70 ? '안정' : '주의'
}

function buildRows(years: number): PensionDeferComparisonRow[] {
  return RATE_OPTIONS.map((rate) => {
    const during = calcDuring(BASE_MONTHLY, rate)
    const after = calcAfter(BASE_MONTHLY, rate, years)
    const breakEven = calcBreakEven(BASE_MONTHLY, rate, years, after)
    const coverageDuring = calcCoverage(during)
    const coverageAfter = calcCoverage(after)
    return {
      deferRate: rate,
      duringDeferMonthly: during,
      afterDeferMonthly: after,
      monthlyIncrease: after - BASE_MONTHLY,
      breakEvenMonths: breakEven,
      coverageRateDuring: coverageDuring,
      coverageRateAfter: coverageAfter,
      stabilityDuring: toStability(coverageDuring),
      stabilityAfter: toStability(coverageAfter),
    }
  })
}

function buildInsight(deferRate: number, rows: PensionDeferComparisonRow[]): string {
  const selected = rows.find((r) => r.deferRate === deferRate)
  if (!selected) return ''
  const stableRates = rows.filter((r) => r.coverageRateDuring >= 70).map((r) => r.deferRate)
  const bestRate = stableRates.length > 0 ? stableRates[stableRates.length - 1] : -1

  let primary: string
  if (deferRate === 0) {
    primary = '현재 국민연금을 즉시 수령합니다.'
  } else if (deferRate === 100) {
    primary = '향후 월 연금은 가장 많이 증가하지만 연기 기간 동안 생활비 공백이 발생합니다.'
  } else if (selected.coverageRateDuring >= 70) {
    primary = '현재 생활비를 일부 확보하면서 향후 월 연금을 늘릴 수 있습니다.'
  } else {
    primary = '연기 기간 동안 생활비 공백이 발생할 수 있습니다.'
  }

  const recommendation =
    bestRate >= 0
      ? ` 현재 생활 안정도 기준으로는 ${bestRate}% 연기안이 가장 적합해 보여요.`
      : ' 즉시 수령을 유지하는 것이 안전해 보여요.'

  return primary + recommendation
}

export function buildMockResponse(deferRate: number, deferYears: number): PensionDeferResponse {
  const rows = buildRows(deferYears)
  const selectedRow = rows.find((r) => r.deferRate === deferRate)
  const immediateRow = rows.find((r) => r.deferRate === 0)
  if (!selectedRow || !immediateRow) throw new Error(`Invalid deferRate: ${deferRate}`)

  return {
    selected: {
      deferRate,
      deferYears,
      basePensionMonthly: BASE_MONTHLY,
      duringDeferMonthly: selectedRow.duringDeferMonthly,
      afterDeferMonthly: selectedRow.afterDeferMonthly,
      monthlyIncrease: selectedRow.monthlyIncrease,
      breakEvenMonths: selectedRow.breakEvenMonths,
      coverageRateBefore: immediateRow.coverageRateAfter,
      coverageRateAfter: selectedRow.coverageRateAfter,
      insight: buildInsight(deferRate, rows),
    },
    comparisonTable: rows,
  }
}
