import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import { CashFlowDiagnosisResponse } from '../types/paycheckPlan'

const useGetCashFlowDiagnosis = () =>
  useQuery({
    queryKey: ['monthly-salary', 'cash-flow'],
    queryFn: () =>
      client
        .get<ApiResponse<CashFlowDiagnosisResponse>>('/api/user/monthly-salary/cash-flow')
        .then((res) => res.data.data),
  })

export default useGetCashFlowDiagnosis
