import { useMutation, useQueryClient } from '@tanstack/react-query'
import client from '@/common/api/client'
import { SalaryAssetExclusionRequest } from '../types/paycheckPlan'

// 월급 재료 제외 저장(PUT). 성공 시 제외에 의존하는 캐시를 무효화해
// 재설계(제외 변경 후 다시 설계)가 항상 최신 추천·진단을 받도록 한다.
// (staleTime 60초 때문에 무효화 없이는 같은 설계안이 캐시로 재노출됨)
const usePutSalaryAssetExclusions = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: SalaryAssetExclusionRequest) =>
      client
        .put('/api/user/monthly-salary/assets/exclusions', body)
        .then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', 'recommendation'] })
      queryClient.invalidateQueries({ queryKey: ['monthly-salary', 'cash-flow'] })
      queryClient.invalidateQueries({ queryKey: ['monthly-salary', 'assets'] })
    },
  })
}

export default usePutSalaryAssetExclusions
