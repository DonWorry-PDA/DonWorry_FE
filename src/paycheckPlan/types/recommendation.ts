// BE 추천 API(GET /api/user/portfolio/recommendation) 응답 타입.
// 화면용 변환은 utils/planMapper 에서 처리하고, 여기서는 서버 계약만 그대로 표현한다.

export type RecommendationTrack = 'NORMAL' | 'STRUCTURAL_SHORTAGE' | 'PENSION_SUFFICIENT'

export type GuidanceBand = 'SUFFICIENT' | 'NEAR' | 'TRADEOFF' | 'HARD'

export type BackendPlanType = 'STABLE' | 'BALANCED' | 'LIQUIDITY'

export type BackendPlanStatus = 'RECOMMENDED' | 'AVAILABLE'

export type AllocationRole = 'SAFE' | 'RISK' | 'SHORT_TERM'

export type BucketRole = 'SAFE' | 'RISK' | 'SHORT_TERM'

export type CurrencyExposure = 'UNHEDGED' | 'HEDGED'

export type Holding = {
  productId: number
  ticker: string
  productName: string
  role: BucketRole
  currency: CurrencyExposure
  weight: number // 버킷 내 비중 (각 버킷 합=1.0)
  amount: number // 원
  monthlyContribution: number // 종목별 월기여 (원/월, net 실수령). 확정 시 productContribution으로 통과
}

export type AllocationView = {
  label: string
  role: AllocationRole
  ratio: number // 운용자산 대비 비중(%, 이미 0~100)
  amount: number // 원
}

export type RecommendationPlan = {
  type: BackendPlanType
  label: string // 도메인 라벨 (예: "안정안")
  displayName: string // 화면 표시명 (예: "안정 월급형")
  description: string
  status: BackendPlanStatus
  riskTarget: number
  safeTarget: number
  shortTermBucket: number
  holdings: Holding[] // 개별 보유 종목
  allocations: AllocationView[]
  monthlyIncome: number // 원, 총인출 기준
  alphaCoverageRate: number | null // α충족률 %, 100캡. 연금초과(PENSION_SUFFICIENT)면 null
  sustainableCoverageRate: number | null // α충족률 (지속가능 기준, 이자·배당만), 100캡
  inheritanceAmount: number // 원
  totalCoverageRate: number // 설계안 적용 후 생활비 충당률 % (monthlyIncome / targetLivingCost)
  residualMonthlyShortfall: number // 설계안 적용 후 월 부족액 (원, 0이면 초과 달성)
}

export type Q3Scenario = {
  q3: 0 | 1 | 2 // 0=상속우선 / 1=반반 / 2=소비우선
  monthlyIncome: number
  inheritanceAmount: number
}

export type RecommendationResponse = {
  track: RecommendationTrack
  alpha: number
  band: GuidanceBand | null // NORMAL일 때만
  plans: RecommendationPlan[] // 구조적부족이면 []
  targetMonthlyLivingCost: number // 목표 생활비 (원)
  currentMonthlyCashFlow: number // 현재 월 현금흐름 — 국민연금 + 배당 (원)
  currentCoverageRate: number // 현재 생활비 충당률 % (설계안 적용 전 baseline)
  currentMonthlyShortfall: number // 현재 월 부족액 (원)
  q3ReferenceLabel: string | null
  q3Scenarios: Q3Scenario[]
}
