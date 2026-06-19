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
