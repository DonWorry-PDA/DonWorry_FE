import type { CalendarEvent, EventCategory } from './types/calendar'

/* ── 점으로 표시 + 범례 쓰는 4가지 흐름 ───────────────────────── */
export type FlowType = 'deposit' | 'withdraw' | 'buy' | 'sell'

export const FLOW_ORDER: FlowType[] = ['deposit', 'withdraw', 'buy', 'sell']

export const FLOW_STYLE: Record<FlowType, { label: string; dot: string }> = {
  deposit: { label: '입금', dot: 'bg-success' }, // 초록
  withdraw: { label: '출금', dot: 'bg-ink-hint' }, // 회색
  buy: { label: '매수', dot: 'bg-danger' }, // 빨강
  sell: { label: '매도', dot: 'bg-primary' }, // 파랑
}

/* ── 라벨 블록으로 표시할 카테고리(이름 있는 현금흐름) ─────────── */
export const BLOCK_ORDER: EventCategory[] = [
  'pension',
  'dividend',
  'interest',
  'payment',
  'maturity',
]

// 라벨로 구분되므로 색은 부드럽게. 빨강/파랑은 매수·매도 점에 양보.
export const BLOCK_STYLE: Record<string, { label: string; chip: string }> = {
  pension: { label: '연금', chip: 'bg-event-transaction/15 text-event-transaction' }, // 주황
  dividend: { label: '배당', chip: 'bg-event-investment/15 text-event-investment' }, // 청록
  interest: { label: '이자', chip: 'bg-event-interest/15 text-event-interest' }, // 앰버
  payment: { label: '납입', chip: 'bg-event-payment/15 text-event-payment' }, // 초록
  maturity: { label: '만기', chip: 'bg-event-maturity/15 text-event-maturity' }, // 보라
}

function isBlockCategory(category: EventCategory): boolean {
  return BLOCK_ORDER.includes(category)
}

/**
 * 점(흐름) 유형 판정. 블록 카테고리는 점 대상이 아니다(null).
 * 투자(주식)는 부호로 매수(현금 −)/매도(현금 +), 그 외 비블록은 입금(+)/출금(−).
 */
export function flowTypeOf(category: EventCategory, amountKrw: number | null): FlowType | null {
  if (isBlockCategory(category)) return null
  if (category === 'investment') return (amountKrw ?? 0) < 0 ? 'buy' : 'sell'
  if (amountKrw === null) return null
  return amountKrw > 0 ? 'deposit' : 'withdraw'
}

/** 이벤트 목록에서 등장하는 흐름 유형(중복 제거 + 정해진 순서) */
export function flowTypesOf(events: CalendarEvent[]): FlowType[] {
  const set = new Set<FlowType>()
  for (const e of events) {
    const flow = flowTypeOf(e.category, e.amountKrw)
    if (flow) set.add(flow)
  }
  return FLOW_ORDER.filter((f) => set.has(f))
}

/** 이벤트 목록에서 등장하는 블록 카테고리(중복 제거 + 정해진 순서) */
export function blockCategoriesOf(events: CalendarEvent[]): EventCategory[] {
  const set = new Set<EventCategory>()
  for (const e of events) {
    if (isBlockCategory(e.category)) set.add(e.category)
  }
  return BLOCK_ORDER.filter((c) => set.has(c))
}
