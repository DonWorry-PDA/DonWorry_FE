import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import type { AssetPensionResponse } from '../types/assetAnalysis'

const useGetAssetPension = () =>
  useQuery({
    queryKey: ['assetPension'],
    queryFn: () =>
      client
        .get<ApiResponse<AssetPensionResponse>>('/api/user/asset/analysis/pension')
        .then((res) => res.data.data),
  })

export default useGetAssetPension
