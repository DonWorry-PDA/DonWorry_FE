import { useMemo } from 'react'
import type { SimParams, SimResult, SimStatus } from '../types/simulation'

export function computeSimulation(
  params: SimParams,
  returnRatePct: number,
  inflationRatePct: number,
): SimResult {
  if (params.monthlyLivingKrw <= 0) {
    return {
      coverageRatePct: 0,
      monthlyShortfallKrw: 0,
      coverableMonths: 0,
      status: 'danger',
      monthlyIncomeKrw: 0,
      monthlyInvestmentIncomeKrw: 0,
      monthlyPensionKrw: params.monthlyPensionKrw,
      monthlyLivingKrw: params.monthlyLivingKrw,
    }
  }

  const monthlyReturn = returnRatePct / 100 / 12
  const monthlyInflation = inflationRatePct / 100 / 12

  const monthlyInvestmentIncome = params.totalAssetsKrw * monthlyReturn
  const totalMonthlyIncome = params.monthlyPensionKrw + monthlyInvestmentIncome
  const coverageRatePct = Math.round((totalMonthlyIncome / params.monthlyLivingKrw) * 100)
  const monthlyShortfallKrw = Math.round(
    Math.max(0, params.monthlyLivingKrw - totalMonthlyIncome),
  )

  let coverableMonths = 0
  // monthlyInflation > 0이면 초기에 충당 가능해도 미래에 생활비가 연금을 초과할 수 있으므로 항상 실행
  if (monthlyShortfallKrw > 0 || monthlyInflation > 0) {
    let assets = params.totalAssetsKrw
    let depleted = false
    for (let month = 0; month < 1200; month++) {
      const inflationFactor = Math.pow(1 + monthlyInflation, month)
      const draw = Math.max(0, params.monthlyLivingKrw * inflationFactor - params.monthlyPensionKrw)
      assets = assets * (1 + monthlyReturn) - draw
      if (assets < 0) {
        coverableMonths = month
        depleted = true
        break
      }
    }
    if (!depleted) {
      coverableMonths = 1200
    }
  }

  const status: SimStatus =
    coverageRatePct >= 80 ? 'stable' : coverageRatePct >= 50 ? 'warning' : 'danger'

  return {
    coverageRatePct,
    monthlyShortfallKrw,
    coverableMonths,
    status,
    monthlyIncomeKrw: Math.round(totalMonthlyIncome),
    monthlyInvestmentIncomeKrw: Math.round(monthlyInvestmentIncome),
    monthlyPensionKrw: params.monthlyPensionKrw,
    monthlyLivingKrw: params.monthlyLivingKrw,
  }
}

function useSimulation(
  params: SimParams,
  returnRatePct: number,
  inflationRatePct: number,
): SimResult {
  return useMemo(
    () => computeSimulation(params, returnRatePct, inflationRatePct),
    [params, returnRatePct, inflationRatePct],
  )
}

export default useSimulation
