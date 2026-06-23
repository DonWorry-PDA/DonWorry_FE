import { describe, it, expect } from 'vitest'
import { computeSimulation } from '../useSimulation'
import type { SimParams } from '../../types/simulation'

const BASE: SimParams = {
  ageYears: 63,
  totalAssetsKrw: 250_000_000,
  monthlyLivingKrw: 2_200_000,
  monthlyPensionKrw: 1_200_000,
}

describe('computeSimulation', () => {
  it('수익률 0%, 물가상승 0%일 때 연금만으로 충당률 계산', () => {
    const result = computeSimulation(BASE, 0, 0)
    // income = 1,200,000, coverage = 1,200,000/2,200,000 = 54.5% → round → 55%
    expect(result.coverageRatePct).toBe(55)
    expect(result.monthlyShortfallKrw).toBe(1_000_000)
    expect(result.status).toBe('warning')
  })

  it('연금이 생활비와 같을 때 충당 가능 (shortfall=0)', () => {
    const richParams: SimParams = {
      ...BASE,
      monthlyPensionKrw: 2_200_000,
    }
    const result = computeSimulation(richParams, 0, 0)
    expect(result.coverageRatePct).toBe(100)
    expect(result.monthlyShortfallKrw).toBe(0)
    expect(result.coverableMonths).toBe(0)
    expect(result.status).toBe('stable')
  })

  it('coverageRatePct >= 80이면 status stable', () => {
    const result = computeSimulation(BASE, 10, 0)
    expect(result.status).toBe('stable')
  })

  it('coverageRatePct < 50이면 status danger', () => {
    const poorParams: SimParams = {
      ...BASE,
      monthlyPensionKrw: 500_000,
      totalAssetsKrw: 0,
    }
    const result = computeSimulation(poorParams, 0, 0)
    expect(result.status).toBe('danger')
  })

  it('coverableMonths는 자산 소진까지 월 수', () => {
    const result = computeSimulation(
      { ...BASE, totalAssetsKrw: 12_000_000, monthlyPensionKrw: 0 },
      0,
      0,
    )
    // shortfall = 2,200,000/month, assets = 12,000,000 → ~5개월
    expect(result.coverableMonths).toBeGreaterThan(0)
    expect(result.coverableMonths).toBeLessThan(7)
  })
})
