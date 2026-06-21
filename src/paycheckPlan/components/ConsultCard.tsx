import Badge from '../../common/components/Badge'
import Toggle from '../../common/components/Toggle'
import type { ConsultCard as ConsultCardType } from '../types/paycheckPlan'

type ConsultCardProps = {
  card: ConsultCardType
  selected: boolean
  sendChecked?: boolean
  onSendToggle?: (v: boolean) => void
  onClick: () => void
}

function ConsultCard({ card, selected, sendChecked, onSendToggle, onClick }: ConsultCardProps) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={`w-full text-left rounded-card-lg p-4 border transition-colors cursor-pointer ${
        selected ? 'border-primary border-2 bg-white' : 'border-line bg-white'
      }`}
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
