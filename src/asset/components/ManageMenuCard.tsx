import Badge from '../../common/components/Badge'
import MenuIcon from './MenuIcon'
import type { ManageMenu } from '../types/asset'

type Props = {
  menu: ManageMenu
  onClick: () => void
  className?: string
  compact?: boolean
}

const DOT_COLOR: Record<NonNullable<ManageMenu['statusDot']>, string> = {
  stable: 'bg-success text-success',
  warning: 'bg-warning text-warning',
  danger: 'bg-danger text-danger',
}

function ManageMenuCard({ menu, onClick, className, compact }: Props) {
  const { key, title, caption, iconTone, progressPct, statusDot, statusText, isNew } = menu
  const safeProgressPct = progressPct == null ? null : Math.min(100, Math.max(0, progressPct))

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-card-lg flex h-full flex-col items-start bg-white text-left shadow-lift ${
        compact ? 'px-4 py-3' : 'p-4'
      }${className ? ` ${className}` : ''}`}
    >
      <div className="flex w-full items-start justify-between">
        <MenuIcon menuKey={key} tone={iconTone} />
        {isNew && <Badge tone="danger">NEW</Badge>}
      </div>

      <span className={`text-md text-ink font-bold ${compact ? 'mt-2' : 'mt-3'}`}>{title}</span>

      {statusText && statusDot && (
        <span className={`mt-1.5 flex items-center gap-1 text-body font-bold ${DOT_COLOR[statusDot].split(' ')[1]}`}>
          <span className={`size-1.5 rounded-full ${DOT_COLOR[statusDot].split(' ')[0]}`} />
          {statusText}
        </span>
      )}

      <p className="text-caption text-ink-hint mt-1 flex-1 whitespace-pre-line">{caption}</p>

      {safeProgressPct != null && (
        <div className={`w-full ${compact ? 'mt-2' : 'mt-3'}`}>
          <div className="bg-track h-1.5 overflow-hidden rounded-full">
            <div className="bg-primary h-full rounded-full" style={{ width: `${safeProgressPct}%` }} />
          </div>
          <p className="text-caption text-primary mt-1.5 font-bold">{safeProgressPct}% 달성</p>
        </div>
      )}
    </button>
  )
}

export default ManageMenuCard
