import { useMutation, useQueryClient } from '@tanstack/react-query'
import client from '@/common/api/client'
import type { ApiResponse } from '@/common/types/api'
import type { UserProfile } from '../types/mypage'

export type PatchProfileRequest = {
  age: number
  status: string
  pensionStatus: string
  monthlyTargetKrw: number
}

const usePatchProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: PatchProfileRequest) =>
      client
        .patch<ApiResponse<UserProfile>>('/api/user/profile', body)
        .then((res) => res.data.data),
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data)
      queryClient.invalidateQueries({ queryKey: ['lifeStability'] })
    },
  })
}

export default usePatchProfile
