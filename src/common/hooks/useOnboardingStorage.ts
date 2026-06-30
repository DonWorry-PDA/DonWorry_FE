import { useState, useCallback } from 'react'

export const ONBOARDING_KEYS = {
  homeCoachMark: 'onboarding.homeCoachMark.completed',
} as const

export type OnboardingKey = keyof typeof ONBOARDING_KEYS

export function initOnboarding() {
  try {
    const params = new URLSearchParams(window.location.search)
    if (params.get('resetOnboarding') === '1') {
      Object.values(ONBOARDING_KEYS).forEach((k) => localStorage.removeItem(k))
      params.delete('resetOnboarding')
      const newSearch = params.toString()
      history.replaceState(
        null,
        '',
        window.location.pathname + (newSearch ? '?' + newSearch : '') + window.location.hash,
      )
    }
    if (import.meta.env.DEV) {
      ;(window as unknown as Record<string, unknown>).__resetOnboarding = () => {
        Object.values(ONBOARDING_KEYS).forEach((k) => localStorage.removeItem(k))
        window.location.reload()
      }
    }
  } catch {
    // localStorage 접근 불가 환경(프라이빗 브라우징 등)에서는 무시
  }
}

export function useOnboardingCompleted(key: OnboardingKey) {
  const storageKey = ONBOARDING_KEYS[key]
  const [completed, setCompleted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(storageKey) === 'true'
    } catch {
      return false
    }
  })

  const markCompleted = useCallback(() => {
    try {
      localStorage.setItem(storageKey, 'true')
    } catch {
      // ignore
    }
    setCompleted(true)
  }, [storageKey])

  return { completed, markCompleted }
}
