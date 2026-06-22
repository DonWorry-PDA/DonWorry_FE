import { useMutation, useQueryClient } from '@tanstack/react-query'
import client from '@/common/api/client'
import { SurveyRequest } from '../types/survey'

const usePostSurvey = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: SurveyRequest) =>
      client.post('/api/user/monthly-salary/survey', body).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['survey'] })
    },
  })
}

export default usePostSurvey
