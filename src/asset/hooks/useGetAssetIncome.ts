import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import type { AssetIncomeResponse } from '../types/assetAnalysis'

const useGetAssetIncome = () =>
  useQuery({
    queryKey: ['assetIncome'],
    queryFn: () =>
      client
        .get<ApiResponse<AssetIncomeResponse>>('/api/user/asset/analysis/income')
        .then((res) => res.data.data),
  })

export default useGetAssetIncome
