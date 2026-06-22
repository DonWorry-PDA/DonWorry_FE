import type {
  DayEventsMap,
  ScheduleItem,
  TransactionItem,
} from '../types/calendar'

/** 디자인 기준 달: 2025년 6월, 오늘=25일 */
export const MOCK_TODAY_ISO = '2025-06-25'

export const MOCK_EVENTS: DayEventsMap = {
  '2025-06-02': [{ category: 'dividend', short: '배당', amountKrw: 3_500_000 }],
  '2025-06-09': [{ category: 'dividend', short: '배당', amountKrw: 3_500_000 }],
  '2025-06-10': [{ category: 'pension', short: '연금', amountKrw: 1_500_000 }],
  '2025-06-15': [{ category: 'payment', short: '납입', amountKrw: 1_000_000 }],
  '2025-06-20': [
    { category: 'interest', short: '예금이자', amountKrw: 2_000_000 },
  ],
}

/** 'YYYY-MM-DD' → 해당 날짜 일정 리스트 */
export const MOCK_SCHEDULES: Record<string, ScheduleItem[]> = {
  '2025-06-25': [
    { id: 's1', category: 'dividend', title: 'IRP 납입', amountKrw: -100_000 },
    { id: 's2', category: 'payment', title: '예금 이자 입금', amountKrw: 32_450 },
    {
      id: 's3',
      category: 'dividend',
      title: '배당금 입금 (○○○ 주식)',
      amountKrw: 350_000,
    },
  ],
}

/** 'YYYY-MM-DD' → 해당 날짜 거래 내역 */
export const MOCK_TRANSACTIONS: Record<string, TransactionItem[]> = {
  '2025-06-25': [
    { id: 't1', date: '06.25', title: '마트 결제', amountKrw: -85_000 },
  ],
}
