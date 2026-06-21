type BadgeTone = 'primary' | 'success' | 'warning' | 'danger' | 'muted'

type BadgeProps = {
  tone?: BadgeTone
  children: React.ReactNode
}

const toneStyles: Record<BadgeTone, string> = {
  primary: 'bg-primary-tint text-primary',
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning-text',
  danger: 'bg-danger-bg text-danger-text',
  muted: 'bg-surface-muted text-ink-sub',
}

function Badge({ tone = 'primary', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-badge px-2 py-0.5 text-sub font-medium ${toneStyles[tone]}`}>
      {children}
    </span>
  )
}

export default Badge
