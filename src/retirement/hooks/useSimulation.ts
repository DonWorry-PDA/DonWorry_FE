import { useMemo } from 'react'
import type { SimParams, SimResult, SimStatus } from '../types/simulation'

export function computeSimulation(
  params: SimParams,
  returnRatePct: number,
  inflationRatePct: number,
): SimResult {
  const monthlyReturn = returnRatePct / 100 / 12
  const monthlyInflation = inflationRatePct / 100 / 12

  const monthlyInvestmentIncome = params.totalAssetsKrw * monthlyReturn
  const totalMonthlyIncome = params.monthlyPensionKrw + monthlyInvestmentIncome
  const coverageRatePct = Math.round((totalMonthlyIncome / params.monthlyLivingKrw) * 100)
  const monthlyShortfallKrw = Math.round(
    Math.max(0, params.monthlyLivingKrw - totalMonthlyIncome),
  )

  let coverableMonths = 0
  if (monthlyShortfallKrw > 0) {
    let assets = params.totalAssetsKrw
    while (assets > 0 && coverableMonths < 1200) {
      const inflationFactor = Math.pow(1 + monthlyInflation, coverableMonths)
      assets = assets * (1 + monthlyReturn) - monthlyShortfallKrw * inflationFactor
      coverableMonths++
    }
  }

  const status: SimStatus =
    coverageRatePct >= 80 ? 'stable' : coverageRatePct >= 50 ? 'warning' : 'danger'

  return { coverageRatePct, monthlyShortfallKrw, coverableMonths, status }
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
