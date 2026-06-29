import { formatTime24 } from '../../common/components/DateTimePickerSheet'
import type { ConsultApiMethod, ConsultationResponse } from '../types/consultation'
import type { ConsultRecord } from '../types/mypage'

/** 상담 방식 라벨. */
export const methodLabel = (method: ConsultApiMethod): string =>
  method === 'FACE_TO_FACE' ? '영업점 대면 상담' : '전화 상담'

const pad = (n: number) => String(n).padStart(2, '0')
const DOW = ['일', '월', '화', '수', '목', '금', '토']

/** "2026-06-19T14:00:00" → "2026.06.19 14:00" */
export const formatScheduledAt = (iso: string): string => {
  const d = new Date(iso)
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** API 응답 → 화면 ConsultRecord. CANCELLED는 호출부에서 제외한 뒤 매핑한다. */
export const toConsultRecord = (c: ConsultationResponse): ConsultRecord => {
  const reserved = c.status === 'RESERVED'
  return {
    id: String(c.id),
    title: c.title,
    status: reserved ? 'reserved' : 'completed',
    dateTime: formatScheduledAt(c.scheduledAt),
    location: c.location ?? '',
    counselor: c.counselorName ?? undefined,
    actionLabel: reserved ? '상담 준비사항 보기' : c.hasSummary ? '상담 요약 보기' : undefined,
    actionPath: reserved
      ? `/mypage/consult-history/${c.id}/prep`
      : c.hasSummary
        ? `/mypage/consult-history/${c.id}/summary`
        : undefined,
  }
}

/** ISO 문자열 → 변경 화면용 분해값. */
export const parseScheduledAt = (iso: string) => {
  const d = new Date(iso)
  const time24 = `${pad(d.getHours())}:${pad(d.getMinutes())}`
  return {
    date: d,
    fullDate: `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${DOW[d.getDay()]})`,
    time: formatTime24(time24),
    time24,
  }
}

/** Date + "HH:mm" → "YYYY-MM-DDTHH:mm:00" (BE LocalDateTime). */
export const buildScheduledAtIso = (date: Date, time24: string): string => {
  const [h, m] = time24.split(':').map(Number)
  if (Number.isNaN(date.getTime()) || Number.isNaN(h) || Number.isNaN(m)) {
    throw new Error(`Invalid schedule input: date=${String(date)}, time24=${time24}`)
  }
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(h)}:${pad(m)}:00`
}
