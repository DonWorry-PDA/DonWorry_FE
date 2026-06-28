import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
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
    // 설문 미완료(404)는 재시도하지 않고 즉시 error로 노출 — 월급 설계 진입 게이트가 빠르게 판정
    retry: (failureCount, error) =>
      !(isAxiosError(error) && error.response?.status === 404) && failureCount < 3,
  })

export default useGetSurvey
