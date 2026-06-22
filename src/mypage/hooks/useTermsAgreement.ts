import { useState, useCallback } from 'react'
import { MOCK_TERMS_AGREEMENTS } from '../mock/mypage'
import type { TermAgreement } from '../types/mypage'

export function useTermsAgreement() {
  const [terms, setTerms] = useState<TermAgreement[]>(MOCK_TERMS_AGREEMENTS)
  const [mutationError, setMutationError] = useState<string | null>(null)

  const toggleConsent = useCallback(async (id: string, agreed: boolean) => {
    let snapshot: TermAgreement[] = []
    setMutationError(null)
    setTerms(prev => {
      snapshot = prev
      return prev.map(t => (t.id === id ? { ...t, agreed } : t))
    })

    try {
      // await api.patch(`/terms/${id}/consent`, { agreed })
    } catch {
      setTerms(snapshot)
      setMutationError('동의 설정을 변경하지 못했어요. 다시 시도해 주세요.')
    }
  }, [])

  const dismissMutationError = useCallback(() => setMutationError(null), [])

  return { terms, mutationError, dismissMutationError, toggleConsent }
}
