import type { ConsultRecord, LinkedAccount, TermAgreement, UserProfile } from '../types/mypage'

export const MOCK_USER_PROFILE: UserProfile = {
  name: '김영수',
  age: 63,
  status: '은퇴',
  pensionStatus: '수령 중',
  monthlyTargetKrw: 2200000,
}

export const MOCK_LINKED_ACCOUNTS: LinkedAccount[] = [
  { id: '1', name: '신한은행 예금', detail: '110-***-2940', amountKrw: 50000000 },
  { id: '2', name: '신한투자증권', detail: 'ETF · 주식', amountKrw: 50000000 },
  { id: '3', name: 'IRP · 연금저축', detail: '2개 계좌', amountKrw: 150000000 },
]

export const MOCK_TERMS_AGREEMENTS: TermAgreement[] = [
  { id: 'service', label: '연금SOL사 서비스 이용약관', required: true, agreed: true, agreedAt: '2026.06.12' },
  { id: 'privacy', label: '개인정보 수집·이용 동의', required: true, agreed: true, agreedAt: '2026.06.12' },
  { id: 'biometric', label: '고유식별정보 처리 동의', required: true, agreed: true, agreedAt: '2026.06.12' },
  { id: 'electronic', label: '전자금융거래 이용약관', required: true, agreed: true, agreedAt: '2026.06.12' },
  { id: 'thirdParty', label: '개인정보 제3자 제공 동의', required: false, agreed: false, agreedAt: null },
  { id: 'marketing', label: '마케팅 정보 수신 동의', required: false, agreed: true, agreedAt: '2026.06.12' },
]

export const MOCK_CONSULT_RECORDS: ConsultRecord[] = [
  {
    id: '1',
    title: '은퇴 자산 설계 상담',
    status: 'reserved',
    dateTime: '2026.06.19 14:00',
    location: '신한투자증권 PWM센터',
    counselor: '김신한 PB팀장',
    actionLabel: '상담 준비사항 보기',
    actionPath: '/mypage/consult-history/1/prep',
  },
  {
    id: '2',
    title: '연금 수령 전략 상담',
    status: 'completed',
    dateTime: '2026.05.22 10:30',
    location: '비대면 상담',
    actionLabel: '상담 요약 보기',
    actionPath: '/mypage/consult-history/2/summary',
  },
  {
    id: '3',
    title: '국민연금 연기 비교 상담',
    status: 'completed',
    dateTime: '2026.04.08 15:00',
    location: '비대면 상담',
  },
]
