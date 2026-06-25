import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import type { InvestmentCheckResponse } from '../types/investmentCheck'

// 투자 건강검진 상세 조회. 자산을 4역할로 분해하고 개별주 성장 블록을 반환한다.
const useGetInvestmentCheck = () =>
  useQuery({
    queryKey: ['investmentCheck'],
    queryFn: () =>
      client
        .get<ApiResponse<InvestmentCheckResponse>>('/api/user/asset/investment-check')
        .then((res) => res.data.data),
  })

export default useGetInvestmentCheck
