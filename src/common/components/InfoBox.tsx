type InfoBoxTone = 'muted' | 'primary' | 'success' | 'warning' | 'danger'

type InfoBoxProps = {
  tone?: InfoBoxTone
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
}

const toneStyles: Record<InfoBoxTone, string> = {
  muted: 'bg-surface-muted text-ink-sub',
  primary: 'bg-primary-tint text-primary-dark',
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning-text',
  danger: 'bg-danger-bg text-danger-text',
}

function InfoBox({ tone = 'muted', icon, children, className = '' }: InfoBoxProps) {
  return (
    <div className={`rounded-btn px-4 py-3 text-body ${toneStyles[tone]} ${className}`}>
      {icon ? (
        <div className="flex gap-2">
          <span className="shrink-0 mt-0.5">{icon}</span>
          <div>{children}</div>
        </div>
      ) : (
        children
      )}
    </div>
  )
}

export default InfoBox
