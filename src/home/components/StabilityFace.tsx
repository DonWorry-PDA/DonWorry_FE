import type { StabilityStatus } from '../../stability/types/stability'

const BG: Record<StabilityStatus, string> = {
  stable: '#E9F7F0',
  warning: '#FDF3E5',
  danger: '#FAF0F3',
}

const COLOR: Record<StabilityStatus, string> = {
  stable: '#069A53',
  warning: '#DD7A06',
  danger: '#C0566A',
}

function StabilityFace({ status, size = 40 }: { status: StabilityStatus; size?: number }) {
  const bg = BG[status]
  const color = COLOR[status]

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
      <circle cx="20" cy="20" r="20" fill={bg} />
      {/* eyes */}
      <circle cx="14.5" cy="17.5" r="2" fill={color} />
      <circle cx="25.5" cy="17.5" r="2" fill={color} />
      {/* furrowed brows for non-stable */}
      {status !== 'stable' && (
        <>
          <path d="M 12 13.5 Q 15 11.5 17.5 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M 22.5 13 Q 25 11.5 28 13.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </>
      )}
      {/* mouth */}
      {status === 'stable' && (
        <path d="M 13 25 Q 20 30 27 25" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      )}
      {status === 'warning' && (
        <path d="M 14 27 Q 20 24 26 27" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      )}
      {status === 'danger' && (
        <path d="M 14 28 Q 20 22 26 28" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      )}
    </svg>
  )
}

export default StabilityFace
