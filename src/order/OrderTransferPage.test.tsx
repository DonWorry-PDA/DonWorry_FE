// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import OrderTransferPage from './OrderTransferPage'
import type { MydataAccount } from './types/account'

const navigate = vi.fn()
const useLocationMock = vi.fn()
const getAccountsQueryMock = vi.fn()
const postTransferMutationMock = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigate,
  useLocation: () => useLocationMock(),
}))

vi.mock('../common/components/AppBar', () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}))

vi.mock('../common/components/Button', () => ({
  default: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}))

vi.mock('../common/components/CheckBadge', () => ({
  default: () => <div>check-badge</div>,
}))

vi.mock('./hooks/useGetAccounts', () => ({
  default: () => getAccountsQueryMock(),
}))

vi.mock('./hooks/usePostTransfer', () => ({
  default: () => postTransferMutationMock(),
}))

const accounts: MydataAccount[] = [
  {
    accountId: 1,
    accountType: 'BROKERAGE',
    institutionName: '신한투자증권',
    accountNumber: '111122223333',
    depositBalance: 100_000,
    existingAccount: true,
  },
  {
    accountId: 2,
    accountType: 'DEPOSIT',
    institutionName: '신한은행',
    accountNumber: '222233334444',
    depositBalance: 500_000,
    existingAccount: true,
  },
  {
    accountId: 3,
    accountType: 'CHECKING',
    institutionName: '신한은행',
    accountNumber: '333344445555',
    depositBalance: 400_000,
    existingAccount: true,
  },
]

beforeEach(() => {
  navigate.mockReset()
  useLocationMock.mockReturnValue({
    state: {
      items: [{ productId: 1, productType: 'ETF', name: 'ETF', amount: 300_000 }],
      totalAmountWon: 300_000,
      planId: 'plan-1',
    },
  })
  getAccountsQueryMock.mockReturnValue({
    data: accounts,
    isLoading: false,
  })
  postTransferMutationMock.mockReturnValue({
    isPending: false,
    isError: false,
    mutate: vi.fn(),
    reset: vi.fn(),
  })
})

describe('OrderTransferPage', () => {
  it('정기예금 계좌는 이체 가능한 출금 계좌 목록에 노출하지 않는다', () => {
    render(<OrderTransferPage />)

    expect(screen.getByText('출금 계좌 선택')).toBeInTheDocument()
    expect(screen.queryByText('예금')).not.toBeInTheDocument()
    expect(screen.queryByText('********4444')).not.toBeInTheDocument()
    expect(screen.queryByText('********3333')).not.toBeInTheDocument()
    expect(screen.getByText(/입출금/)).toBeInTheDocument()
    expect(screen.getByText('********5555')).toBeInTheDocument()
  })
})
