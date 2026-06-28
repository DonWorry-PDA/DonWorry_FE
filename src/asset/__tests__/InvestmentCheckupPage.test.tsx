// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import InvestmentCheckupPage from '../InvestmentCheckupPage'
import type { InvestmentCheckResponse } from '../types/investmentCheck'

// react-router useNavigate / AppBar·StickyFooter 등 라우팅·아이콘 의존 제거.
// (AppBar의 뒤로가기 SVG data-URI는 jsdom이 파싱하지 못해 렌더 대상에서 제외한다.)
vi.mock('react-router-dom', () => ({ useNavigate: () => vi.fn() }))
vi.mock('../../common/components/AppBar', () => ({ default: () => null }))
vi.mock('../../common/components/StickyFooter', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
vi.mock('../../common/components/Button', () => ({
  default: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}))

const getInvestmentCheckMock = vi.fn()
vi.mock('../hooks/useGetInvestmentCheck', () => ({
  default: () => getInvestmentCheckMock(),
}))

// uncoveredCashflow는 nullable additive 필드라 대부분의 케이스에서 null로 기본 주입한다.
// (공백 보유 케이스만 명시적으로 넘긴다.)
function mockData(
  data: Omit<InvestmentCheckResponse, 'uncoveredCashflow'> &
    Partial<Pick<InvestmentCheckResponse, 'uncoveredCashflow'>>,
) {
  getInvestmentCheckMock.mockReturnValue({
    data: { uncoveredCashflow: null, ...data } satisfies InvestmentCheckResponse,
    isLoading: false,
    isFetching: false,
    refetch: vi.fn(),
  })
}

const baseRoles: InvestmentCheckResponse['roles'] = [
  {
    role: 'CASHFLOW',
    label: '현금흐름',
    amount: 30_000_000,
    ratio: 50,
    monthlyCashflow: 87_500,
    note: '매달 배당·이자가 들어오는 돈',
  },
  {
    role: 'GROWTH',
    label: '성장',
    amount: 20_000_000,
    ratio: 33,
    monthlyCashflow: 41_600,
    note: '자본차익을 노리는 돈 (배당이 나오면 함께 표시돼요)',
  },
  {
    role: 'IDLE',
    label: '잠자는 돈',
    amount: 10_000_000,
    ratio: 17,
    monthlyCashflow: 0,
    note: '아직 일하지 않고 쉬고 있는 현금',
  },
]

describe('InvestmentCheckupPage 성장 블록', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => cleanup())

  it('델타 양수: 이동 유도 톤(💡)과 + 부호 델타를 보여준다', () => {
    mockData({
      cashflowAssetRatio: 50,
      totalAsset: 60_000_000,
      roles: baseRoles,
      growthAsset: {
        amount: 20_000_000,
        topStockName: '삼성전자',
        concentrationRatio: 40,
        concentrationLevel: '보통',
        topSector: '전기·전자',
        sectorConcentrationRatio: 100,
        sectorConcentrationLevel: '높음',
        currentMonthlyDividend: 41_600,
        convertedMonthlyDividend: 58_300,
        deltaMonthlyDividend: 16_700,
        suggestion: '일부를 배당 중심 자산으로 옮기면 현금흐름을 더 만들 수 있어요.',
      },
    })
    render(<InvestmentCheckupPage />)

    // 현재 배당이 실값(원 단위)으로 노출 — 만원 내림으로 0이 되지 않는다.
    expect(screen.getByText('41,600원')).toBeInTheDocument()
    expect(screen.getByText('58,300원')).toBeInTheDocument()
    // 델타 양수 → + 부호
    expect(screen.getByText('(+16,700원)')).toBeInTheDocument()
    // 권유 톤 아이콘
    expect(screen.getByText(/💡/)).toBeInTheDocument()
    // 섹터 쏠림이 단일종목 쏠림과 별개 항목으로 노출
    expect(screen.getByText('섹터 쏠림')).toBeInTheDocument()
    expect(screen.getByText('전기·전자 · 높음')).toBeInTheDocument()
    expect(screen.getByText('삼성전자 · 보통')).toBeInTheDocument()
  })

  it('델타 0 이하: 유지 경고 톤(⚠️)으로 분기한다', () => {
    mockData({
      cashflowAssetRatio: 50,
      totalAsset: 60_000_000,
      roles: baseRoles,
      growthAsset: {
        amount: 20_000_000,
        topStockName: '현대차',
        concentrationRatio: 70,
        concentrationLevel: '높음',
        topSector: '운수장비',
        sectorConcentrationRatio: 80,
        sectorConcentrationLevel: '높음',
        currentMonthlyDividend: 91_600,
        convertedMonthlyDividend: 58_300,
        deltaMonthlyDividend: -33_300,
        suggestion: '이미 배당이 꾸준히 나오는 자산이에요. 옮기면 현금흐름이 오히려 줄 수 있어요.',
      },
    })
    render(<InvestmentCheckupPage />)

    expect(screen.getByText('(-33,300원)')).toBeInTheDocument()
    expect(screen.getByText(/⚠️/)).toBeInTheDocument()
    expect(screen.queryByText(/💡 이미 배당/)).not.toBeInTheDocument()
  })

  it('topSector가 null이면 섹터 쏠림 행을 숨긴다', () => {
    mockData({
      cashflowAssetRatio: 50,
      totalAsset: 60_000_000,
      roles: baseRoles,
      growthAsset: {
        amount: 20_000_000,
        topStockName: '삼성전자',
        concentrationRatio: 100,
        concentrationLevel: '높음',
        topSector: null,
        sectorConcentrationRatio: 0,
        sectorConcentrationLevel: '낮음',
        currentMonthlyDividend: 41_600,
        convertedMonthlyDividend: 58_300,
        deltaMonthlyDividend: 16_700,
        suggestion: '일부를 배당 중심 자산으로 옮기면 현금흐름을 더 만들 수 있어요.',
      },
    })
    render(<InvestmentCheckupPage />)

    expect(screen.queryByText('섹터 쏠림')).not.toBeInTheDocument()
  })

  it('GROWTH 역할 카드가 0이 아닌 월 배당을 노출한다', () => {
    mockData({
      cashflowAssetRatio: 50,
      totalAsset: 60_000_000,
      roles: baseRoles,
      growthAsset: null,
    })
    render(<InvestmentCheckupPage />)

    // GROWTH 역할의 monthlyCashflow(41,600) 유입 표기
    expect(screen.getByText('월 41,600원 유입')).toBeInTheDocument()
  })

  it('1만원 미만 월 배당도 원 단위로 노출한다(0만원으로 사라지지 않음)', () => {
    mockData({
      cashflowAssetRatio: 50,
      totalAsset: 60_000_000,
      roles: baseRoles,
      growthAsset: {
        amount: 20_000_000,
        topStockName: '삼성전자',
        concentrationRatio: 40,
        concentrationLevel: '보통',
        topSector: '전기·전자',
        sectorConcentrationRatio: 100,
        sectorConcentrationLevel: '높음',
        currentMonthlyDividend: 9_900,
        convertedMonthlyDividend: 12_400,
        deltaMonthlyDividend: 2_500,
        suggestion: '일부를 배당 중심 자산으로 옮기면 현금흐름을 더 만들 수 있어요.',
      },
    })
    render(<InvestmentCheckupPage />)

    // formatKrw였다면 9,900원은 만원 내림으로 "0만원"이 된다. formatWon이라 원 단위로 노출.
    expect(screen.getByText('9,900원')).toBeInTheDocument()
    expect(screen.getByText('(+2,500원)')).toBeInTheDocument()
    expect(screen.queryByText('0만원')).not.toBeInTheDocument()
  })

  it('델타 정확히 0: 유지 톤(⚠️)으로 분기한다(경계가 < 0이 아니라 <= 0)', () => {
    mockData({
      cashflowAssetRatio: 50,
      totalAsset: 60_000_000,
      roles: baseRoles,
      growthAsset: {
        amount: 20_000_000,
        topStockName: '현대차',
        concentrationRatio: 70,
        concentrationLevel: '높음',
        topSector: '운수장비',
        sectorConcentrationRatio: 80,
        sectorConcentrationLevel: '높음',
        currentMonthlyDividend: 58_300,
        convertedMonthlyDividend: 58_300,
        deltaMonthlyDividend: 0,
        suggestion: '이미 배당이 꾸준히 나오는 자산이에요. 옮기면 현금흐름이 오히려 줄 수 있어요.',
      },
    })
    render(<InvestmentCheckupPage />)

    // 델타 0 → 부호 없는 "(0원)", isLoss = (delta <= 0) → 유지 톤 ⚠️
    expect(screen.getByText('(0원)')).toBeInTheDocument()
    expect(screen.getByText(/⚠️/)).toBeInTheDocument()
    expect(screen.queryByText(/💡/)).not.toBeInTheDocument()
  })
})

describe('InvestmentCheckupPage 분배 데이터 공백 안내', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => cleanup())

  it('uncoveredCashflow가 있으면 금액과 종목명을 안내 카드로 노출한다', () => {
    mockData({
      cashflowAssetRatio: 50,
      totalAsset: 60_000_000,
      roles: baseRoles,
      growthAsset: null,
      uncoveredCashflow: {
        amount: 20_000_000,
        productNames: ['SOL 코스피200채권혼합50', 'KODEX 국고채10년'],
      },
    })
    render(<InvestmentCheckupPage />)

    expect(screen.getByText(/분배 데이터 공백 안내/)).toBeInTheDocument()
    // 금액은 만원 단위(formatKrw)로 노출, "반영되지 않았어요" 안내 카피와 함께
    expect(screen.getByText(/2,000만원은 분배 데이터가 없어 현금흐름에/)).toBeInTheDocument()
    expect(screen.getByText('SOL 코스피200채권혼합50')).toBeInTheDocument()
    expect(screen.getByText('KODEX 국고채10년')).toBeInTheDocument()
  })

  it('uncoveredCashflow가 null이면 안내 카드를 렌더하지 않는다', () => {
    mockData({
      cashflowAssetRatio: 50,
      totalAsset: 60_000_000,
      roles: baseRoles,
      growthAsset: null,
      uncoveredCashflow: null,
    })
    render(<InvestmentCheckupPage />)

    expect(screen.queryByText(/분배 데이터 공백 안내/)).not.toBeInTheDocument()
  })

  it('productNames가 빈 배열이면(이론상) 카드를 숨긴다', () => {
    mockData({
      cashflowAssetRatio: 50,
      totalAsset: 60_000_000,
      roles: baseRoles,
      growthAsset: null,
      uncoveredCashflow: { amount: 20_000_000, productNames: [] },
    })
    render(<InvestmentCheckupPage />)

    expect(screen.queryByText(/분배 데이터 공백 안내/)).not.toBeInTheDocument()
  })
})
