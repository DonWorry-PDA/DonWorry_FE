import { useState, useCallback } from 'react'
import { MOCK_TERMS_AGREEMENTS } from '../mock/mypage'
import type { TermAgreement } from '../types/mypage'

function formatAgreedAt(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}.${m}.${d}`
}

export function useTermsAgreement() {
  const [terms, setTerms] = useState<TermAgreement[]>(MOCK_TERMS_AGREEMENTS)
  const [mutationError, setMutationError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const toggleConsent = useCallback(async (id: string, agreed: boolean) => {
    let snapshot: TermAgreement[] = []
    setMutationError(null)
    setIsUpdating(true)
    setTerms(prev => {
      snapshot = prev
      return prev.map(t => (t.id === id ? { ...t, agreed, agreedAt: formatAgreedAt(new Date()) } : t))
    })

    try {
      // await api.patch(`/terms/${id}/consent`, { agreed })
    } catch (err) {
      console.error('Failed to update term consent:', err)
      setTerms(snapshot)
      setMutationError('동의 설정을 변경하지 못했어요. 다시 시도해 주세요.')
    } finally {
      setIsUpdating(false)
    }
  }, [])

  const dismissMutationError = useCallback(() => setMutationError(null), [])

  return { terms, mutationError, dismissMutationError, toggleConsent, isUpdating }
}
