import type { Plan, PlanType, PlanStatus } from '../types/paycheckPlan'
import type { BackendPlanType, RecommendationPlan, RecommendationResponse } from '../types/recommendation'

// BE 응답 → 기존 화면 뷰 타입(Plan) 변환. 파생 로직은 BE(#83)가 끝냈으므로 여기선 표기 변환만 한다.

const TYPE_MAP: Record<BackendPlanType, PlanType> = {
  STABLE: 'stable',
  BALANCED: 'balanced',
  LIQUIDITY: 'growth',
}

const RISK_LEVEL: Record<BackendPlanType, Plan['riskLevel']> = {
  STABLE: '낮음',
  BALANCED: '중간',
  LIQUIDITY: '높음',
}

/** 원 → 만원(반올림). 화면은 만원 단위 표기. */
export const toManwon = (won: number) => Math.round(won / 10000)

/** BE PlanType → FE planId/type (라우팅 키로도 사용). */
export const toPlanType = (type: BackendPlanType): PlanType => TYPE_MAP[type]

const toStatus = (status: RecommendationPlan['status']): PlanStatus =>
  status === 'RECOMMENDED' ? 'recommended' : 'available'

export const mapPlan = (plan: RecommendationPlan): Plan => ({
  planId: TYPE_MAP[plan.type],
  type: TYPE_MAP[plan.type],
  name: plan.displayName,
  tagline: plan.description,
  badge: plan.status === 'RECOMMENDED' ? '추천' : undefined,
  status: toStatus(plan.status),
  expectedIncome: toManwon(plan.monthlyIncome),
  // alphaCoverageRate는 이미 %(100캡). 연금초과(null)는 충당 개념이 무의미하므로 null로 흘려보낸다.
  coverage: plan.alphaCoverageRate === null ? null : Math.round(plan.alphaCoverageRate),
  riskLevel: RISK_LEVEL[plan.type],
})

export const mapPlans = (response: RecommendationResponse): Plan[] => response.plans.map(mapPlan)
