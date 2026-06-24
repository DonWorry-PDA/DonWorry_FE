import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import type { ApiResponse } from '@/common/types/api'
import type { SimParams } from '../types/simulation'

interface RetirementSimParamsDto {
  ageYears: number | null
  totalAssetsKrw: number
  monthlyLivingKrw: number
  monthlyPensionKrw: number
}

const useGetRetirementSimParams = () =>
  useQuery({
    queryKey: ['retirementSimParams'],
    queryFn: () =>
      client
        .get<ApiResponse<RetirementSimParamsDto>>('/api/user/retirement-simulation/params')
        .then((res) => res.data.data),
    select: (dto): SimParams => ({
      ageYears: dto.ageYears ?? 0,
      totalAssetsKrw: dto.totalAssetsKrw,
      monthlyLivingKrw: dto.monthlyLivingKrw,
      monthlyPensionKrw: dto.monthlyPensionKrw,
    }),
  })

export default useGetRetirementSimParams
