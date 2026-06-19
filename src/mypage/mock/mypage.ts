import type { LinkedAccount, UserProfile } from '../types/mypage'

export const MOCK_USER_PROFILE: UserProfile = {
  name: '김영수',
  age: 63,
  status: '은퇴',
  monthlyTargetKrw: 2200000,
}

export const MOCK_LINKED_ACCOUNTS: LinkedAccount[] = [
  { id: '1', name: '신한은행 예금', detail: '110-***-2940', amountKrw: 50000000 },
  { id: '2', name: '신한투자증권', detail: 'ETF · 주식', amountKrw: 50000000 },
  { id: '3', name: 'IRP · 연금저축', detail: '2개 계좌', amountKrw: 150000000 },
]
