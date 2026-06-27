// 전문가 상담 진입 맥락 — 화면 문구·BE 전송의 단일 소스.
// 어떤 화면에서 무슨 내용으로 상담을 신청했는지 신청 화면 → 상담 내역 → 준비사항까지 일관되게 잇는다.
// BE는 topic/contextTopics를 문자열 그대로 저장·반환하므로, 문구는 여기서만 관리해 드리프트를 막는다.

export type ConsultContext = 'PENSION_DEFER' | 'SALARY_SHORTAGE' | 'SALARY_PLAN'

export type ConsultContextCopy = {
  /** 저장 제목(topic) — BE가 그대로 상담 title로 저장. 100자 이하. */
  topic: string
  /** PB 카드 부제("PB 상담 — {subtitle}"). */
  subtitle: string
  /** PB 카드 설명. */
  description: string
  /** 상담 준비사항 "이번 상담에서 다룰 내용". 항목당 200자 이하, 최대 10개. */
  topics: string[]
}

export const CONSULT_CONTEXT_COPY: Record<ConsultContext, ConsultContextCopy> = {
  PENSION_DEFER: {
    topic: '국민연금 연기 상담',
    subtitle: '국민연금 연기 결정',
    description: '보고 계시던 국민연금 연기 비교표를 상담사에게 미리 전달해요.',
    topics: ['연기율별 수령액 비교', '연기 시 손익분기 시점', '내 상황에 맞는 연기 시점 결정'],
  },
  SALARY_SHORTAGE: {
    topic: '자산 지키기 운용 상담',
    subtitle: '자산 지키기',
    description: '지금은 월급 만들 여유가 부족한 상태예요. 자산을 지키는 운용을 함께 점검해요.',
    topics: ['현금흐름·생활비 부족분 진단', '안전자산 중심 지키는 운용', '소득·지출 조정 방향'],
  },
  SALARY_PLAN: {
    topic: '월급 설계안 상담',
    subtitle: '월급 설계안 검토',
    description: '보고 계시던 월급 설계안을 상담사에게 미리 전달해요.',
    topics: ['선택한 설계안 구성 검토', '예상 월수령액·리스크 점검', '실행 전 확인사항'],
  },
}

/** 맥락 없이 직접 진입한 경우의 중립 폴백. */
export const CONSULT_CONTEXT_FALLBACK: ConsultContextCopy = {
  topic: '자산 설계 상담',
  subtitle: '자산 설계',
  description: '보고 계시던 진단 내용을 상담사에게 미리 전달해요.',
  topics: ['자산 현황 점검', '은퇴 준비 방향 상담'],
}

/** 맥락 → 문구. state가 없거나 알 수 없는 값이면 폴백을 돌려준다. */
export const resolveConsultContext = (context?: ConsultContext | null): ConsultContextCopy =>
  (context && CONSULT_CONTEXT_COPY[context]) || CONSULT_CONTEXT_FALLBACK
