export const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const

export type DayCell = {
  iso: string // 'YYYY-MM-DD'
  day: number // 1~31
  weekday: number // 0(일)~6(토)
  inMonth: boolean // 현재 달 소속 여부
}

/** Date → 'YYYY-MM-DD' (로컬 기준, toISOString의 UTC 시프트 회피) */
export function toIso(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** 'YYYY-MM-DD' → Date (로컬) */
export function parseIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/**
 * year/month0(0-based)에 해당하는 달력 그리드 셀 배열을 만든다.
 * 앞뒤로 이전/다음 달 날짜를 채워 7의 배수(5~6주)로 맞춘다.
 */
export function buildMonthGrid(year: number, month0: number): DayCell[] {
  const startWeekday = new Date(year, month0, 1).getDay()
  const daysInMonth = new Date(year, month0 + 1, 0).getDate()
  const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7

  const cells: DayCell[] = []
  for (let i = 0; i < totalCells; i++) {
    const d = new Date(year, month0, 1 - startWeekday + i)
    cells.push({
      iso: toIso(d),
      day: d.getDate(),
      weekday: d.getDay(),
      inMonth: d.getMonth() === month0,
    })
  }
  return cells
}

/** 'YYYY-MM-DD' → '6월 25일 (수)' */
export function formatDayTitle(iso: string): string {
  const d = parseIso(iso)
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAY_LABELS[d.getDay()]})`
}

/** 'YYYY-MM-DD' → '2025년 6월' */
export function formatMonthTitle(year: number, month0: number): string {
  return `${year}년 ${month0 + 1}월`
}

/** 3_500_000 → '350만' */
export function formatMan(krw: number): string {
  return `${(krw / 10_000).toLocaleString('ko-KR')}만`
}

/** -100_000 → '-100,000원', 32_450 → '+32,450원' */
export function formatSignedWon(krw: number): string {
  const sign = krw > 0 ? '+' : ''
  return `${sign}${krw.toLocaleString('ko-KR')}원`
}
