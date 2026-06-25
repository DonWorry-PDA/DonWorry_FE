import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import type { ApiResponse } from '@/common/types/api'
import type { UserProfile } from '../types/mypage'

const useGetProfile = () =>
  useQuery({
    queryKey: ['profile'],
    queryFn: () =>
      client.get<ApiResponse<UserProfile>>('/api/user/profile').then((res) => res.data.data),
  })

export default useGetProfile
