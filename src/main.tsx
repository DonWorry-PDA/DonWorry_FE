import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

try {
  if (localStorage.getItem('largeFont') === 'true') {
    document.documentElement.classList.add('large')
  }
} catch {
  // localStorage 접근 불가 환경(프라이빗 브라우징 등)에서는 기본값(소글씨)으로 유지
}
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import App from './App.tsx'
import { initOnboarding } from './common/hooks/useOnboardingStorage'

initOnboarding()
import queryClient from './common/api/queryClient'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>,
)
