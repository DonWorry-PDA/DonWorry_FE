import { useMutation, useQueryClient } from '@tanstack/react-query'
import client from '@/common/api/client'

const usePostMydataInstitutionConnect = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (institutionIds: string[]) => {
      await client.post('/api/user/mydata/connect', { institutionIds })
      await client.post('/api/user/mydata/mock/sync')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mydataInstitutions'] })
      queryClient.invalidateQueries({ queryKey: ['assetHub'] })
      queryClient.invalidateQueries({ queryKey: ['lifeStability'] })
    },
  })
}

export default usePostMydataInstitutionConnect
