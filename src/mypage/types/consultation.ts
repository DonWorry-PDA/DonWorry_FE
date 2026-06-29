// 상담 API 응답/요청 타입 (BE #154)
export type ConsultApiType = 'PB' | 'INSURANCE'
export type ConsultApiStatus = 'RESERVED' | 'COMPLETED' | 'CANCELLED'
export type ConsultApiMethod = 'FACE_TO_FACE' | 'PHONE'

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
  /** 사용자가 고른 영업점의 실 DB id. BE가 조회해 지점명·기관을 확정한다. */
  branchId?: number
  /** 상담 방식. 없으면 BE가 유형별 기본값으로 폴백. */
  method?: ConsultApiMethod
}
