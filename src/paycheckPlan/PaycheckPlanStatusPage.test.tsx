// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PaycheckPlanStatusPage from './PaycheckPlanStatusPage'
import type { ReentryGuidance, SalaryPlanStatusResponse } from './types/paycheckPlan'

// useNavigate / 상태 훅을 mock해 안내 UI의 렌더·강조·라우팅만 격리 검증한다.
const { mockNavigate, mockUseStatus } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockUseStatus: vi.fn(),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate, Navigate: () => null }
})

vi.mock('./hooks/useGetSalaryPlanStatus', () => ({
  default: () => mockUseStatus(),
}))

// AppBar는 SVG 아이콘(svgr)을 쓰는데 vitest config엔 svgr 플러그인이 없어 jsdom에서 깨진다.
// 안내 섹션 검증과 무관한 헤더이므로 가볍게 대체한다.
vi.mock('../common/components/AppBar', () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}))

const GUIDANCE_OPTIONS: ReentryGuidance['options'] = [
  { action: 'INCREASE_LIVING_COST', route: '/mypage/profile-edit', label: '목표 생활비 올리기' },
  { action: 'RETAKE_SURVEY', route: '/survey', label: '다시 설문하고 재설계' },
]

function statusWith(reentryGuidance: ReentryGuidance | null): SalaryPlanStatusResponse {
  return {
    hasPlan: true,
    planType: 'STABLE',
    displayName: '안정 월급형',
    expectedMonthlySalary: 2_000_000,
    targetMonthlyLivingCost: 2_000_000,
    livingCostCoverageRate: 100,
    totalTargetAmount: 0,
    totalCurrentEval: 0,
    totalAchievedRate: 0,
    createdAt: '2026-06-30T00:00:00',
    holdings: [],
    reentryGuidance,
  }
}

function renderWith(reentryGuidance: ReentryGuidance | null) {
  mockUseStatus.mockReturnValue({
    data: statusWith(reentryGuidance),
    isLoading: false,
    refetch: vi.fn(),
  })
  render(<PaycheckPlanStatusPage />)
}

describe('PaycheckPlanStatusPage 재진입 안내', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    mockUseStatus.mockReset()
  })

  // vitest globals off → testing-library 자동 cleanup 미등록. 수동으로 DOM을 비운다.
  afterEach(() => cleanup())

  it('충족(INCREASE_LIVING_COST)이면 생활비 올리기 버튼을 강조한다', () => {
    renderWith({ emphasis: 'INCREASE_LIVING_COST', options: GUIDANCE_OPTIONS })

    expect(screen.getByText('월급을 다시 설계해볼까요?')).toBeInTheDocument()
    // 강조 버튼은 primary(bg-primary), 비강조는 outline(border).
    expect(screen.getByRole('button', { name: '목표 생활비 올리기' })).toHaveClass('bg-primary')
    expect(screen.getByRole('button', { name: '다시 설문하고 재설계' })).toHaveClass('border')
  })

  it('미충족(NEUTRAL)이면 둘 다 강조하지 않는다', () => {
    renderWith({ emphasis: 'NEUTRAL', options: GUIDANCE_OPTIONS })

    expect(screen.getByRole('button', { name: '목표 생활비 올리기' })).not.toHaveClass('bg-primary')
    expect(screen.getByRole('button', { name: '다시 설문하고 재설계' })).not.toHaveClass('bg-primary')
  })

  it('버튼을 누르면 해당 route로 이동한다', () => {
    renderWith({ emphasis: 'INCREASE_LIVING_COST', options: GUIDANCE_OPTIONS })

    fireEvent.click(screen.getByRole('button', { name: '목표 생활비 올리기' }))
    expect(mockNavigate).toHaveBeenCalledWith('/mypage/profile-edit', {
      state: { returnTo: '/paycheck-plan/assets', livingCostOnly: true },
    })

    fireEvent.click(screen.getByRole('button', { name: '다시 설문하고 재설계' }))
    expect(mockNavigate).toHaveBeenCalledWith('/survey')
  })

  it('reentryGuidance가 없으면 안내 섹션을 렌더하지 않는다', () => {
    renderWith(null)

    expect(screen.queryByText('월급을 다시 설계해볼까요?')).not.toBeInTheDocument()
  })
})
