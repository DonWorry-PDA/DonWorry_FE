import { useOnboarding } from '../contexts/OnboardingContext'

export function useStepNavigation() {
  const { answers } = useOnboarding()

  function getNextStep(currentStep: number): number {
    if (currentStep === 4) {
      return answers.pensionStatus === 'before' ? 5 : 6
    }
    return currentStep + 1
  }

  function getPrevStep(currentStep: number): number {
    if (currentStep === 6 && answers.pensionStatus !== 'before') {
      return 4
    }
    return currentStep - 1
  }

  return { getNextStep, getPrevStep }
}
