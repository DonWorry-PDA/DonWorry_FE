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
      meaning:
        '연금·이자·배당처럼 매달 확보되는 수입으로 목표 생활비를 얼마나 충당할 수 있는지 보여줘요. 100%면 생활비 전부를 현금흐름으로 충당할 수 있다는 뜻이에요.',
      criteria: '100% 이상',
      improve: '연금 수령 시기 조정이나 배당형 자산 비중 확대로 매달 들어오는 수입을 늘려 보세요.',
    },
    {
      id: 2,
      label: '의료비 대비력',
      status: labelToStatus(i.medicalPreparednessStatus),
      value: formatMonths(m.medicalPreparednessMonths),
      meaning:
        '예상되는 의료비에 대비해 준비된 자금이 몇 개월분인지 보여줘요. 길수록 갑작스러운 의료 지출에 안정적으로 대응할 수 있어요.',
      criteria: '12개월분 이상',
      improve: '보장성 보험이나 비상 예비자금을 더 확보해 의료비 대비력을 높여 보세요.',
    },
    {
      id: 3,
      label: '유동성',
      status: labelToStatus(i.liquidityStatus),
      value: formatMonths(m.liquidityMonths),
      meaning:
        '필수지출을 기준으로, 바로 꺼내 쓸 수 있는 자산이 몇 개월분인지 보여줘요. 비상시 생활을 버틸 수 있는 여력을 뜻해요.',
      criteria: '6개월분 이상',
      improve: '예적금·입출금처럼 즉시 인출 가능한 자산을 6개월치 이상 확보해 보세요.',
    },
    {
      id: 4,
      label: '필수지출 부담',
      status: labelToStatus(i.essentialExpenseStatus),
      value: formatPercent(m.essentialExpenseRate),
      meaning:
        '전체 수입 대비 주거·식비·통신 등 꼭 필요한 지출이 차지하는 비중이에요. 낮을수록 여유 자금을 만들기 쉬워요.',
      criteria: '낮을수록 안정적',
      improve: '고정 지출(주거·통신 등)을 점검해 필수지출 비중을 낮춰 보세요.',
    },
    {
      id: 5,
      label: '부채 부담률',
      status: labelToStatus(i.debtBurdenStatus),
      value: formatPercent(m.debtBurdenRate),
      meaning:
        '월 소득 대비 대출 원리금 상환이 차지하는 비중이에요. 높을수록 현금흐름이 대출 상환에 묶여 생활이 빠듯해져요.',
      criteria: '20% 이하',
      improve: '고금리 대출부터 상환해 월 상환 부담을 20% 이하로 낮추는 것이 좋아요.',
    },
    {
      id: 6,
      label: '위험자산 의존',
      status: labelToStatus(i.riskAssetDependencyStatus),
      value: formatPercent(m.riskAssetDependencyRate),
      meaning:
        '생활비 재원을 주식 등 가격 변동이 큰 위험자산에 얼마나 의존하는지 보여줘요. 높으면 시장 하락 시 생활비가 흔들릴 수 있어요.',
      criteria: '20% 이하',
      improve: '생활비 재원을 위험자산보다 안정적인 현금흐름 자산으로 옮겨 보세요.',
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
