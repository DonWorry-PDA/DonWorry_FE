import { Outlet } from 'react-router-dom'
import { OnboardingContextProvider } from './contexts/OnboardingContext'

function OnboardingPage() {
  return (
    <OnboardingContextProvider>
      <Outlet />
    </OnboardingContextProvider>
  )
}

export default OnboardingPage
