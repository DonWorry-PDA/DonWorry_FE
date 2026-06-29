import { useMutation, useQueryClient } from '@tanstack/react-query'
import client from '@/common/api/client'
import { SalaryPlanConfirmRequest } from '../types/paycheckPlan'

// 월급 만들기 확정 — 매수 완료 후 plan 스냅샷을 저장(POST)해 기이용자로 전환한다.
// 성공 시 운용현황/자산허브 캐시를 무효화해 hasPlan·hasActivePlan 분기가 즉시 반영되도록 한다.
const usePostSalaryPlanConfirm = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: SalaryPlanConfirmRequest) =>
      client.post('/api/user/monthly-salary/plan', body).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthly-salary', 'plan', 'status'] })
      queryClient.invalidateQueries({ queryKey: ['assetHub'] })
      queryClient.invalidateQueries({ queryKey: ['lifeStability'] })
    },
  })
}

export default usePostSalaryPlanConfirm
