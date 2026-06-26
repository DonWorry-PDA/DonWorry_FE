import { useMutation, useQueryClient } from '@tanstack/react-query'
import client from '@/common/api/client'

const usePostMydataInstitutionConnect = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (institutionIds: string[]) => {
      await client.post('/api/user/mydata/connect', { institutionIds })
      // sync는 mock 데이터 보정 단계 — 실패해도 연결 성공에 영향 없음
      try {
        await client.post('/api/user/mydata/mock/sync')
      } catch {}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mydataInstitutions'] })
      queryClient.invalidateQueries({ queryKey: ['assetHub'] })
      queryClient.invalidateQueries({ queryKey: ['lifeStability'] })
    },
  })
}

export default usePostMydataInstitutionConnect
