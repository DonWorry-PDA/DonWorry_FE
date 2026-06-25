import { useMutation, useQueryClient } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import type { OnboardingAnswers, OnboardingRequest } from '../types/onboarding'

const MAN = 10_000

// FE 입력(만원 단위)을 BE 요청(원 단위)으로 변환한다.
// ⚠️ 만원→원(×10,000) 누락 시 목표 생활비가 1/10로 저장되어 생활비 충당률이
//    10배로 왜곡된다(실제 발생 사례 있음). 반드시 변환할 것.
export const toOnboardingRequest = (answers: OnboardingAnswers): OnboardingRequest => ({
  age: answers.age,
  retired: answers.situation === 'retired',
  nationalPensionReceiving: answers.pensionStatus === 'receiving',
  monthlyTargetLivingCost: (answers.monthlyLiving ?? 0) * MAN,
  monthlyExpectedMedicalCost: (answers.monthlyMedical ?? 0) * MAN,
})

const usePostOnboarding = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: OnboardingRequest) =>
      client
        .post<ApiResponse<unknown>>('/api/user/onboarding/me', body)
        .then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export default usePostOnboarding
