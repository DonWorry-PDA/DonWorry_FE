// BE 추천 API(GET /api/user/portfolio/recommendation) 응답 타입.
// 화면용 변환은 utils/planMapper 에서 처리하고, 여기서는 서버 계약만 그대로 표현한다.

export type RecommendationTrack = 'NORMAL' | 'STRUCTURAL_SHORTAGE' | 'PENSION_SUFFICIENT'

export type GuidanceBand = 'SUFFICIENT' | 'NEAR' | 'TRADEOFF' | 'HARD'

export type BackendPlanType = 'STABLE' | 'BALANCED' | 'LIQUIDITY'

export type BackendPlanStatus = 'RECOMMENDED' | 'AVAILABLE'

export type AllocationRole = 'SAFE' | 'RISK' | 'SHORT_TERM'

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
  allocations: AllocationView[]
  monthlyIncome: number // 원
  alphaCoverageRate: number | null // 이미 %, 100캡. 연금초과(PENSION_SUFFICIENT)면 null
  inheritanceAmount: number // 원
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
  q3ReferenceLabel: string | null
  q3Scenarios: Q3Scenario[]
}
