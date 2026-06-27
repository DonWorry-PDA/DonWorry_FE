export type AssetCategory = {
  id: string
  name: string
  items: AssetItem[]
}

export type AssetItem = {
  id: string
  name: string
  subLabel: string
}

export type SalaryAssetItem = {
  assetKey: string
  name: string
  description: string
  amount: number
  excluded: boolean
}

export type SalaryAssetGroup = {
  category: string
  categoryLabel: string
  items: SalaryAssetItem[]
}

export type SalaryAssetListResponse = {
  assetGroups: SalaryAssetGroup[]
}

export type SalaryAssetExclusionRequest = {
  excludedAssetKeys: string[]
}

export type CashFlowDiagnosisResponse = {
  monthlyCashFlow: number
  nationalPension: number
  dividendIncome: number
  targetMonthlyLivingCost: number
  monthlyShortfall: number
  shortfallExists: boolean
}

export type Analysis = {
  securedCashflow: number
  breakdown: CashflowItem[]
  targetExpense: number
  additionalNeededCashflow: number
}

export type CashflowItem = {
  label: string
  value: number | null
  valueLabel?: string
}

export type PlanType = 'stable' | 'balanced' | 'growth'

export type PlanStatus = 'available' | 'recommended' | 'selected' | 'locked'

export type Plan = {
  planId: string
  type: PlanType
  name: string
  tagline: string
  badge?: string
  status: PlanStatus
  expectedIncome: number
  coverage: number | null // 연금초과(충당 무의미)면 null → '충분' 표기
  riskLevel: '낮음' | '중간' | '높음'
  lockedReason?: string
}

export type ComparisonRow = {
  label: string
  left: string
  right: string
  leftTone?: 'default' | 'warning' | 'success'
  rightTone?: 'default' | 'warning' | 'success'
  isBadge?: boolean
}

export type ComparisonTable = {
  leftPlanId: string
  rightPlanId: string
  leftPlanName: string
  rightPlanName: string
  rows: ComparisonRow[]
  notice: string
}

export type AllocationItem = {
  label: string
  ratio: number
  detail: string
  color: string
}

export type PlanDetail = {
  planId: string
  planName: string
  expectedMonthlyIncome: number
  afterTaxIncome: number
  coverageFrom: number
  coverageTo: number
  shortfallFrom: number
  shortfallTo: number
  allocations: AllocationItem[]
  monthlyIncome: number
  principalValue: number
  notice: string
}

export type ExecutionItem = {
  id: string
  action: 'buy' | 'sell'
  name: string
  description: string
  amount: number
  productId?: number
  ticker?: string
  productName?: string
}

export type ExecutionSummary = {
  planName: string
  planType: PlanType
  coverageFrom: number
  coverageTo: number
  cashflowFrom: number
  cashflowTo: number
  items: ExecutionItem[]
  estimatedFee: number
  notice: string
}

export type ConsultType = 'pb'

export type ConsultCard = {
  type: ConsultType
  title: string
  subtitle: string
  description: string
  badge?: string
  hasSendToggle?: boolean
}

export type TimeSlot = {
  time: string
  period: '오전' | '오후'
}

// 월급 만들기 기이용자(매수 완료) 분기 — 현재 운용 현황.
// GET /api/user/monthly-salary/plan. rate류는 모두 0~100 퍼센트값(0~1 아님).
export type SalaryPlanBucketRole = 'RISK' | 'SAFE' | 'SHORT_TERM'

export type SalaryPlanHolding = {
  productId: number
  productName: string // 확정 시 스냅샷된 표시명(카탈로그 장애 무관)
  bucketRole: SalaryPlanBucketRole
  targetAmount: number // gross 목표 배분액
  currentEval: number // 현재 평가액(BROKERAGE만)
  achievedRate: number // 종목 진행률 %, 100 캡
  remainingToBuy: number // 추가 매수 필요액 = max(목표-보유, 0)
  productContribution: number // 종목별 월 기여액
}

// hasPlan=false면 본문 전부 null → 최초 진입(자산 선택)으로 라우팅.
export type SalaryPlanStatusResponse = {
  hasPlan: boolean
  planType: string | null // STABLE | BALANCED | LIQUIDITY
  displayName: string | null // 안정/균형 월급형 등
  expectedMonthlySalary: number | null // 예상 월수령액(헤드라인)
  targetMonthlyLivingCost: number | null
  livingCostCoverageRate: number | null // 충당률 %, 캡 없음(100 초과 가능)
  totalTargetAmount: number | null
  totalCurrentEval: number | null
  totalAchievedRate: number | null // 전체 진행률 %, 100 캡
  createdAt: string | null // 확정 시각(ISO)
  holdings: SalaryPlanHolding[] | null
}
