import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import LoginPage from './login/LoginPage'
import OnboardingPage from './onboarding/OnboardingPage'
import MypagePage from './mypage/MypagePage'
import NotificationPage from './notification/NotificationPage'

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/onboarding" replace /> },
  { path: '/onboarding', element: <OnboardingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/mypage', element: <MypagePage /> },
  { path: '/notification', element: <NotificationPage /> },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
