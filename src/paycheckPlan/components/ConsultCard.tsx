import type { KeyboardEvent } from 'react'
import Badge from '../../common/components/Badge'
import Toggle from '../../common/components/Toggle'
import type { ConsultCard as ConsultCardType } from '../types/paycheckPlan'

type ConsultCardProps = {
  card: ConsultCardType
  selected: boolean
  sendChecked?: boolean
  onSendToggle?: (v: boolean) => void
  onClick?: () => void
  /** 카드 자체를 선택 가능한 버튼으로 다룰지. 단일 카드처럼 선택지가 없으면 false로 비대화형 처리. */
  interactive?: boolean
}

function ConsultCard({
  card,
  selected,
  sendChecked,
  onSendToggle,
  onClick,
  interactive = true,
}: ConsultCardProps) {
  const interactiveProps = interactive
    ? {
        onClick,
        role: 'button' as const,
        tabIndex: 0,
        onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => e.key === 'Enter' && onClick?.(),
      }
    : {}
  return (
    <div
      {...interactiveProps}
      className={`w-full text-left rounded-card-lg p-4 border transition-colors ${
        interactive ? 'cursor-pointer ' : ''
      }${selected ? 'border-primary border-2 bg-white' : 'border-line bg-white'}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-body font-bold text-ink">{card.title}</span>
        <span className="text-sub text-ink-sub">— {card.subtitle}</span>
        {card.badge && <Badge tone="muted">{card.badge}</Badge>}
      </div>
      <p className="text-sub text-ink-sub mb-3">{card.description}</p>
      {card.hasSendToggle && selected && (
        <div
          className="flex items-center justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-body text-ink">검토 내용 함께 보내기</span>
          <Toggle
            checked={sendChecked ?? false}
            onChange={onSendToggle ?? (() => {})}
            size="sm"
            aria-label="검토 내용 함께 보내기"
          />
        </div>
      )}
    </div>
  )
}

export default ConsultCard
