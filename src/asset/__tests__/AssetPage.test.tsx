// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import AssetPage from '../AssetPage'
import type { AssetHubResponse } from '../types/assetHub'
import type { AssetIncomeResponse, AssetCompositionResponse, AssetScheduleResponse, AssetPensionResponse } from '../types/assetAnalysis'
import type { InvestmentCheckResponse } from '../types/investmentCheck'

vi.mock('react-router-dom', () => ({ useNavigate: () => vi.fn() }))
vi.mock('../../common/components/AppBar', () => ({ default: () => null }))
vi.mock('../../common/assets/icons', () => ({
  BackArrowIc: () => null,
  NotificationIc: () => null,
}))

const hubMock = vi.fn()
const compositionMock = vi.fn()
const incomeMock = vi.fn()
const scheduleMock = vi.fn()
const pensionMock = vi.fn()
const investmentCheckMock = vi.fn()

vi.mock('../hooks/useGetAssetHub', () => ({ default: () => hubMock() }))
vi.mock('../hooks/useGetAssetComposition', () => ({ default: () => compositionMock() }))
vi.mock('../hooks/useGetAssetIncome', () => ({ default: () => incomeMock() }))
vi.mock('../hooks/useGetAssetSchedule', () => ({ default: () => scheduleMock() }))
vi.mock('../hooks/useGetAssetPension', () => ({ default: () => pensionMock() }))
vi.mock('../hooks/useGetInvestmentCheck', () => ({ default: () => investmentCheckMock() }))

const defaultHub: AssetHubResponse = {
  totalAsset: 250_000_000,
  changeAmount: 1_200_000,
  changeDirection: 'UP',
  allocation: [],
  monthlyIncome: 130_000,
  monthlyExpense: 0,
  menus: {
    salaryMaking: null,
    lifeStability: null,
    investmentCheck: null,
    pensionDefer: null,
    retirementSim: null,
    monthlyReport: null,
  },
}

const defaultIncome: AssetIncomeResponse = {
  totalMonthlyIncome: 130_000,
  accessibleIncome: 100_000,
  lockedIncome: 30_000,
  totalUnrealizedGainLoss: 1_070_000,
  sources: [
    { type: '배당', label: '배당 ETF 분배금', amount: 100_000, locked: false },
    { type: '이자', label: '예금 이자', amount: 30_000, locked: true },
  ],
}

const defaultComposition: AssetCompositionResponse = {
  totalAsset: 250_000_000,
  totalDebt: 0,
  netWorth: 250_000_000,
  allocation: [
    {
      category: 'PENSION',
      label: '연금 재원',
      totalAmount: 150_000_000,
      accounts: [
        { accountId: 1, institutionName: 'KB', accountType: 'IRP', balance: 100_000_000, interestRate: null, maturityDate: null, holdings: [] },
        { accountId: 2, institutionName: '신한', accountType: '연금저축', balance: 50_000_000, interestRate: null, maturityDate: null, holdings: [] },
      ],
    },
    {
      category: 'CASHFLOW',
      label: '월급 만드는 자산',
      totalAmount: 50_000_000,
      accounts: [
        { accountId: 3, institutionName: 'KB', accountType: '배당ETF', balance: 50_000_000, interestRate: null, maturityDate: null, holdings: [] },
      ],
    },
  ],
}

const defaultSchedule: AssetScheduleResponse = {
  events: [
    { date: '2026-06-25', type: 'income', label: '배당금 입금', amount: 100_000, estimated: false },
    { date: '2026-11-01', type: 'maturity', label: '예금 만기', amount: 50_000_000, estimated: true },
  ],
}

const defaultPension: AssetPensionResponse = {
  items: [
    { label: 'IRP', amountKrw: 100_000_000 },
    { label: '연금저축', amountKrw: 50_000_000 },
  ],
}

const defaultInvestmentCheck: InvestmentCheckResponse = {
  cashflowAssetRatio: 32,
  totalAsset: 250_000_000,
  roles: [],
  growthAsset: null,
}

function mockAll(overrides: {
  hub?: object
  composition?: object
  income?: object
  schedule?: object
  pension?: object
  investmentCheck?: object
} = {}) {
  hubMock.mockReturnValue({ data: defaultHub, isLoading: false, isError: false, refetch: vi.fn(), ...overrides.hub })
  compositionMock.mockReturnValue({ data: defaultComposition, isLoading: false, isError: false, refetch: vi.fn(), ...overrides.composition })
  incomeMock.mockReturnValue({ data: defaultIncome, isLoading: false, isError: false, refetch: vi.fn(), ...overrides.income })
  scheduleMock.mockReturnValue({ data: defaultSchedule, isLoading: false, isError: false, refetch: vi.fn(), ...overrides.schedule })
  pensionMock.mockReturnValue({ data: defaultPension, isLoading: false, isError: false, refetch: vi.fn(), ...overrides.pension })
  investmentCheckMock.mockReturnValue({ data: defaultInvestmentCheck, isLoading: false, isError: false, refetch: vi.fn(), ...overrides.investmentCheck })
}

describe('AssetPage 총자산 카드', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => cleanup())

  it('총자산 2억 5,000만원을 표시한다', () => {
    mockAll()
    render(<AssetPage />)
    expect(screen.getByText('2억 5,000만원')).toBeInTheDocument()
  })

  it('changeDirection UP이면 성공 배지를 표시한다', () => {
    mockAll()
    render(<AssetPage />)
    expect(screen.getByText(/이번 달 \+120만원/)).toBeInTheDocument()
  })

  it('changeAmount null이면 배지를 숨긴다', () => {
    mockAll({ hub: { data: { ...defaultHub, changeAmount: null, changeDirection: 'FLAT' } } })
    render(<AssetPage />)
    expect(screen.queryByText(/이번 달/)).not.toBeInTheDocument()
  })

  it('평가손익을 표시한다', () => {
    mockAll()
    render(<AssetPage />)
    expect(screen.getByText('+107만원')).toBeInTheDocument()
  })
})

describe('AssetPage 자산 구성 카드', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => cleanup())

  it('allocation 항목 레이블을 렌더링한다', () => {
    mockAll()
    render(<AssetPage />)
    expect(screen.getByText('연금 재원')).toBeInTheDocument()
    expect(screen.getByText('월급 만드는 자산')).toBeInTheDocument()
  })

  it('서브 레이블에 기관명을 최대 2개 표시한다', () => {
    mockAll()
    render(<AssetPage />)
    expect(screen.getByText('KB · 신한')).toBeInTheDocument()
  })

  it('한 줄 요약에 cashflowAssetRatio를 보여준다', () => {
    mockAll()
    render(<AssetPage />)
    expect(screen.getByText(/32%/)).toBeInTheDocument()
  })

  it('allocation 빈 배열이면 안내 메시지를 표시한다', () => {
    mockAll({ composition: { data: { ...defaultComposition, allocation: [] } } })
    render(<AssetPage />)
    expect(screen.getByText('자산 정보가 없습니다')).toBeInTheDocument()
  })

  it('composition 에러 시 다시 시도 버튼을 표시한다', () => {
    mockAll({ composition: { isError: true, data: undefined } })
    render(<AssetPage />)
    expect(screen.getByText('자산 구성을 불러오지 못했어요')).toBeInTheDocument()
  })
})
