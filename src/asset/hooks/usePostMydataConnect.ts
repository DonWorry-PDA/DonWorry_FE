import { useMutation, useQueryClient } from '@tanstack/react-query'
import client from '@/common/api/client'

// 마이데이터 최초 연결(시연용 목업). 자산 시드 + 생활안정도 자동 재계산(#122)이 수행된다.
// 연결 후 자산허브/생활안정도 캐시를 무효화해 홈·자산허브가 최신 데이터로 갱신되게 한다.
const usePostMydataConnect = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      client.post('/api/user/mydata/mock/connect').then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assetHub'] })
      queryClient.invalidateQueries({ queryKey: ['lifeStability'] })
    },
  })
}

export default usePostMydataConnect
