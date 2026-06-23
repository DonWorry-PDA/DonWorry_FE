export type EventCategory =
  | 'dividend' // 배당 입금
  | 'pension' // 연금 수령
  | 'payment' // 납입일
  | 'maturity' // 만기일
  | 'interest' // 예금 이자
  | 'etc' // 기타

/** 달력 셀 안에 표시되는 이벤트 뱃지 */
export type CalendarEvent = {
  category: EventCategory
  short: string // 뱃지 한 줄 라벨 (e.g. '배당')
  amountKrw: number | null // 부호 포함. 만기 등 금액 미확정 시 null
  estimated?: boolean // ETF 예상 분배금 등 추정값 여부 (기본 false)
}

/** 'YYYY-MM-DD' → 해당 날짜의 이벤트 목록 */
export type DayEventsMap = Record<string, CalendarEvent[]>

/** 선택일 일정 리스트 항목 */
export type ScheduleItem = {
  id: string
  category: EventCategory
  title: string
  amountKrw: number | null // 부호 포함 (-100_000, +32_450). 금액 미확정 시 null
  estimated?: boolean // 추정값 여부 (기본 false)
}

/** 입출금/거래 내역 항목 */
export type TransactionItem = {
  id: string
  date: string // '06.25'
  title: string
  amountKrw: number // 부호 포함
}

/** GET /api/user/calendar?year=&month= 응답 (키는 모두 'YYYY-MM-DD') */
export type CalendarResponse = {
  events: DayEventsMap
  schedules: Record<string, ScheduleItem[]>
  transactions: Record<string, TransactionItem[]>
}
