import type {
  Plan,
  PlanType,
  PlanStatus,
  AllocationItem,
  PlanDetail,
  ComparisonTable,
  ExecutionSummary,
  ExecutionItem,
  SalaryPlanConfirmRequest,
} from '../types/paycheckPlan'
import type {
  BackendPlanType,
  RecommendationPlan,
  RecommendationResponse,
} from '../types/recommendation'
import type { SavePlanRequest } from '../types/savedPlan'

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
  LIQUIDITY: '낮음', // 위험자산 비중 LIQUIDITY(25%) < STABLE(32%) < BALANCED(42%)
}

const RISK_DESC: Record<BackendPlanType, string> = {
  STABLE: '환위험 없는 배당주 중심',
  BALANCED: '국내외 배당주 혼합',
  LIQUIDITY: '비상금 먼저 떼두고 운용',
}

// LIQUIDITY(25%) < STABLE(32%) < BALANCED(42%) — BE RISK_WEIGHT 기준
const RISK_SCORE: Record<BackendPlanType, 1 | 2 | 3> = {
  LIQUIDITY: 1,
  STABLE: 2,
  BALANCED: 3,
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
  incrementalIncome: toManwon(plan.incrementalMonthlyIncome),
  coverage: roundCoverage(plan.alphaCoverageRate),
  riskLevel: RISK_LEVEL[plan.type],
  riskScore: RISK_SCORE[plan.type],
  riskDesc: RISK_DESC[plan.type],
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

const DETAIL_NOTICE =
  '월급이 보장되는 건 아니에요. 분배금·배당이 줄면 알림으로 알려드리고, 다시 조정하도록 도와드려요.'

export const mapPlanDetail = (response: RecommendationResponse, plan: RecommendationPlan): PlanDetail => {
  const type = TYPE_MAP[plan.type]
  const expected = toManwon(plan.monthlyIncome)
  const principal = toManwon(plan.allocations.reduce((sum, a) => sum + a.amount, 0))
  return {
    planId: type,
    planName: plan.displayName,
    expectedMonthlyIncome: expected, // BE (N: 전체 월수령)
    currentCashFlow: toManwon(response.currentMonthlyCashFlow), // BE (M: before)
    incrementalIncome: toManwon(plan.incrementalMonthlyIncome), // BE (순증분 = N−M)
    inheritance: toManwon(plan.inheritanceAmount), // BE
    sustainableCoverage: roundCoverage(plan.sustainableCoverageRate), // BE
    afterTaxIncome: Math.round(expected * 0.96), // TODO(static): 세후 미제공 — 임시 96% 추정
    coverageFrom: Math.min(100, Math.round(response.currentCoverageRate)), // BE
    coverageTo: Math.min(100, Math.round(plan.totalCoverageRate)), // BE
    shortfallFrom: toManwon(response.currentMonthlyShortfall), // BE
    shortfallTo: toManwon(plan.residualMonthlyShortfall), // BE
    allocations: mapAllocations(plan), // BE
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
  const leftInc = toManwon(left.incrementalMonthlyIncome)
  const rightInc = toManwon(right.incrementalMonthlyIncome)
  const fmtInc = (v: number) => (v > 0 ? `+${v.toLocaleString('ko-KR')}만원` : '늘지 않음')
  return {
    leftPlanId: TYPE_MAP[left.type],
    rightPlanId: TYPE_MAP[right.type],
    leftPlanName: left.displayName,
    rightPlanName: right.displayName,
    rows: [
      { label: '늘어나는 월급', left: fmtInc(leftInc), right: fmtInc(rightInc) }, // BE (순증분, 핵심)
      { label: '전체 월수입', left: `${leftIncome.toLocaleString('ko-KR')}만원`, right: `${rightIncome.toLocaleString('ko-KR')}만원` }, // BE (국민연금+배당 포함 N)
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

const EXECUTE_NOTICE_OPEN = '주문은 장중에 시장가로 체결돼요. 지금은 거래 시간이라 바로 진행됩니다.'
const EXECUTE_NOTICE_CLOSED = '주문은 장중에 시장가로 체결돼요. 지금은 장 외 시간이라 장이 열리면 자동으로 진행돼요.'

/** 평일 09:00–15:30 KST 여부만 확인 (공휴일 제외). */
const isMarketOpen = (): boolean => {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
  const day = now.getDay()
  if (day === 0 || day === 6) return false
  const minutes = now.getHours() * 60 + now.getMinutes()
  return minutes >= 9 * 60 && minutes < 15 * 60 + 30
}

const HOLDING_ROLE_DESC: Record<string, string> = {
  SAFE: '이자·분배금으로 안정적 수입을 만들어요',
  RISK: '배당·분배금으로 월급을 만들어요',
  SHORT_TERM: '단기 유동성을 확보해요',
}

const mapExecutionItems = (plan: RecommendationPlan): ExecutionItem[] =>
  plan.holdings.map((h, i) => ({
    id: String(i + 1),
    action: 'buy' as const,
    name: `${h.productName} 사기`,
    description: HOLDING_ROLE_DESC[h.role] ?? '',
    amount: toManwon(h.amount),
    productId: h.productId,
    ticker: h.ticker,
    productName: h.productName,
  }))

/** 실행 요약 화면용 매핑. estimatedFee는 BE 미제공 — 호출부에서 static으로 주입한다. */
export const mapExecutionSummary = (
  response: RecommendationResponse,
  plan: RecommendationPlan,
): Omit<ExecutionSummary, 'estimatedFee'> => ({
  planName: plan.displayName,
  planType: TYPE_MAP[plan.type],
  coverageFrom: Math.round(response.currentCoverageRate),
  coverageTo: Math.min(100, Math.round(plan.totalCoverageRate)),
  cashflowFrom: toManwon(response.currentMonthlyCashFlow),
  cashflowTo: toManwon(plan.monthlyIncome),
  items: mapExecutionItems(plan),
  notice: isMarketOpen() ? EXECUTE_NOTICE_OPEN : EXECUTE_NOTICE_CLOSED,
})

/**
 * 매수 완료 후 확정(POST) 페이로드. 추천 plan/holdings를 그대로 스냅샷한다.
 * 금액은 원 단위 정수로 반올림(BE 컬럼 scale=0, @Digits(fraction=0) 검증). bucketRole=holding.role,
 * productContribution=종목별 월기여(BE #238). accountType은 추천 holding 범위인 BROKERAGE 고정.
 */
export const buildSalaryPlanConfirm = (
  response: RecommendationResponse,
  plan: RecommendationPlan,
): SalaryPlanConfirmRequest => ({
  planType: plan.type,
  targetMonthlyLivingCost: Math.round(response.targetMonthlyLivingCost),
  expectedMonthlySalary: Math.round(plan.monthlyIncome),
  holdings: plan.holdings.map((h) => ({
    productId: h.productId,
    productName: h.productName,
    bucketRole: h.role,
    accountType: 'BROKERAGE',
    weight: h.weight,
    targetAmount: Math.round(h.amount),
    productContribution: Math.round(h.monthlyContribution),
  })),
})

export const buildSavePlanRequest = (
  response: RecommendationResponse,
  plan: RecommendationPlan,
): SavePlanRequest => ({
  planType: plan.type,
  monthlyIncome: Math.round(plan.monthlyIncome),
  currentCoverageRate: response.currentCoverageRate,
  totalCoverageRate: plan.totalCoverageRate,
  currentMonthlyShortfall: Math.round(response.currentMonthlyShortfall),
  residualMonthlyShortfall: Math.round(plan.residualMonthlyShortfall),
  principalAmount: Math.round(plan.allocations.reduce((sum, a) => sum + a.amount, 0)),
  holdings: plan.holdings.map((h) => ({
    productId: h.productId,
    ticker: h.ticker,
    productName: h.productName,
    weight: h.weight,
    targetAmount: Math.round(h.amount),
  })),
})

/** Q3 소진비율 라벨 (안정안 기준 상속 vs 소비 트레이드오프). */
export const Q3_LABELS: Record<number, string> = {
  0: '상속 우선',
  1: '반반',
  2: '소비 우선',
}
