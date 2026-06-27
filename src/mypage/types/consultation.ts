// 상담 API 응답/요청 타입 (BE #154)
export type ConsultApiType = 'PB' | 'INSURANCE'
export type ConsultApiStatus = 'RESERVED' | 'COMPLETED' | 'CANCELLED'
export type ConsultApiMethod = 'FACE_TO_FACE' | 'ONLINE'

export type ConsultationResponse = {
  id: number
  title: string
  consultType: ConsultApiType
  status: ConsultApiStatus
  scheduledAt: string // ISO LocalDateTime ("2026-07-10T14:00:00")
  method: ConsultApiMethod
  location: string | null
  counselorName: string | null
  planId: number | null
  contextTopics: string[]
  hasSummary: boolean
}

export type ConsultationSummaryResponse = {
  diagnosis: string
  recommendations: string[]
  nextSteps: string[]
  memo: string | null
}

export type CreateConsultationRequest = {
  consultType: ConsultApiType
  scheduledAt: string
  planId?: number | null
  /** 진입 맥락 제목. 없으면 BE가 consultType 기본 제목으로 폴백. */
  topic?: string
  /** 진입 맥락 "다룰 내용". */
  contextTopics?: string[]
}
