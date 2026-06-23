/** Date → "6월 25일" */
export function formatMD(date: Date): string {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}

/** Date → "2026년 11월" */
export function formatYM(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`
}

/** Date → "6월 25일 기준" */
export function formatRefDate(date: Date): string {
  return `${formatMD(date)} 기준`
}

/**
 * targetDate와 today 사이 일수 차이를 "D-13", "D-Day", "D+1" 형식으로 반환.
 * 두 날짜 모두 자정(00:00)으로 정규화 후 계산.
 */
export function calcDday(targetDate: Date, today: Date = new Date()): string {
  const t = new Date(targetDate)
  const n = new Date(today)
  t.setHours(0, 0, 0, 0)
  n.setHours(0, 0, 0, 0)
  const diff = Math.round((t.getTime() - n.getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'D-Day'
  return diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`
}
