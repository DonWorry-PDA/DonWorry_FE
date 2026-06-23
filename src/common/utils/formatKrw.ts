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
