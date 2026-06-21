import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SplashPage from './splash/SplashPage'
import LoginPage from './login/LoginPage'
import OnboardingPage from './onboarding/OnboardingPage'
import MypagePage from './mypage/MypagePage'
import NotificationPage from './notification/NotificationPage'
import NotificationSettingsPage from './notification/NotificationSettingsPage'
import SurveyPage from './survey/SurveyPage'
import PaycheckAssetSelectPage from './paycheckPlan/PaycheckAssetSelectPage'
import PaycheckDiagnosisPage from './paycheckPlan/PaycheckDiagnosisPage'
import PaycheckPlansPage from './paycheckPlan/PaycheckPlansPage'
import PaycheckComparePage from './paycheckPlan/PaycheckComparePage'
import PaycheckPlanDetailPage from './paycheckPlan/PaycheckPlanDetailPage'
import PaycheckExecutePage from './paycheckPlan/PaycheckExecutePage'
import PaycheckConsultPage from './paycheckPlan/PaycheckConsultPage'
import ConsultHistoryPage from './mypage/ConsultHistoryPage'
import TermsAgreePage from './accountOpen/TermsAgreePage'
import IdentityVerifyPage from './accountOpen/IdentityVerifyPage'
import AccountOpenCompletePage from './accountOpen/AccountOpenCompletePage'

const router = createBrowserRouter([
  { path: '/', element: <SplashPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/onboarding', element: <OnboardingPage /> },
  { path: '/survey', element: <SurveyPage /> },
  { path: '/mypage', element: <MypagePage /> },
  { path: '/notification', element: <NotificationPage /> },
  { path: '/notification/settings', element: <NotificationSettingsPage /> },
  { path: '/paycheck-plan/assets', element: <PaycheckAssetSelectPage /> },
  { path: '/paycheck-plan/diagnosis', element: <PaycheckDiagnosisPage /> },
  { path: '/paycheck-plan/plans', element: <PaycheckPlansPage /> },
  { path: '/paycheck-plan/compare', element: <PaycheckComparePage /> },
  { path: '/paycheck-plan/plans/:planId', element: <PaycheckPlanDetailPage /> },
  { path: '/paycheck-plan/execute', element: <PaycheckExecutePage /> },
  { path: '/paycheck-plan/consult', element: <PaycheckConsultPage /> },
  { path: '/mypage/consult-history', element: <ConsultHistoryPage /> },
  { path: '/account-open', element: <TermsAgreePage /> },
  { path: '/account-open/identity', element: <IdentityVerifyPage /> },
  { path: '/account-open/complete', element: <AccountOpenCompletePage /> },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
