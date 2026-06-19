// src/onboarding/OnboardingPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingContextProvider } from './contexts/OnboardingContext'
import type { OnboardingAnswers } from './types/onboarding'
import Step1Situation from './components/steps/Step1Situation'
import Step2Pension from './components/steps/Step2Pension'
import Step3BasicInfo from './components/steps/Step3BasicInfo'
import Step4Living from './components/steps/Step4Living'
import Step5PensionDefer from './components/steps/Step5PensionDefer'
import AssetIntro from './components/asset/AssetIntro'
import AssetAuth from './components/asset/AssetAuth'
import AssetConsent from './components/asset/AssetConsent'
import AssetLoading from './components/asset/AssetLoading'
import AssetResult from './components/asset/AssetResult'

function getNextStep(currentStep: number, answers: OnboardingAnswers): number {
  if (currentStep === 4) {
    return answers.pensionStatus === 'before' ? 5 : 6
  }
  return currentStep + 1
}

function getPrevStep(currentStep: number, answers: OnboardingAnswers): number {
  if (currentStep === 6 && answers.pensionStatus !== 'before') {
    return 4
  }
  return currentStep - 1
}

function OnboardingContent() {
  const [currentStep, setCurrentStep] = useState(1)
  const navigate = useNavigate()

  // pensionStatus를 Page 레벨에서 별도 트래킹 (Context는 비동기라 getNextStep에서 바로 못 읽음)
  // Step2Pension이 선택 시 Context + Page 두 군데 모두 업데이트
  const [pensionStatus, setPensionStatus] = useState<'before' | 'receiving' | null>(null)

  function handleNext() {
    const mockAnswers = { pensionStatus } as OnboardingAnswers
    setCurrentStep(s => getNextStep(s, mockAnswers))
  }

  function handlePrev() {
    if (currentStep === 1) {
      navigate(-1)
      return
    }
    const mockAnswers = { pensionStatus } as OnboardingAnswers
    setCurrentStep(s => getPrevStep(s, mockAnswers))
  }

  const stepProps = { onNext: handleNext, onPrev: handlePrev }

  return (
    <>
      {currentStep === 1 && <Step1Situation {...stepProps} />}
      {currentStep === 2 && (
        <Step2Pension
          {...stepProps}
          onPensionStatusChange={setPensionStatus}
        />
      )}
      {currentStep === 3 && <Step3BasicInfo {...stepProps} />}
      {currentStep === 4 && <Step4Living {...stepProps} />}
      {currentStep === 5 && <Step5PensionDefer onNext={handleNext} onPrev={handlePrev} />}
      {currentStep === 6 && <AssetIntro onNext={handleNext} />}
      {currentStep === 7 && <AssetAuth onNext={handleNext} onPrev={handlePrev} />}
      {currentStep === 8 && <AssetConsent onNext={handleNext} onPrev={handlePrev} />}
      {currentStep === 9 && <AssetLoading onNext={handleNext} />}
      {currentStep === 10 && <AssetResult />}
    </>
  )
}

function OnboardingPage() {
  return (
    <OnboardingContextProvider>
      <OnboardingContent />
    </OnboardingContextProvider>
  )
}

export default OnboardingPage
