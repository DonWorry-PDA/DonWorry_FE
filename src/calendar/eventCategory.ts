import type { EventCategory } from './types/calendar'

type CategoryStyle = {
  label: string // 범례 라벨
  dot: string // 범례 점 배경
  text: string // 텍스트/금액 색
  badgeBg: string // 셀 뱃지 배경 (10% 틴트)
  iconBg: string // 일정 아이콘 원형 배경 (15% 틴트)
}

/**
 * Tailwind v4 스캐너가 클래스를 감지하려면 동적 조합(`bg-event-${cat}`)이 아니라
 * 완전한 리터럴 문자열이어야 하므로 카테고리별로 전부 명시한다.
 */
export const CATEGORY_STYLE: Record<EventCategory, CategoryStyle> = {
  dividend: {
    label: '배당 입금',
    dot: 'bg-event-dividend',
    text: 'text-event-dividend',
    badgeBg: 'bg-event-dividend/10',
    iconBg: 'bg-event-dividend/15',
  },
  pension: {
    label: '연금 수령',
    dot: 'bg-event-pension',
    text: 'text-event-pension',
    badgeBg: 'bg-event-pension/10',
    iconBg: 'bg-event-pension/15',
  },
  payment: {
    label: '납입일',
    dot: 'bg-event-payment',
    text: 'text-event-payment',
    badgeBg: 'bg-event-payment/10',
    iconBg: 'bg-event-payment/15',
  },
  transaction: {
    label: '소비',
    dot: 'bg-event-transaction',
    text: 'text-event-transaction',
    badgeBg: 'bg-event-transaction/10',
    iconBg: 'bg-event-transaction/15',
  },
  maturity: {
    label: '만기일',
    dot: 'bg-event-maturity',
    text: 'text-event-maturity',
    badgeBg: 'bg-event-maturity/10',
    iconBg: 'bg-event-maturity/15',
  },
  interest: {
    label: '예금 이자',
    dot: 'bg-event-interest',
    text: 'text-event-interest',
    badgeBg: 'bg-event-interest/10',
    iconBg: 'bg-event-interest/15',
  },
  etc: {
    label: '기타',
    dot: 'bg-event-etc',
    text: 'text-event-etc',
    badgeBg: 'bg-event-etc/10',
    iconBg: 'bg-event-etc/15',
  },
}

/** 범례에 노출할 카테고리 순서 */
export const LEGEND_ORDER: EventCategory[] = [
  'dividend',
  'pension',
  'payment',
  'transaction',
  'maturity',
  'interest',
  'etc',
]
