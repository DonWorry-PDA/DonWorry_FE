import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import type {
  ConsultationResponse,
  ConsultationSummaryResponse,
  CreateConsultationRequest,
} from '../types/consultation'

const CONSULTATIONS_KEY = ['consultations']
const consultationKey = (id: string) => ['consultation', id]
const summaryKey = (id: string) => ['consultation-summary', id]

export const useGetConsultations = () =>
  useQuery({
    queryKey: CONSULTATIONS_KEY,
    queryFn: () =>
      client
        .get<ApiResponse<ConsultationResponse[]>>('/api/user/consultations')
        .then((res) => res.data.data),
  })

export const useGetConsultation = (id: string | undefined) =>
  useQuery({
    queryKey: consultationKey(id ?? ''),
    enabled: !!id,
    queryFn: () =>
      client
        .get<ApiResponse<ConsultationResponse>>(`/api/user/consultations/${id}`)
        .then((res) => res.data.data),
  })

export const useGetConsultationSummary = (id: string | undefined) =>
  useQuery({
    queryKey: summaryKey(id ?? ''),
    enabled: !!id,
    // 요약 없는 완료 건(404 CONSULTATION_002)은 재시도하지 않고, 네트워크/5xx는 재시도 허용
    retry: (failureCount, error) =>
      isAxiosError(error) && error.response?.status === 404 ? false : failureCount < 2,
    queryFn: () =>
      client
        .get<ApiResponse<ConsultationSummaryResponse>>(`/api/user/consultations/${id}/summary`)
        .then((res) => res.data.data),
  })

export const usePostConsultationSeed = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () =>
      client.post('/api/user/consultations/seed').then((res) => res.data.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONSULTATIONS_KEY }),
  })
}

export const usePostConsultation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateConsultationRequest) =>
      client
        .post<ApiResponse<ConsultationResponse>>('/api/user/consultations', body)
        .then((res) => res.data.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONSULTATIONS_KEY }),
  })
}

export const usePatchConsultationSchedule = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (scheduledAt: string) =>
      client
        .patch(`/api/user/consultations/${id}/schedule`, { scheduledAt })
        .then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONSULTATIONS_KEY })
      queryClient.invalidateQueries({ queryKey: consultationKey(id) })
    },
  })
}

export const usePostConsultationCancel = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () =>
      client.post(`/api/user/consultations/${id}/cancel`).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONSULTATIONS_KEY })
      queryClient.invalidateQueries({ queryKey: consultationKey(id) })
    },
  })
}

export const usePatchConsultationMemo = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (memo: string) =>
      client.patch(`/api/user/consultations/${id}/memo`, { memo }).then((res) => res.data.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: summaryKey(id) }),
  })
}
