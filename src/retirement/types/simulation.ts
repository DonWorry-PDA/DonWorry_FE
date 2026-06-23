// src/retirement/types/simulation.ts

export interface SimParams {
  ageYears: number
  totalAssetsKrw: number
  monthlyLivingKrw: number
  monthlyPensionKrw: number
}

export type SimStatus = 'stable' | 'warning' | 'danger'

export interface SimResult {
  coverageRatePct: number
  monthlyShortfallKrw: number
  coverableMonths: number
  status: SimStatus
}
