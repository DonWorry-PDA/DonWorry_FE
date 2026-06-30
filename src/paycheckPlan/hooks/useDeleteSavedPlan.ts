import { useMutation, useQueryClient } from '@tanstack/react-query'
import client from '@/common/api/client'

const useDeleteSavedPlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (planId: number) =>
      client.delete(`/api/user/portfolio/saved-plan/${planId}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', 'saved-plan'] })
    },
  })
}

export default useDeleteSavedPlan
