import type { Institution } from '@/branch/types/branch'

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
  riskScore: 1 | 2 | 3
  riskDesc: string
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

/** 지점 선택 화면(BranchFinderPage)에서 고른 영업점 — 예약 POST에 쓸 실 DB branchId를 들고 다닌다. */
export type SelectedBranch = {
  branchId: number
  institution: Institution
  name: string
  address: string
  distance: string
}

// 상담 방식 — 대면/전화 2종(BE FACE_TO_FACE/PHONE와 매핑). 화상은 제거.
export type ConsultMethod = 'face' | 'phone'

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

// 월급 만들기 확정 요청 — POST /api/user/monthly-salary/plan.
// 매수 완료 후 추천 응답의 plan/holdings를 그대로 스냅샷한다(BE는 재계산 없이 저장).
// 금액류는 원 단위 정수(BE 컬럼 scale=0).
export type SalaryPlanConfirmHolding = {
  productId: number
  productName: string
  bucketRole: SalaryPlanBucketRole // 추천 holding.role 그대로
  accountType: 'BROKERAGE' // 매수 실행 계좌(추천 holding은 BROKERAGE 범위)
  weight: number // 버킷 내 비중
  targetAmount: number // gross 목표 배분액(진행률 분모)
  productContribution: number // 종목별 월기여(원/월)
}

export type SalaryPlanConfirmRequest = {
  planType: string // STABLE | BALANCED | LIQUIDITY (추천 plan.type 그대로)
  targetMonthlyLivingCost: number
  expectedMonthlySalary: number
  holdings: SalaryPlanConfirmHolding[]
}

// 재진입(plan 보유) 안내 — 현황 화면에서 "생활비 상향/재설문" 두 선택지를 제시한다.
export type GuidanceAction = 'INCREASE_LIVING_COST' | 'RETAKE_SURVEY'
export type ReentryEmphasis = 'INCREASE_LIVING_COST' | 'NEUTRAL'

export type GuidanceOption = {
  action: GuidanceAction
  route: string // BE가 주는 이동 경로 (/mypage/profile-edit, /survey)
  label: string
}

export type ReentryGuidance = {
  emphasis: ReentryEmphasis // 강조할 선택지. NEUTRAL이면 균등.
  options: GuidanceOption[] // 항상 2개
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
  reentryGuidance: ReentryGuidance | null // 재진입 안내. 최초 진입(hasPlan=false)이면 null.
}
