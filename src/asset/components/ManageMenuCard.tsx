import Badge from '../../common/components/Badge'
import MenuIcon from './MenuIcon'
import type { ManageMenu } from '../types/asset'

type Props = {
  menu: ManageMenu
  onClick: () => void
}

const DOT_COLOR: Record<NonNullable<ManageMenu['statusDot']>, string> = {
  stable: 'bg-success text-success',
  warning: 'bg-warning text-warning',
  danger: 'bg-danger text-danger',
}

function ManageMenuCard({ menu, onClick }: Props) {
  const { key, title, caption, iconTone, progressPct, statusDot, statusText, highlighted, isNew } =
    menu

  return (
    <button
      onClick={onClick}
      className={`rounded-card-lg shadow-card flex h-full flex-col items-start bg-white p-4 text-left ${
        highlighted ? 'border-primary border' : 'border border-transparent'
      }`}
    >
      <div className="flex w-full items-start justify-between">
        <MenuIcon menuKey={key} tone={iconTone} />
        {isNew && <Badge tone="danger">NEW</Badge>}
      </div>

      <span className="text-md text-ink mt-3 font-bold">{title}</span>

      {statusText && statusDot && (
        <span className={`mt-1.5 flex items-center gap-1 text-body font-bold ${DOT_COLOR[statusDot].split(' ')[1]}`}>
          <span className={`size-1.5 rounded-full ${DOT_COLOR[statusDot].split(' ')[0]}`} />
          {statusText}
        </span>
      )}

      <p className="text-caption text-ink-hint mt-1 flex-1 whitespace-pre-line">{caption}</p>

      {progressPct != null && (
        <div className="mt-3 w-full">
          <div className="bg-track h-1.5 overflow-hidden rounded-full">
            <div className="bg-primary h-full rounded-full" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="text-caption text-primary mt-1.5 font-bold">{progressPct}% 달성</p>
        </div>
      )}
    </button>
  )
}

export default ManageMenuCard
