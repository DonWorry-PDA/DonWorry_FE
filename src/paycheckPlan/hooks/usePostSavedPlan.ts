import { useMutation, useQueryClient } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import type { SavePlanRequest, SavePlanResponse } from '../types/savedPlan'

const usePostSavedPlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: SavePlanRequest) =>
      client
        .post<ApiResponse<SavePlanResponse>>('/api/user/portfolio/saved-plan', body)
        .then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio', 'saved-plan'] })
    },
  })
}

export default usePostSavedPlan
