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

  it('물가상승 있을 때 초기 충당 가능해도 자산 소진 시뮬레이션 실행', () => {
    // 연금 = 생활비 → 현재 shortfall = 0, 물가상승 3% → 미래에 생활비 > 연금
    const params: SimParams = {
      ...BASE,
      monthlyPensionKrw: 2_200_000, // 현재는 충당 가능
      totalAssetsKrw: 10_000_000,
    }
    const result = computeSimulation(params, 0, 3)
    expect(result.monthlyShortfallKrw).toBe(0) // 현재 부족 없음
    expect(result.coverableMonths).toBeGreaterThan(0) // 물가 상승으로 미래에 소진
  })

  it('자산 없고 부족액 있으면 coverableMonths = 0 (즉시 소진)', () => {
    const params: SimParams = {
      ...BASE,
      totalAssetsKrw: 0,
      monthlyPensionKrw: 500_000,
    }
    const result = computeSimulation(params, 0, 0)
    expect(result.monthlyShortfallKrw).toBeGreaterThan(0)
    expect(result.coverableMonths).toBe(0)
  })

  it('monthlyLivingKrw가 0이면 danger 결과를 반환', () => {
    const result = computeSimulation({ ...BASE, monthlyLivingKrw: 0 }, 0, 0)
    expect(result.coverageRatePct).toBe(0)
    expect(result.monthlyShortfallKrw).toBe(0)
    expect(result.coverableMonths).toBe(0)
    expect(result.status).toBe('danger')
  })

  it('1200개월 내 자산 미소진 시 coverableMonths = 1200', () => {
    // 충분한 자산 + 낮은 물가상승 → 100년 내 소진 안 됨
    const result = computeSimulation(
      { ...BASE, totalAssetsKrw: 10_000_000_000, monthlyPensionKrw: 2_200_000 },
      5,
      1,
    )
    expect(result.coverableMonths).toBe(1200)
  })

  it('월 수입 구성(연금 + 투자수익)을 노출한다', () => {
    // 수익률 12% → 월 1% → 투자수익 = 2.5억 × 0.01 = 250만, 수입 = 연금 120만 + 250만 = 370만
    const result = computeSimulation(BASE, 12, 0)
    expect(result.monthlyInvestmentIncomeKrw).toBe(2_500_000)
    expect(result.monthlyIncomeKrw).toBe(3_700_000)
    expect(result.monthlyPensionKrw).toBe(1_200_000)
    expect(result.monthlyLivingKrw).toBe(2_200_000)
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
