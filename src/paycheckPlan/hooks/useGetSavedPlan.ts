import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import type { SavedPlanResponse } from '../types/savedPlan'

const useGetSavedPlan = () =>
  useQuery({
    queryKey: ['portfolio', 'saved-plan'],
    queryFn: () =>
      client
        .get<ApiResponse<SavedPlanResponse[]>>('/api/user/portfolio/saved-plan')
        .then((res) => res.data.data),
  })

export default useGetSavedPlan
