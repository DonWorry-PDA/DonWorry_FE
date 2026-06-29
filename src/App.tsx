import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'
import useNotificationSSE from './notification/hooks/useNotificationSSE'
import SplashPage from './splash/SplashPage'
import LoginPage from './login/LoginPage'
import OnboardingPage from './onboarding/OnboardingPage'
import {
  TermsAgreePage,
  Step1Page,
  Step2Page,
  Step3Page,
  Step4Page,
  Step5Page,
  AssetIntroPage,
  AssetAuthPage,
  AssetConsentPage,
  AssetLoadingPage,
  AssetResultPage,
} from './onboarding/OnboardingRoutes'
import AssetConsentDetailPage from './assetConsent/AssetConsentDetailPage'
import MypagePage from './mypage/MypagePage'
import NotificationPage from './notification/NotificationPage'
import NotificationSettingsPage from './notification/NotificationSettingsPage'
import SurveyPage from './survey/SurveyPage'
import PaycheckAssetSelectPage from './paycheckPlan/PaycheckAssetSelectPage'
import PaycheckDiagnosisPage from './paycheckPlan/PaycheckDiagnosisPage'
import PaycheckPlansPage from './paycheckPlan/PaycheckPlansPage'
import PaycheckComparePage from './paycheckPlan/PaycheckComparePage'
import PaycheckPlanDetailPage from './paycheckPlan/PaycheckPlanDetailPage'
import PaycheckPlanStatusPage from './paycheckPlan/PaycheckPlanStatusPage'
import PaycheckExecutePage from './paycheckPlan/PaycheckExecutePage'
import PaycheckConsultPage from './paycheckPlan/PaycheckConsultPage'
import StabilityPage from './stability/StabilityPage'
import HomePage from './home/HomePage'
import InvestmentCheckupPage from './asset/InvestmentCheckupPage'
import MonthlyReportPage from './asset/MonthlyReportPage'
import CalendarPage from './calendar/CalendarPage'
import ConsultHistoryPage from './mypage/ConsultHistoryPage'
import ConsultPrepPage from './mypage/ConsultPrepPage'
import ConsultSummaryPage from './mypage/ConsultSummaryPage'
import AccountConnectPage from './mypage/AccountConnectPage'
import ProfileEditPage from './mypage/ProfileEditPage'
import ConsultModifyPage from './mypage/ConsultModifyPage'
import TermsAgreePage2 from './accountOpen/TermsAgreePage'
import TermsHistoryPage from './mypage/TermsHistoryPage'
import TermsDetailPage from './terms/TermsDetailPage'
import IdentityVerifyPage from './accountOpen/IdentityVerifyPage'
import OtpVerifyPage from './accountOpen/OtpVerifyPage'
import AccountOpenCompletePage from './accountOpen/AccountOpenCompletePage'
import ShinhanCertPage from './accountOpen/ShinhanCertPage'
import PensionDeferPage from './pension/PensionDeferPage'
import OrderProductPage from './order/OrderProductPage'
import OrderTermsPage from './order/OrderTermsPage'
import OrderReviewPage from './order/OrderReviewPage'
import OrderExecutingPage from './order/OrderExecutingPage'
import OrderResultPage from './order/OrderResultPage'
import OrderCompletePage from './order/OrderCompletePage'
import OrderModifyPage from './order/OrderModifyPage'
import OrderConfirmPage from './order/OrderConfirmPage'
import OrderPinPage from './order/OrderPinPage'
import OrderReservedPage from './order/OrderReservedPage'
import OrderTransferPage from './order/OrderTransferPage'
import AssetPage from './asset/AssetPage'
import RetirementSimulationPage from './retirement/RetirementSimulationPage'
import NotFoundPage from './error/NotFoundPage'
import ServerErrorPage from './error/ServerErrorPage'

function AppLayout() {
  useNotificationSSE()
  return <Outlet />
}

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ServerErrorPage />,
    children: [
  { path: '/', element: <SplashPage /> },
  { path: '/login', element: <LoginPage /> },

  // 온보딩 — 공통 컨텍스트(OnboardingContextProvider)를 레이아웃으로 제공
  {
    path: '/onboarding',
    element: <OnboardingPage />,
    children: [
      { index: true, element: <Navigate to="/onboarding/terms" replace /> },
      { path: 'terms', element: <TermsAgreePage /> },
      { path: 'step1', element: <Step1Page /> },
      { path: 'step2', element: <Step2Page /> },
      { path: 'step3', element: <Step3Page /> },
      { path: 'step4', element: <Step4Page /> },
      { path: 'step5', element: <Step5Page /> },
      { path: 'asset-intro', element: <AssetIntroPage /> },
      { path: 'asset-auth', element: <AssetAuthPage /> },
      { path: 'asset-consent', element: <AssetConsentPage /> },
      { path: 'asset-consent/:consentId', element: <AssetConsentDetailPage /> },
      { path: 'asset-loading', element: <AssetLoadingPage /> },
      { path: 'asset-result', element: <AssetResultPage /> },
    ],
  },

  { path: '/survey', element: <SurveyPage /> },
  { path: '/mypage', element: <MypagePage /> },
  { path: '/notification', element: <NotificationPage /> },
  { path: '/notification/settings', element: <NotificationSettingsPage /> },
  { path: '/paycheck-plan/status', element: <PaycheckPlanStatusPage /> },
  { path: '/paycheck-plan/assets', element: <PaycheckAssetSelectPage /> },
  { path: '/paycheck-plan/diagnosis', element: <PaycheckDiagnosisPage /> },
  { path: '/paycheck-plan/plans', element: <PaycheckPlansPage /> },
  { path: '/paycheck-plan/compare', element: <PaycheckComparePage /> },
  { path: '/paycheck-plan/plans/:planId', element: <PaycheckPlanDetailPage /> },
  { path: '/paycheck-plan/execute', element: <PaycheckExecutePage /> },
  { path: '/paycheck-plan/consult', element: <PaycheckConsultPage /> },
  { path: '/home', element: <HomePage /> },
  { path: '/asset', element: <AssetPage /> },
  { path: '/asset/investment-checkup', element: <InvestmentCheckupPage /> },
  { path: '/asset/monthly-report', element: <MonthlyReportPage /> },
  { path: '/stability', element: <StabilityPage /> },
  { path: '/calendar', element: <CalendarPage /> },
  { path: '/mypage/consult-history', element: <ConsultHistoryPage /> },
  { path: '/mypage/consult-history/:id/modify', element: <ConsultModifyPage /> },
  { path: '/mypage/consult-history/:id/prep', element: <ConsultPrepPage /> },
  { path: '/mypage/consult-history/:id/summary', element: <ConsultSummaryPage /> },
  { path: '/mypage/connect-account', element: <AccountConnectPage /> },
  { path: '/mypage/profile-edit', element: <ProfileEditPage /> },
  { path: '/mypage/terms', element: <TermsHistoryPage /> },
  { path: '/terms/:termId', element: <TermsDetailPage /> },
  { path: '/account-open', element: <IdentityVerifyPage /> },
  { path: '/account-open/otp', element: <OtpVerifyPage /> },
  { path: '/account-open/shinhan-cert', element: <ShinhanCertPage /> },
  { path: '/account-open/terms', element: <TermsAgreePage2 /> },
  { path: '/account-open/complete', element: <AccountOpenCompletePage /> },
  { path: '/order/product', element: <OrderProductPage /> },
  { path: '/order/terms', element: <OrderTermsPage /> },
  { path: '/order/review', element: <OrderReviewPage /> },
  { path: '/order/executing', element: <OrderExecutingPage /> },
  { path: '/order/result', element: <OrderResultPage /> },
  { path: '/order/complete', element: <OrderCompletePage /> },
  { path: '/order/modify', element: <OrderModifyPage /> },
  { path: '/order/confirm', element: <OrderConfirmPage /> },
  { path: '/order/pin', element: <OrderPinPage /> },
  { path: '/order/reserved', element: <OrderReservedPage /> },
  { path: '/order/transfer', element: <OrderTransferPage /> },
  { path: '/pension/defer', element: <PensionDeferPage /> },
  { path: '/retirement-simulation', element: <RetirementSimulationPage /> },
  { path: '*', element: <NotFoundPage /> },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
