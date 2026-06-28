import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import { SalaryAssetListResponse } from '../types/paycheckPlan'

const useGetSalaryAssets = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ['monthly-salary', 'assets'],
    queryFn: () =>
      client
        .get<ApiResponse<SalaryAssetListResponse>>('/api/user/monthly-salary/assets')
        .then((res) => res.data.data),
    enabled: options?.enabled ?? true,
  })

export default useGetSalaryAssets
