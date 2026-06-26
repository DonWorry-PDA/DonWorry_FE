import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import type { AssetScheduleResponse } from '../types/assetAnalysis'

const useGetAssetSchedule = (months = 2) =>
  useQuery({
    queryKey: ['assetSchedule', months],
    queryFn: () =>
      client
        .get<ApiResponse<AssetScheduleResponse>>(`/api/user/asset/analysis/schedule?months=${months}`)
        .then((res) => res.data.data),
  })

export default useGetAssetSchedule
