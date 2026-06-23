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

// 화면 표시 순서(Figma): 생활비 충당률 · 의료비 대비력 · 유동성 · 필수지출 부담 · 부채 부담률 · 위험자산 의존
const toItems = (i: LifeStabilityResponse['indicators']): StabilityItem[] => [
  { id: 1, label: '생활비 충당률', status: labelToStatus(i.cashflowStatus) },
  { id: 2, label: '의료비 대비력', status: labelToStatus(i.medicalPreparednessStatus) },
  { id: 3, label: '유동성', status: labelToStatus(i.liquidityStatus) },
  { id: 4, label: '필수지출 부담', status: labelToStatus(i.essentialExpenseStatus) },
  { id: 5, label: '부채 부담률', status: labelToStatus(i.debtBurdenStatus) },
  { id: 6, label: '위험자산 의존', status: labelToStatus(i.riskAssetDependencyStatus) },
]

const toStabilityData = (res: LifeStabilityResponse): StabilityData => ({
  percentage: Math.round(res.metrics.cashflowCoverageRate),
  status: gradeToStatus(res.grade),
  summaryMessage: res.summaryMessage,
  tip: res.improvementMessages?.[0] ?? null,
  items: toItems(res.indicators),
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
