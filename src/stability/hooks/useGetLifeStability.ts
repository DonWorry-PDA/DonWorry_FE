import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import type {
  LifeStabilityResponse,
  StabilityData,
  StabilityItem,
  StabilityStatus,
} from '../types/stability'

const gradeToStatus = (grade: LifeStabilityResponse['grade']): StabilityStatus => {
  if (grade === 'STABLE') return 'stable'
  if (grade === 'NEED_COMPLEMENT') return 'warning'
  return 'danger'
}

const labelToStatus = (label: string): StabilityStatus => {
  if (label === '안정') return 'stable'
  if (label === '보완 필요') return 'warning'
  return 'danger'
}

// BigDecimal → number 직렬화 값을 표시용으로 포맷
const formatPercent = (v: number): string => `${Math.round(v)}%`
const formatMonths = (v: number): string =>
  `${Number.isInteger(v) ? v : v.toFixed(1)}개월`

// 화면 표시 순서(Figma): 생활비 충당률 · 의료비 대비력 · 유동성 · 필수지출 부담 · 부채 부담률 · 위험자산 의존
const toItems = (res: LifeStabilityResponse): StabilityItem[] => {
  const { metrics: m, indicators: i } = res
  return [
    {
      id: 1,
      label: '생활비 충당률',
      status: labelToStatus(i.cashflowStatus),
      value: formatPercent(m.cashflowCoverageRate),
      description: '월 확보 수입이 목표 생활비를 얼마나 충당하는지 (100% 이상 권장)',
    },
    {
      id: 2,
      label: '의료비 대비력',
      status: labelToStatus(i.medicalPreparednessStatus),
      value: formatMonths(m.medicalPreparednessMonths),
      description: '예상 의료비 대비 준비 자금 (12개월분 이상 권장)',
    },
    {
      id: 3,
      label: '유동성',
      status: labelToStatus(i.liquidityStatus),
      value: formatMonths(m.liquidityMonths),
      description: '필수지출 기준 즉시 인출 가능한 개월 수 (6개월분 이상 권장)',
    },
    {
      id: 4,
      label: '필수지출 부담',
      status: labelToStatus(i.essentialExpenseStatus),
      value: formatPercent(m.essentialExpenseRate),
      description: '수입 대비 필수지출 비중 (낮을수록 안정적)',
    },
    {
      id: 5,
      label: '부채 부담률',
      status: labelToStatus(i.debtBurdenStatus),
      value: formatPercent(m.debtBurdenRate),
      description: '월 소득 대비 대출 상환 부담 (20% 이하 권장)',
    },
    {
      id: 6,
      label: '위험자산 의존',
      status: labelToStatus(i.riskAssetDependencyStatus),
      value: formatPercent(m.riskAssetDependencyRate),
      description: '생활비의 위험자산 의존도 (20% 이하 권장)',
    },
  ]
}

const toStabilityData = (res: LifeStabilityResponse): StabilityData => ({
  percentage: Math.round(res.metrics.cashflowCoverageRate),
  status: gradeToStatus(res.grade),
  summaryMessage: res.summaryMessage,
  items: toItems(res),
  improvementMessages: res.improvementMessages ?? [],
  guardrail: res.planGuardrail
    ? {
        growthPlanAllowed: res.planGuardrail.growthPlanAllowed,
        recommendedPlanLabel: res.planGuardrail.recommendedPlanLabel,
        reason: res.planGuardrail.reason,
      }
    : null,
})

const useGetLifeStability = () =>
  useQuery({
    queryKey: ['lifeStability'],
    queryFn: () =>
      client
        .get<ApiResponse<LifeStabilityResponse>>('/api/user/life-stability/me')
        .then((res) => res.data.data),
    select: toStabilityData,
  })

export default useGetLifeStability
