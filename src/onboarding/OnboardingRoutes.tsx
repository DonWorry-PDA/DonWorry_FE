import { useNavigate } from 'react-router-dom'
import { useOnboarding } from './contexts/OnboardingContext'
import TermsAgree from './components/TermsAgree'
import Step1Situation from './components/steps/Step1Situation'
import Step2Pension from './components/steps/Step2Pension'
import Step3BasicInfo from './components/steps/Step3BasicInfo'
import Step4Living from './components/steps/Step4Living'
import AssetIntro from './components/asset/AssetIntro'
import AssetAuth from './components/asset/AssetAuth'
import AssetConsent from './components/asset/AssetConsent'
import AssetLoading from './components/asset/AssetLoading'
import AssetResult from './components/asset/AssetResult'

export function TermsAgreePage() {
  const navigate = useNavigate()
  return (
    <TermsAgree
      onNext={() => navigate('/onboarding/step1')}
      onPrev={() => navigate(-1)}
    />
  )
}

export function Step1Page() {
  const navigate = useNavigate()
  const { answers, updateAnswers } = useOnboarding()
  return (
    <Step1Situation
      onNext={() => {
        if (answers.situation === 'preparing') {
          updateAnswers({ pensionStatus: 'before' })
          navigate('/onboarding/step3')
        } else {
          navigate('/onboarding/step2')
        }
      }}
      onPrev={() => navigate('/onboarding/terms')}
    />
  )
}

export function Step2Page() {
  const navigate = useNavigate()
  return (
    <Step2Pension
      onNext={() => navigate('/onboarding/step3')}
      onPrev={() => navigate('/onboarding/step1')}
    />
  )
}

export function Step3Page() {
  const navigate = useNavigate()
  const { answers } = useOnboarding()
  return (
    <Step3BasicInfo
      onNext={() => navigate('/onboarding/step4')}
      onPrev={() =>
        navigate(answers.situation === 'retired' ? '/onboarding/step2' : '/onboarding/step1')
      }
    />
  )
}

export function Step4Page() {
  const navigate = useNavigate()
  return (
    <Step4Living
      onNext={() => navigate('/onboarding/asset-intro')}
      onPrev={() => navigate('/onboarding/step3')}
    />
  )
}

export function AssetIntroPage() {
  const navigate = useNavigate()
  return (
    <AssetIntro
      onNext={() => navigate('/onboarding/asset-auth')}
      onPrev={() => navigate('/onboarding/step4')}
    />
  )
}

export function AssetAuthPage() {
  const navigate = useNavigate()
  return (
    <AssetAuth
      onNext={() => navigate('/onboarding/asset-consent')}
      onPrev={() => navigate('/onboarding/asset-intro')}
    />
  )
}

export function AssetConsentPage() {
  const navigate = useNavigate()
  return (
    <AssetConsent
      onNext={() => navigate('/onboarding/asset-loading')}
      onPrev={() => navigate('/onboarding/asset-auth')}
    />
  )
}

export function AssetLoadingPage() {
  const navigate = useNavigate()
  return <AssetLoading onNext={() => navigate('/onboarding/asset-result')} />
}

export function AssetResultPage() {
  return <AssetResult />
}
