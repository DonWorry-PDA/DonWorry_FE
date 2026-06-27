import { useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import client from '@/common/api/client'
import type { ApiResponse } from '@/common/types/api'
import type { OptionalTermsResponse, TermAgreement } from '../types/mypage'

const REQUIRED_TERMS: TermAgreement[] = [
  { id: 'service', label: '연금SOL사 서비스 이용약관', required: true, agreed: true, agreedAt: null },
  { id: 'privacy', label: '개인정보 수집·이용 동의', required: true, agreed: true, agreedAt: null },
  { id: 'biometric', label: '고유식별정보 처리 동의', required: true, agreed: true, agreedAt: null },
  { id: 'electronic', label: '전자금융거래 이용약관', required: true, agreed: true, agreedAt: null },
]

export function useTermsAgreement() {
  const queryClient = useQueryClient()

  const { data: optionalData } = useQuery({
    queryKey: ['terms', 'optional'],
    queryFn: () =>
      client
        .get<ApiResponse<OptionalTermsResponse>>('/api/user/terms/optional')
        .then((res) => res.data.data),
  })

  const { mutate, isPending, isError, reset } = useMutation({
    mutationFn: ({ termId, agreed }: { termId: string; agreed: boolean }) =>
      client
        .patch<ApiResponse<void>>(`/api/user/terms/${termId}/consent`, { agreed })
        .then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.setQueryData<OptionalTermsResponse>(['terms', 'optional'], (old) => {
        if (!old) return old
        const now = new Date()
        const agreedAt = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`
        return {
          ...old,
          [variables.termId]: {
            agreed: variables.agreed,
            agreedAt: variables.agreed ? agreedAt : null,
          },
        }
      })
    },
  })

  const optionalTerms: TermAgreement[] = optionalData
    ? [
        {
          id: 'thirdParty',
          label: '개인정보 제3자 제공 동의',
          required: false,
          agreed: optionalData.thirdParty.agreed,
          agreedAt: optionalData.thirdParty.agreedAt,
        },
        {
          id: 'marketing',
          label: '마케팅 정보 수신 동의',
          required: false,
          agreed: optionalData.marketing.agreed,
          agreedAt: optionalData.marketing.agreedAt,
        },
      ]
    : []

  const toggleConsent = useCallback(
    (id: string, agreed: boolean) => mutate({ termId: id, agreed }),
    [mutate],
  )

  return {
    terms: [...REQUIRED_TERMS, ...optionalTerms],
    toggleConsent,
    isUpdating: isPending,
    mutationError: isError ? '동의 설정을 변경하지 못했어요. 다시 시도해 주세요.' : null,
    dismissMutationError: reset,
  }
}
