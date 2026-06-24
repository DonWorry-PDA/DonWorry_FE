export type AssetAllocationSegment = {
  label: string
  pct: number
}

export type AssetHubSummary = {
  totalAmountKrw: number
  changeAmountKrw: number | null
  changeDirection: 'UP' | 'DOWN' | 'FLAT'
  allocation: AssetAllocationSegment[]
  monthlyIncomeKrw: number
  monthlyExpenseKrw: number
}

export type ManageMenuKey =
  | 'salaryMaking'
  | 'lifeStability'
  | 'investmentCheck'
  | 'pensionDefer'
  | 'retirementSim'
  | 'monthlyReport'

export type MenuIconTone = 'primary' | 'warning' | 'muted'

export type ManageMenu = {
  key: ManageMenuKey
  title: string
  caption: string
  path: string
  /** 카드 좌상단 아이콘 배경 톤 */
  iconTone: MenuIconTone
  /** 월급 만들기 카드 진행률(0~100). 있으면 카드 하단에 진행바 표시 */
  progressPct?: number
  /** 생활 안정도처럼 상태 점 + 라벨을 별도 줄로 강조 (예: '주의') */
  statusDot?: 'stable' | 'warning' | 'danger'
  statusText?: string
  /** 강조 테두리(현재 추천 액션) */
  highlighted?: boolean
  /** NEW 뱃지 */
  isNew?: boolean
}
