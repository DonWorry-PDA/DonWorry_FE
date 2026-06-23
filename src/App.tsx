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
import StabilityPage from './stability/StabilityPage'
import HomePage from './home/HomePage'
import CalendarPage from './calendar/CalendarPage'
import ConsultHistoryPage from './mypage/ConsultHistoryPage'
import ConsultPrepPage from './mypage/ConsultPrepPage'
import ConsultSummaryPage from './mypage/ConsultSummaryPage'
import AccountConnectPage from './mypage/AccountConnectPage'
import TermsAgreePage from './accountOpen/TermsAgreePage'
import TermsHistoryPage from './mypage/TermsHistoryPage'
import TermsDetailPage from './terms/TermsDetailPage'
import IdentityVerifyPage from './accountOpen/IdentityVerifyPage'
import AccountOpenCompletePage from './accountOpen/AccountOpenCompletePage'
import OrderProductPage from './order/OrderProductPage'
import OrderTermsPage from './order/OrderTermsPage'
import OrderReviewPage from './order/OrderReviewPage'
import OrderExecutingPage from './order/OrderExecutingPage'
import OrderResultPage from './order/OrderResultPage'
import OrderCompletePage from './order/OrderCompletePage'
import OrderModifyPage from './order/OrderModifyPage'
import OrderConfirmPage from './order/OrderConfirmPage'

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
  { path: '/home', element: <HomePage /> },
  { path: '/stability', element: <StabilityPage /> },
  { path: '/calendar', element: <CalendarPage /> },
  { path: '/mypage/consult-history', element: <ConsultHistoryPage /> },
  { path: '/mypage/consult-history/:id/prep', element: <ConsultPrepPage /> },
  { path: '/mypage/consult-history/:id/summary', element: <ConsultSummaryPage /> },
  { path: '/mypage/connect-account', element: <AccountConnectPage /> },
  { path: '/mypage/terms', element: <TermsHistoryPage /> },
  { path: '/terms/:termId', element: <TermsDetailPage /> },
  { path: '/account-open', element: <TermsAgreePage /> },
  { path: '/account-open/identity', element: <IdentityVerifyPage /> },
  { path: '/account-open/complete', element: <AccountOpenCompletePage /> },
  { path: '/order/product', element: <OrderProductPage /> },
  { path: '/order/terms', element: <OrderTermsPage /> },
  { path: '/order/review', element: <OrderReviewPage /> },
  { path: '/order/executing', element: <OrderExecutingPage /> },
  { path: '/order/result', element: <OrderResultPage /> },
  { path: '/order/complete', element: <OrderCompletePage /> },
  { path: '/order/modify', element: <OrderModifyPage /> },
  { path: '/order/confirm', element: <OrderConfirmPage /> },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
