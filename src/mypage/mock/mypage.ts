import type { ConsultRecord, LinkedAccount, UserProfile } from '../types/mypage'

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

export const MOCK_CONSULT_RECORDS: ConsultRecord[] = [
  {
    id: '1',
    title: '은퇴 자산 설계 상담',
    status: 'reserved',
    dateTime: '2026.06.19 14:00',
    location: '신한투자증권 대면 상담',
    actionLabel: '상담 준비사항 보기',
  },
  {
    id: '2',
    title: '연금 수령 전략 상담',
    status: 'completed',
    dateTime: '2026.05.22 10:30',
    location: '비대면 상담',
    actionLabel: '상담 요약 보기',
  },
  {
    id: '3',
    title: '국민연금 연기 비교 상담',
    status: 'completed',
    dateTime: '2026.04.08 15:00',
    location: '비대면 상담',
  },
]
