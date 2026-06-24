import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import type { AssetHubResponse } from '../types/assetHub'

// 자산관리 허브 집계 조회. 홈/자산허브 화면이 공유한다.
const useGetAssetHub = () =>
  useQuery({
    queryKey: ['assetHub'],
    queryFn: () =>
      client
        .get<ApiResponse<AssetHubResponse>>('/api/user/asset/hub')
        .then((res) => res.data.data),
  })

export default useGetAssetHub
