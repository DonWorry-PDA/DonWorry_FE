import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import type { ApiResponse } from '@/common/types/api'
import type { PensionDeferResponse } from '../types/pensionDefer'
import { RATE_OPTIONS } from '../types/pensionDefer'

const useGetPensionDefer = (deferRate: number, deferYears: number) =>
  useQuery({
    queryKey: ['pension', 'defer', deferRate, deferYears],
    enabled: (RATE_OPTIONS as readonly number[]).includes(deferRate) && deferYears >= 1 && deferYears <= 5,
    queryFn: () =>
      client
        .get<ApiResponse<PensionDeferResponse>>('/api/user/asset/pension-defer', {
          params: { deferRate, deferYears },
        })
        .then((res) => res.data.data),
  })

export default useGetPensionDefer
