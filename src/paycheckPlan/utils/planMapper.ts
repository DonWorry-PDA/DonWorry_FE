import type {
  Plan,
  PlanType,
  PlanStatus,
  AllocationItem,
  PlanDetail,
  ComparisonTable,
  ExecutionSummary,
} from '../types/paycheckPlan'
import type {
  BackendPlanType,
  RecommendationPlan,
  RecommendationResponse,
} from '../types/recommendation'

// BE 응답 → 기존 화면 뷰 타입 변환. 파생 로직은 BE(#83)가 끝냈으므로 여기선 표기 변환만 한다.
//
// ⚠️ BE 미제공 필드(세후 실수령·충당 시작점·부족분 range·국민연금 분리 월급)는
//    static placeholder로 채운다(TODO 표시). BE 응답 확장 시 제거할 것.

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

const ALLOCATION_COLORS = ['#0046FF', '#4A90E2', '#A8C4F0', '#D6E4FF', '#6BA3E8', '#C2D6F5']

/** 원 → 만원(반올림). 화면은 만원 단위 표기. */
export const toManwon = (won: number) => Math.round(won / 10000)

/** BE PlanType → FE planId/type (라우팅 키로도 사용). */
export const toPlanType = (type: BackendPlanType): PlanType => TYPE_MAP[type]

const toStatus = (status: RecommendationPlan['status']): PlanStatus =>
  status === 'RECOMMENDED' ? 'recommended' : 'available'

/** 충당률 표기. 이미 %(100캡). 연금초과(null)는 충당 개념이 무의미하므로 호출부에서 분기. */
const roundCoverage = (rate: number | null): number | null =>
  rate === null ? null : Math.round(rate)

export const mapPlan = (plan: RecommendationPlan): Plan => ({
  planId: TYPE_MAP[plan.type],
  type: TYPE_MAP[plan.type],
  name: plan.displayName,
  tagline: plan.description,
  badge: plan.status === 'RECOMMENDED' ? '추천' : undefined,
  status: toStatus(plan.status),
  expectedIncome: toManwon(plan.monthlyIncome),
  coverage: roundCoverage(plan.alphaCoverageRate),
  riskLevel: RISK_LEVEL[plan.type],
})

export const mapPlans = (response: RecommendationResponse): Plan[] => response.plans.map(mapPlan)

/** planId(=FE type)로 응답에서 해당 안을 찾는다. 상세/비교가 같은 캐시를 공유. */
export const findPlan = (
  response: RecommendationResponse,
  planId: string,
): RecommendationPlan | undefined => response.plans.find((p) => TYPE_MAP[p.type] === planId)

const mapAllocations = (plan: RecommendationPlan): AllocationItem[] =>
  plan.allocations.map((item, index) => ({
    label: item.label,
    ratio: Math.round(item.ratio),
    detail: `${toManwon(item.amount).toLocaleString('ko-KR')}만원`,
    color: ALLOCATION_COLORS[index % ALLOCATION_COLORS.length],
  }))

// ── BE 미제공 필드용 static placeholder. TODO: BE 확장 시 제거 ──
const DETAIL_PLACEHOLDER: Record<PlanType, { operationIncome: number }> = {
  stable: { operationIncome: 50 },
  balanced: { operationIncome: 65 },
  growth: { operationIncome: 75 },
}
const DETAIL_NOTICE =
  '월급이 보장되는 건 아니에요. 분배금·배당이 줄면 알림으로 알려드리고, 다시 조정하도록 도와드려요.'

export const mapPlanDetail = (response: RecommendationResponse, plan: RecommendationPlan): PlanDetail => {
  const type = TYPE_MAP[plan.type]
  const expected = toManwon(plan.monthlyIncome)
  const placeholder = DETAIL_PLACEHOLDER[type]
  const principal = toManwon(plan.allocations.reduce((sum, a) => sum + a.amount, 0))
  return {
    planId: type,
    planName: plan.displayName,
    expectedMonthlyIncome: expected, // BE
    afterTaxIncome: Math.round(expected * 0.96), // TODO(static): 세후 미제공 — 임시 96% 추정
    coverageFrom: Math.round(response.currentCoverageRate), // BE
    coverageTo: Math.min(100, Math.round(plan.totalCoverageRate)), // BE
    shortfallFrom: toManwon(response.currentMonthlyShortfall), // BE
    shortfallTo: toManwon(plan.residualMonthlyShortfall), // BE
    allocations: mapAllocations(plan), // BE
    monthlyIncome: placeholder.operationIncome, // TODO(static): 국민연금 분리 미제공
    principalValue: principal, // BE (운용자산 합)
    notice: DETAIL_NOTICE,
  }
}

// ── 비교표 ──
const COMPARE_NOTICE =
  '월급(분배금·배당)은 약속된 금액이 아니에요. 시장에 따라 달라질 수 있고, 줄어들면 미리 알려드려요.'

const fmtCoverage = (rate: number | null) => {
  const c = roundCoverage(rate)
  return c === null ? '충분' : `${c}%`
}

/** 앞의 두 안을 좌/우로 비교. 안이 2개 미만이면 비교 불가(null). */
export const mapComparison = (response: RecommendationResponse): ComparisonTable | null => {
  if (response.plans.length < 2) return null
  const [left, right] = response.plans
  const leftIncome = toManwon(left.monthlyIncome)
  const rightIncome = toManwon(right.monthlyIncome)
  return {
    leftPlanId: TYPE_MAP[left.type],
    rightPlanId: TYPE_MAP[right.type],
    leftPlanName: left.displayName,
    rightPlanName: right.displayName,
    rows: [
      { label: '예상 월수입', left: `${leftIncome.toLocaleString('ko-KR')}만원`, right: `${rightIncome.toLocaleString('ko-KR')}만원` }, // BE
      { label: '생활비 충당', left: fmtCoverage(left.alphaCoverageRate), right: fmtCoverage(right.alphaCoverageRate) }, // BE
      // ── 이하 BE 미제공 — static placeholder (TODO: BE 확장/협의) ──
      { label: '세후 실수령', left: `${Math.round(leftIncome * 0.96).toLocaleString('ko-KR')}만원`, right: `${Math.round(rightIncome * 0.96).toLocaleString('ko-KR')}만원` },
      { label: '시장이 10% 내리면', left: '월급 그대로', right: '월급 변동 가능' },
      { label: '중도 해지', left: '일부 만기 제약', right: '언제든 가능' },
      { label: '수수료 (연)', left: '협의 예정', right: '협의 예정' },
    ],
    notice: COMPARE_NOTICE,
  }
}

const EXECUTE_NOTICE = '주문은 장중에 시장가로 체결돼요. 지금은 거래 시간이라 바로 진행됩니다.'

/** 실행 요약 화면용 매핑. items·estimatedFee는 BE 미제공 — 호출부에서 static으로 주입한다. */
export const mapExecutionSummary = (
  response: RecommendationResponse,
  plan: RecommendationPlan,
): Omit<ExecutionSummary, 'items' | 'estimatedFee'> => ({
  planName: plan.displayName,
  planType: TYPE_MAP[plan.type],
  coverageFrom: Math.round(response.currentCoverageRate),
  coverageTo: Math.min(100, Math.round(plan.totalCoverageRate)),
  cashflowFrom: toManwon(response.currentMonthlyCashFlow),
  cashflowTo: toManwon(plan.monthlyIncome),
  notice: EXECUTE_NOTICE,
})

/** Q3 소진비율 라벨 (안정안 기준 상속 vs 소비 트레이드오프). */
export const Q3_LABELS: Record<number, string> = {
  0: '상속 우선',
  1: '반반',
  2: '소비 우선',
}
