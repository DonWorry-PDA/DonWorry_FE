export function formatKrw(amount: number): string {
  const eok = Math.floor(amount / 100_000_000)
  const man = Math.floor((amount % 100_000_000) / 10_000)

  if (eok > 0 && man > 0) {
    return `${eok}억 ${man.toLocaleString('ko-KR')}만원`
  }
  if (eok > 0) {
    return `${eok}억원`
  }
  return `${man.toLocaleString('ko-KR')}만원`
}

/** formatKrw에서 '원' 접미사를 뺀 단축형. 예: 248_800_000 → "2억 4,880만" */
export function formatKrwShort(amount: number): string {
  return formatKrw(amount).replace(/원$/, '')
}

/**
 * 원 단위 그대로 표기. formatKrw는 만원 단위로 내림해 월 배당 같은 소액이 "0만원"으로
 * 사라지므로, 월 현금흐름·배당처럼 만원 미만이 의미 있는 값에 쓴다. 예: 8_500 → "8,500원".
 */
export function formatWon(amount: number): string {
  return `${Math.round(amount).toLocaleString('ko-KR')}원`
}
