// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import BranchFinderPage from '../BranchFinderPage'
import type { Institution, NearbyBranch } from '../types/branch'

const navigate = vi.fn()
// 예약 시 기존 location.state(context·planId)를 그대로 넘기는지 검증하려면 state가 가변이어야 한다.
let locationState: unknown = null
vi.mock('react-router-dom', () => ({
  useNavigate: () => navigate,
  useLocation: () => ({ state: locationState }),
}))
vi.mock('../../common/components/AppBar', () => ({ default: () => null }))

const geoMock = vi.fn()
// 훅이 기관별로 2번 호출되므로 institution 인자에 따라 다른 결과를 돌려준다.
const branchesMock = vi.fn()

vi.mock('../hooks/useGeolocation', () => ({ default: () => geoMock() }))
vi.mock('../hooks/useGetNearbyBranches', () => ({
  default: (params: { institution: Institution }) => branchesMock(params),
}))

const bankBranches: NearbyBranch[] = [
  { id: 1, name: '신한은행 광화문점', address: '서울 종로구 새문안로 50', phone: '02-1', region: null, distanceMeters: 320, distanceKm: 0.3 },
]
const securitiesBranches: NearbyBranch[] = [
  { id: 1, name: '신한투자증권 서소문 PWM센터', address: '서울 중구 서소문로 100', phone: '02-2', region: '중구', distanceMeters: 1234, distanceKm: 1.2 },
]

const grantedGeo = { coords: { lat: 37.5, lng: 127 }, status: 'granted', request: vi.fn() }
// data는 성공(배열)·에러/로딩(undefined) 모두 표현할 수 있어야 한다.
type Query = {
  data: NearbyBranch[] | undefined
  isLoading: boolean
  isError: boolean
  refetch: () => void
}
const ok = (data: NearbyBranch[], refetch: () => void = vi.fn()): Query => ({
  data,
  isLoading: false,
  isError: false,
  refetch,
})

// 기관별 결과 매핑. 테스트마다 override.
let resultByInstitution: Record<Institution, Query>

beforeEach(() => {
  navigate.mockReset()
  locationState = null
  geoMock.mockReturnValue(grantedGeo)
  resultByInstitution = {
    SHINHAN_BANK: ok(bankBranches),
    SHINHAN_SECURITIES: ok(securitiesBranches),
  }
  branchesMock.mockImplementation(
    ({ institution }: { institution: Institution }) => resultByInstitution[institution],
  )
})
afterEach(cleanup)

describe('BranchFinderPage', () => {
  it('두 기관 결과를 거리 오름차순으로 병합해 렌더한다', () => {
    render(<BranchFinderPage />)

    expect(screen.getByText('신한은행 광화문점')).toBeInTheDocument()
    expect(screen.getByText('320m')).toBeInTheDocument()
    expect(screen.getByText('신한투자증권 서소문 PWM센터')).toBeInTheDocument()
    expect(screen.getByText('1.2km')).toBeInTheDocument()
    // 기관 배지(탭 대신) + region이 있는 항목만 region 표시
    expect(screen.getByText('신한은행')).toBeInTheDocument()
    expect(screen.getByText('신한투자증권')).toBeInTheDocument()
    expect(screen.getByText('중구')).toBeInTheDocument()
    expect(screen.getByText('가까운 순 · 2곳')).toBeInTheDocument()
  })

  it('가장 가까운 지점이 기본 선택되고, 예약 시 그 지점을 상담 화면으로 넘긴다', () => {
    render(<BranchFinderPage />)

    fireEvent.click(screen.getByText('선택한 지점으로 예약'))
    expect(navigate).toHaveBeenCalledWith('/paycheck-plan/consult', {
      state: {
        branch: {
          id: 'SHINHAN_BANK-1',
          institution: 'SHINHAN_BANK',
          name: '신한은행 광화문점',
          address: '서울 종로구 새문안로 50',
          distance: '320m',
        },
      },
    })
  })

  it('다른 지점을 선택하면 그 지점으로 예약된다', () => {
    render(<BranchFinderPage />)

    fireEvent.click(screen.getByText('신한투자증권 서소문 PWM센터'))
    fireEvent.click(screen.getByText('선택한 지점으로 예약'))
    expect(navigate).toHaveBeenCalledWith(
      '/paycheck-plan/consult',
      expect.objectContaining({
        state: expect.objectContaining({
          branch: expect.objectContaining({
            id: 'SHINHAN_SECURITIES-1',
            institution: 'SHINHAN_SECURITIES',
            distance: '1.2km',
          }),
        }),
      }),
    )
  })

  it('검색어로 병합 리스트를 필터링한다', () => {
    render(<BranchFinderPage />)

    fireEvent.change(screen.getByPlaceholderText(/지점명·지역 검색/), { target: { value: '서소문' } })
    expect(screen.queryByText('신한은행 광화문점')).not.toBeInTheDocument()
    expect(screen.getByText('신한투자증권 서소문 PWM센터')).toBeInTheDocument()
    expect(screen.getByText('가까운 순 · 1곳')).toBeInTheDocument()
  })

  it('두 기관 모두 빈 결과면 안내 문구를 보여준다', () => {
    resultByInstitution = { SHINHAN_BANK: ok([]), SHINHAN_SECURITIES: ok([]) }
    render(<BranchFinderPage />)

    expect(screen.getByText('주변에 지점이 없어요.')).toBeInTheDocument()
  })

  it('두 기관 모두 에러면 다시 시도 버튼을 보여주고 누르면 둘 다 refetch한다', () => {
    const bankRefetch = vi.fn()
    const secRefetch = vi.fn()
    resultByInstitution = {
      SHINHAN_BANK: { data: undefined, isLoading: false, isError: true, refetch: bankRefetch },
      SHINHAN_SECURITIES: { data: undefined, isLoading: false, isError: true, refetch: secRefetch },
    }
    render(<BranchFinderPage />)

    expect(screen.getByText(/지점을 불러오지 못했어요/)).toBeInTheDocument()
    fireEvent.click(screen.getByText('다시 시도'))
    expect(bankRefetch).toHaveBeenCalled()
    expect(secRefetch).toHaveBeenCalled()
  })

  it('위치 권한 거부 시 안내와 재시도 동선을 보여준다', () => {
    const request = vi.fn()
    geoMock.mockReturnValue({ coords: null, status: 'denied', request })
    render(<BranchFinderPage />)

    expect(screen.getByText(/위치 권한이 꺼져 있어요/)).toBeInTheDocument()
    fireEvent.click(screen.getByText('위치 다시 시도'))
    expect(request).toHaveBeenCalled()
  })

  it('위치 미지원이면 재시도 없이 안내만 보여준다', () => {
    geoMock.mockReturnValue({ coords: null, status: 'unavailable', request: vi.fn() })
    render(<BranchFinderPage />)

    expect(screen.getByText(/이 기기에서는 위치 정보를 사용할 수 없어요/)).toBeInTheDocument()
    expect(screen.queryByText('위치 다시 시도')).not.toBeInTheDocument()
  })

  it('조회 중이면 로딩 안내(스켈레톤)를 보여준다', () => {
    resultByInstitution = {
      SHINHAN_BANK: { data: undefined, isLoading: true, isError: false, refetch: vi.fn() },
      SHINHAN_SECURITIES: { data: undefined, isLoading: true, isError: false, refetch: vi.fn() },
    }
    render(<BranchFinderPage />)

    expect(screen.getByText('가까운 지점을 찾고 있어요')).toBeInTheDocument()
  })

  it('한쪽만 실패하고 결과가 비면 빈 상태 대신 오류·재시도를 보여준다', () => {
    const secRefetch = vi.fn()
    resultByInstitution = {
      SHINHAN_BANK: ok([]),
      SHINHAN_SECURITIES: { data: undefined, isLoading: false, isError: true, refetch: secRefetch },
    }
    render(<BranchFinderPage />)

    expect(screen.queryByText('주변에 지점이 없어요.')).not.toBeInTheDocument()
    expect(screen.getByText(/지점을 불러오지 못했어요/)).toBeInTheDocument()
    fireEvent.click(screen.getByText('다시 시도'))
    expect(secRefetch).toHaveBeenCalled()
  })

  it('한쪽만 실패해도 다른 쪽 결과가 있으면 그 결과를 보여준다', () => {
    resultByInstitution = {
      SHINHAN_BANK: ok(bankBranches),
      SHINHAN_SECURITIES: { data: undefined, isLoading: false, isError: true, refetch: vi.fn() },
    }
    render(<BranchFinderPage />)

    expect(screen.getByText('신한은행 광화문점')).toBeInTheDocument()
    expect(screen.queryByText(/지점을 불러오지 못했어요/)).not.toBeInTheDocument()
  })

  it('지역명(region)으로도 검색된다', () => {
    resultByInstitution = {
      SHINHAN_BANK: ok([
        { id: 9, name: '신한은행 본점', address: '서울 중구 세종대로 9', phone: '02-9', region: '강남구', distanceMeters: 500, distanceKm: 0.5 },
      ]),
      SHINHAN_SECURITIES: ok([]),
    }
    render(<BranchFinderPage />)

    // 이름·주소엔 '강남구'가 없고 region에만 있는 항목이 검색돼야 한다.
    fireEvent.change(screen.getByPlaceholderText(/지점명·지역 검색/), { target: { value: '강남구' } })
    expect(screen.getByText('신한은행 본점')).toBeInTheDocument()
    expect(screen.getByText('가까운 순 · 1곳')).toBeInTheDocument()
  })

  it('진입 시 받은 예약 컨텍스트(context·planId)를 예약 시 그대로 넘긴다', () => {
    locationState = { context: 'SALARY_PLAN', planId: 42 }
    render(<BranchFinderPage />)

    fireEvent.click(screen.getByText('선택한 지점으로 예약'))
    expect(navigate).toHaveBeenCalledWith(
      '/paycheck-plan/consult',
      expect.objectContaining({
        state: expect.objectContaining({ context: 'SALARY_PLAN', planId: 42 }),
      }),
    )
  })
})
