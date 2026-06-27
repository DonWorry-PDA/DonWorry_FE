import type { StabilityStatus } from '../../stability/types/stability'

export type AssetSegment = {
  label: string
  pct: number
}

export type AssetData = {
  totalAmountKrw: number
  changeAmount: number | null
  changeDirection: 'UP' | 'DOWN' | 'FLAT'
  segments: AssetSegment[]
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
