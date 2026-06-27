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
  totalMonthlyIncome: 180_000,
  accessibleIncome: 130_000,
  lockedIncome: 50_000,
  totalUnrealizedGainLoss: 1_070_000,
  sources: [
    { type: 'ETF_DIVIDEND', label: 'ETF 배당', amount: 100_000, locked: false },
    { type: 'DEPOSIT_INTEREST', label: '예금 이자', amount: 30_000, locked: false },
    { type: 'PENSION_DIVIDEND', label: '연금 계좌 ETF 배당', amount: 50_000, locked: true },
  ],
}

const defaultComposition: AssetCompositionResponse = {
  totalAsset: 250_000_000,
  totalDebt: 0,
  netWorth: 250_000_000,
  allocation: [
    { category: 'PENSION', ratio: 60 },
    { category: 'CASHFLOW', ratio: 20 },
  ],
  groups: [
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

const today = new Date()
const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
const nm = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}`

const defaultSchedule: AssetScheduleResponse = {
  events: [
    { date: `${nm}-25`, type: 'ETF_DIVIDEND', label: 'KODEX 배당 예상 분배금', amount: 100_000, estimated: true },
    { date: `${nm}-15`, type: 'DEPOSIT_INTEREST', label: 'KB 예금 이자', amount: 30_000, estimated: false },
    { date: `${nm}-10`, type: 'DEPOSIT_MATURITY', label: '신한 정기예금 만기', amount: 50_000_000, estimated: false },
  ],
}

const defaultPension: AssetPensionResponse = {
  totalMonthlyPension: 1_200_000,
  pensions: [
    { type: 'NATIONAL', label: '국민연금', institutionName: null, startAge: 65, currentBalance: null, expectedMonthly: 500_000, taxBenefitLimit: null, estimated: false },
    { type: 'IRP', label: 'IRP', institutionName: 'KB', startAge: 55, currentBalance: 100_000_000, expectedMonthly: 700_000, taxBenefitLimit: 9_000_000, estimated: false },
    { type: 'PENSION_SAVING', label: '연금저축', institutionName: '신한', startAge: 55, currentBalance: 50_000_000, expectedMonthly: 500_000, taxBenefitLimit: 6_000_000, estimated: true },
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

  it('계좌의 기관명을 표시한다', () => {
    mockAll()
    render(<AssetPage />)
    expect(screen.getAllByText('KB').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('신한').length).toBeGreaterThanOrEqual(1)
  })

  it('한 줄 요약에 cashflowAssetRatio를 보여준다', () => {
    mockAll()
    render(<AssetPage />)
    expect(screen.getByText(/32%/)).toBeInTheDocument()
  })

  it('groups 빈 배열이면 안내 메시지를 표시한다', () => {
    mockAll({ composition: { data: { ...defaultComposition, groups: [] } } })
    render(<AssetPage />)
    expect(screen.getByText('자산 정보가 없습니다')).toBeInTheDocument()
  })

  it('composition 에러 시 다시 시도 버튼을 표시한다', () => {
    mockAll({ composition: { isError: true, data: undefined } })
    render(<AssetPage />)
    expect(screen.getByText('자산 구성을 불러오지 못했어요')).toBeInTheDocument()
  })
})

describe('AssetPage 월 수입 카드', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => cleanup())

  it('유동 월 수입(accessibleIncome)을 헤드라인에 표시한다', () => {
    mockAll()
    render(<AssetPage />)
    expect(screen.getByText('13만원')).toBeInTheDocument()
  })

  it('비유동 수입이 있으면 별도 표시한다', () => {
    mockAll()
    render(<AssetPage />)
    expect(screen.getByText('+5만원 비유동')).toBeInTheDocument()
  })

  it('수입 출처 목록을 렌더링한다', () => {
    mockAll()
    render(<AssetPage />)
    expect(screen.getByText('ETF 배당')).toBeInTheDocument()
    expect(screen.getByText('예금 이자')).toBeInTheDocument()
    expect(screen.getByText('연금 계좌 ETF 배당')).toBeInTheDocument()
  })

  it('locked 출처에 "비유동" 뱃지를 표시한다', () => {
    mockAll()
    render(<AssetPage />)
    expect(screen.getByText('비유동')).toBeInTheDocument()
  })

  it('sources 빈 배열이면 안내 메시지를 표시한다', () => {
    mockAll({ income: { data: { ...defaultIncome, sources: [] } } })
    render(<AssetPage />)
    expect(screen.getByText('수입 출처가 없습니다')).toBeInTheDocument()
  })
})

describe('AssetPage 현금 일정 카드', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => cleanup())

  it('이벤트 레이블을 표시한다', () => {
    mockAll()
    render(<AssetPage />)
    expect(screen.getByText('KODEX 배당 예상 분배금')).toBeInTheDocument()
    expect(screen.getByText('KB 예금 이자')).toBeInTheDocument()
    expect(screen.getByText('신한 정기예금 만기')).toBeInTheDocument()
  })

  it('estimated 이벤트에 "예정" 뱃지를 표시한다', () => {
    mockAll()
    render(<AssetPage />)
    expect(screen.getByText('예정')).toBeInTheDocument()
  })

  it('events 빈 배열이면 안내 메시지를 표시한다', () => {
    mockAll({ schedule: { data: { events: [] } } })
    render(<AssetPage />)
    const nextMonthNum = new Date(today.getFullYear(), today.getMonth() + 1, 1).getMonth() + 1
    expect(screen.getByText(`${nextMonthNum}월에 예정된 수입이 없어요`)).toBeInTheDocument()
  })
})

describe('AssetPage 연금 재원 카드', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => cleanup())

  it('연금 항목 레이블을 표시한다', () => {
    mockAll()
    render(<AssetPage />)
    // IRP appears in both composition account chip and pension label
    expect(screen.getAllByText('IRP').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('연금저축').length).toBeGreaterThanOrEqual(1)
  })

  it('현재 잔액을 표시한다', () => {
    mockAll()
    render(<AssetPage />)
    expect(screen.getByText('1억원')).toBeInTheDocument()
    expect(screen.getByText('5,000만원')).toBeInTheDocument()
  })

  it('pensions 빈 배열이면 안내 메시지를 표시한다', () => {
    mockAll({ pension: { data: { totalMonthlyPension: 0, pensions: [] } } })
    render(<AssetPage />)
    expect(screen.getByText('연금 재원 정보가 없습니다')).toBeInTheDocument()
  })
})
