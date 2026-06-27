import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import { SalaryPlanStatusResponse } from '../types/paycheckPlan'

// 월급 만들기 기이용자 분기 — 현재 운용 현황 조회.
// hasPlan=false면 ACTIVE 확정안이 없는 것 → 호출부에서 최초 진입(자산 선택)으로 라우팅.
const useGetSalaryPlanStatus = () =>
  useQuery({
    queryKey: ['monthly-salary', 'plan', 'status'],
    queryFn: () =>
      client
        .get<ApiResponse<SalaryPlanStatusResponse>>('/api/user/monthly-salary/plan')
        .then((res) => res.data.data),
  })

export default useGetSalaryPlanStatus
