export type Situation = 'preparing' | 'retired'
export type PensionStatus = 'before' | 'receiving'

export type OnboardingAnswers = {
  situation: Situation | null
  pensionStatus: PensionStatus | null
  age: number | null
  retiredYear: number | null
  monthlyLiving: number | null   // 단위: 만원
  monthlyMedical: number | null  // 단위: 만원
}

// POST /api/user/onboarding/me 요청 (금액은 원 단위)
export type OnboardingRequest = {
  age: number | null
  retired: boolean
  nationalPensionReceiving: boolean
  monthlyTargetLivingCost: number
  monthlyExpectedMedicalCost: number
}
