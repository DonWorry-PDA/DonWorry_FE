import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import { CalendarResponse } from '../types/calendar'

// month는 1-based(API 규격). 0-based month0를 쓰는 화면은 month0 + 1로 호출한다.
const useGetCalendar = (year: number, month: number) =>
  useQuery({
    queryKey: ['calendar', year, month],
    queryFn: () =>
      client
        .get<ApiResponse<CalendarResponse>>('/api/user/calendar', {
          params: { year, month },
        })
        .then((res) => res.data.data),
  })

export default useGetCalendar
