export type StabilityStatus = 'stable' | 'warning' | 'danger'

export type StabilityItem = {
  id: number
  label: string
  status: StabilityStatus
  /** 지표 실값(포맷 완료). 예: "112%", "8개월" */
  value: string
  /** 지표가 무엇을 뜻하는지 (세부 시트 본문) */
  meaning: string
  /** 권장 기준. 예: "100% 이상", "6개월분 이상" */
  criteria: string
  /** 개선 방법 안내 (세부 시트, 보완/개선 상태일 때 노출) */
  improve: string
}

/** 성장형 플랜 가드레일 (생활 안정도 기반 추천 플랜) */
export type StabilityGuardrail = {
  growthPlanAllowed: boolean
  recommendedPlanLabel: string
  reason: string
}

/** 화면에서 사용하는 뷰 모델 (API 응답을 가공한 결과) */
export type StabilityData = {
  percentage: number
  status: StabilityStatus
  summaryMessage: string
  items: StabilityItem[]
  /** 개선 메시지 전체 (없으면 빈 배열) */
  improvementMessages: string[]
  guardrail: StabilityGuardrail | null
}

// ── API 응답 원형 (GET /api/user/life-stability/me) ──────────────
export type LifeStabilityMetrics = {
  cashflowCoverageRate: number
  essentialExpenseRate: number
  medicalPreparednessMonths: number
  liquidityMonths: number
  debtBurdenRate: number
  riskAssetDependencyRate: number
}

export type LifeStabilityIndicatorLabel = '안정' | '보완 필요' | '개선 필요'

export type LifeStabilityIndicators = {
  cashflowStatus: LifeStabilityIndicatorLabel
  essentialExpenseStatus: LifeStabilityIndicatorLabel
  medicalPreparednessStatus: LifeStabilityIndicatorLabel
  liquidityStatus: LifeStabilityIndicatorLabel
  debtBurdenStatus: LifeStabilityIndicatorLabel
  riskAssetDependencyStatus: LifeStabilityIndicatorLabel
}

export type LifeStabilityPlanGuardrail = {
  growthPlanAllowed: boolean
  recommendedPlanType: string
  recommendedPlanLabel: string
  reason: string
}

export type LifeStabilityResponse = {
  totalScore: number
  grade: 'STABLE' | 'NEED_COMPLEMENT' | 'NEED_IMPROVEMENT'
  gradeLabel: string
  summaryMessage: string
  metrics: LifeStabilityMetrics
  indicators: LifeStabilityIndicators
  planGuardrail: LifeStabilityPlanGuardrail | null
  improvementMessages: string[]
}
