import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import type { AssetCompositionResponse } from '../types/assetAnalysis'

const useGetAssetComposition = () =>
  useQuery({
    queryKey: ['assetComposition'],
    queryFn: () =>
      client
        .get<ApiResponse<AssetCompositionResponse>>('/api/user/asset/analysis/composition')
        .then((res) => res.data.data),
  })

export default useGetAssetComposition
