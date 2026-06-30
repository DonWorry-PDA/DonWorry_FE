import { createContext, useContext, useState } from 'react'
import type { OnboardingAnswers } from '../types/onboarding'
import type { MydataConnectResponse } from '@/asset/types/assetHub'

type OnboardingContextValue = {
  answers: OnboardingAnswers
  updateAnswers: (partial: Partial<OnboardingAnswers>) => void
  connectResult: MydataConnectResponse | null
  setConnectResult: (result: MydataConnectResponse | null) => void
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

const INITIAL_ANSWERS: OnboardingAnswers = {
  situation: null,
  pensionStatus: null,
  age: null,
  retiredYear: null,
  monthlyLiving: null,
  monthlyMedical: null,
}

export function OnboardingContextProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<OnboardingAnswers>(INITIAL_ANSWERS)
  const [connectResult, setConnectResult] = useState<MydataConnectResponse | null>(null)

  function updateAnswers(partial: Partial<OnboardingAnswers>) {
    setAnswers(prev => ({ ...prev, ...partial }))
  }

  return (
    <OnboardingContext.Provider value={{ answers, updateAnswers, connectResult, setConnectResult }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingContextProvider')
  return ctx
}
