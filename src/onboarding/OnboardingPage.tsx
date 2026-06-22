// src/onboarding/OnboardingPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingContextProvider } from './contexts/OnboardingContext'
import { useStepNavigation } from './hooks/useStepNavigation'
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

function OnboardingContent() {
  const [currentStep, setCurrentStep] = useState(1)
  const navigate = useNavigate()
  const { getNextStep, getPrevStep } = useStepNavigation()

  function handleNext() {
    setCurrentStep(s => getNextStep(s))
  }

  function handlePrev() {
    if (currentStep === 1) {
      navigate(-1)
      return
    }
    setCurrentStep(s => getPrevStep(s))
  }

  const stepProps = { onNext: handleNext, onPrev: handlePrev }

  return (
    <>
      {currentStep === 1 && <Step1Situation {...stepProps} />}
      {currentStep === 2 && <Step2Pension {...stepProps} />}
      {currentStep === 3 && <Step3BasicInfo {...stepProps} />}
      {currentStep === 4 && <Step4Living {...stepProps} />}
      {currentStep === 5 && <Step5PensionDefer {...stepProps} />}
      {currentStep === 6 && <AssetIntro onNext={handleNext} onPrev={handlePrev} />}
      {currentStep === 7 && <AssetAuth {...stepProps} />}
      {currentStep === 8 && <AssetConsent {...stepProps} />}
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
