import type { StabilityStatus } from '../../stability/types/stability'

export type AssetSegment = {
  label: string
  pct: number
}

export type AssetData = {
  totalAmountKrw: number
  segments: AssetSegment[]
  monthlyIncomeKrw: number
}

export type HomeStabilityData = {
  status: StabilityStatus
  percentage: number
  currentIncomeKrw: number
  targetIncomeKrw: number
  shortfallKrw: number | null
}

export type ReportItem = {
  label: string
  value: string
  valueClass?: string
}
