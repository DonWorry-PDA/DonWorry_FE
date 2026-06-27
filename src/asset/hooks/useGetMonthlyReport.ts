import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import type { MonthlyReportResponse } from '../types/monthlyReport'

const useGetMonthlyReport = (month: string) =>
  useQuery({
    queryKey: ['monthlyReport', month],
    queryFn: () =>
      client
        .get<ApiResponse<MonthlyReportResponse>>('/api/user/report/monthly', {
          params: { month },
        })
        .then((res) => res.data.data),
  })

export default useGetMonthlyReport
