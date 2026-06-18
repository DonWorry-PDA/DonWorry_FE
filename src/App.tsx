import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import LoginPage from './login/LoginPage'
import OnboardingPage from './onboarding/OnboardingPage'

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/onboarding" replace /> },
  { path: '/onboarding', element: <OnboardingPage /> },
  { path: '/login', element: <LoginPage /> },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
