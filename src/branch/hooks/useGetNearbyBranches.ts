import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import type { Institution, NearbyBranch } from '../types/branch'

type Params = {
  lat?: number
  lng?: number
  institution: Institution
  limit?: number
}

/** 좌표가 준비됐을 때만 근처 영업점을 조회한다(거리 오름차순으로 내려옴). */
const useGetNearbyBranches = ({ lat, lng, institution, limit = 20 }: Params) =>
  useQuery({
    queryKey: ['branches', 'nearby', institution, lat, lng, limit],
    queryFn: () =>
      client
        .get<ApiResponse<NearbyBranch[]>>('/api/user/branches/nearby', {
          params: { lat, lng, institution, limit },
        })
        .then((res) => res.data.data),
    enabled: lat != null && lng != null,
  })

export default useGetNearbyBranches
