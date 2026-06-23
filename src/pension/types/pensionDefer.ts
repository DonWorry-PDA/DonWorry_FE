export type PensionDeferDetail = {
  deferRate: number
  deferYears: number
  basePensionMonthly: number
  duringDeferMonthly: number
  afterDeferMonthly: number
  monthlyIncrease: number
  breakEvenMonths: number | null
  coverageRateBefore: number
  coverageRateAfter: number
  insight: string
}

export type PensionDeferComparisonRow = {
  deferRate: number
  duringDeferMonthly: number
  afterDeferMonthly: number
  monthlyIncrease: number
  breakEvenMonths: number | null
  coverageRateDuring: number
  coverageRateAfter: number
  stabilityDuring: string
  stabilityAfter: string
}

export type PensionDeferResponse = {
  selected: PensionDeferDetail
  comparisonTable: PensionDeferComparisonRow[]
}

export const RATE_OPTIONS = [0, 50, 60, 70, 80, 90, 100] as const
export const YEAR_OPTIONS = [1, 2, 3, 4, 5] as const
