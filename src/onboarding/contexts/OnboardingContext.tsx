import { createContext, useContext, useState } from 'react'
import type { OnboardingAnswers } from '../types/onboarding'

type OnboardingContextValue = {
  answers: OnboardingAnswers
  updateAnswers: (partial: Partial<OnboardingAnswers>) => void
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

const INITIAL_ANSWERS: OnboardingAnswers = {
  situation: null,
  pensionStatus: null,
  age: 63,
  retiredYear: 2024,
  monthlyLiving: 220,
  monthlyMedical: 50,
}

export function OnboardingContextProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<OnboardingAnswers>(INITIAL_ANSWERS)

  function updateAnswers(partial: Partial<OnboardingAnswers>) {
    setAnswers(prev => ({ ...prev, ...partial }))
  }

  return (
    <OnboardingContext.Provider value={{ answers, updateAnswers }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingContextProvider')
  return ctx
}
