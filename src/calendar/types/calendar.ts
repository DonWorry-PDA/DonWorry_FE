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
  amountKrw: number // 350만 → 3_500_000
}

/** 'YYYY-MM-DD' → 해당 날짜의 이벤트 목록 */
export type DayEventsMap = Record<string, CalendarEvent[]>

/** 선택일 일정 리스트 항목 */
export type ScheduleItem = {
  id: string
  category: EventCategory
  title: string
  amountKrw: number // 부호 포함 (-100_000, +32_450)
}

/** 입출금/거래 내역 항목 */
export type TransactionItem = {
  id: string
  date: string // '06.25'
  title: string
  amountKrw: number // 부호 포함
}
