export type StabilityStatus = 'stable' | 'warning' | 'danger'

export type StabilityItem = {
  id: number
  label: string
  status: StabilityStatus
}

/** 화면에서 사용하는 뷰 모델 (API 응답을 가공한 결과) */
export type StabilityData = {
  percentage: number
  status: StabilityStatus
  summaryMessage: string
  tip: string | null
  items: StabilityItem[]
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

export type LifeStabilityResponse = {
  totalScore: number
  grade: 'STABLE' | 'NEED_COMPLEMENT' | 'NEED_IMPROVEMENT'
  gradeLabel: string
  summaryMessage: string
  metrics: LifeStabilityMetrics
  indicators: LifeStabilityIndicators
  improvementMessages: string[]
}
