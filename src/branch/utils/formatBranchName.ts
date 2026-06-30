import type { Institution } from '../types/branch'

/**
 * 리스트·예약 화면에 보여줄 지점 표시명. 뱃지 대신 이름 자체가 기관을 드러내도록 정규화한다.
 * - 은행: 원본 지점명에 기관 접두어가 없어 '신한은행'을 붙인다(이미 있으면 유지).
 * - 증권: 원본이 '신한 프리미어 …' 브랜드명을 담고 있어 그대로 둔다('신한투자증권' 중복 접두 방지).
 */
export const formatBranchName = (name: string, institution: Institution): string => {
  if (institution === 'SHINHAN_BANK') {
    return name.startsWith('신한은행') ? name : `신한은행 ${name}`
  }
  return name
}
