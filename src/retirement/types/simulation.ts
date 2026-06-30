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
  // 현금흐름 구성(월) — 게이지가 왜 그 %인지 설명용
  monthlyIncomeKrw: number
  monthlyInvestmentIncomeKrw: number
  monthlyPensionKrw: number
  monthlyLivingKrw: number
}
