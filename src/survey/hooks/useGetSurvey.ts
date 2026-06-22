import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import { SurveyResponse } from '../types/survey'

const useGetSurvey = () =>
  useQuery({
    queryKey: ['survey'],
    queryFn: () =>
      client
        .get<ApiResponse<SurveyResponse>>('/api/user/monthly-salary/survey')
        .then((res) => res.data.data),
  })

export default useGetSurvey
