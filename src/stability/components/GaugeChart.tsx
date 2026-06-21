import type { StabilityStatus } from '../types/stability'

type Props = {
  percentage: number
  status: StabilityStatus
}

const CX = 122
const CY = 130
const R = 100
const STROKE_WIDTH = 14

const FILL_COLOR: Record<StabilityStatus, string> = {
  stable: '#069A53',
  warning: '#DD7A06',
  danger: '#DF3550',
}

function arcPath(percentage: number): string {
  if (percentage <= 0) return ''
  if (percentage >= 100) {
    return `M ${CX - R} ${CY} A ${R} ${R} 0 1 1 ${CX + R} ${CY}`
  }
  const endAngle = Math.PI * (1 - percentage / 100)
  const endX = CX + R * Math.cos(endAngle)
  const endY = CY - R * Math.sin(endAngle)
  return `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${endX} ${endY}`
}

function GaugeChart({ percentage, status }: Props) {
  const trackPath = `M ${CX - R} ${CY} A ${R} ${R} 0 1 1 ${CX + R} ${CY}`
  const fillPath = arcPath(percentage)
  const fillColor = FILL_COLOR[status]

  return (
    <svg
      viewBox="0 0 244 156"
      width="244"
      height="156"
      overflow="visible"
      fill="none"
      aria-label={`생활 안정도 ${percentage}%`}
    >
      <path
        d={trackPath}
        stroke="#EDF0F4"
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
      />
      {fillPath && (
        <path
          d={fillPath}
          stroke={fillColor}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
        />
      )}
      <text
        x={CX}
        y={86}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Inter, 'Noto Sans KR', sans-serif"
        fontWeight="800"
        fontSize="30"
        fill={fillColor}
      >
        {percentage}%
      </text>
      <text
        x={CX}
        y={111}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Noto Sans KR', sans-serif"
        fontWeight="400"
        fontSize="12"
        fill="#98A2B0"
      >
        생활비 충당률
      </text>
      <text
        x={CX - R}
        y={148}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Noto Sans KR', sans-serif"
        fontWeight="400"
        fontSize="12"
        fill="#8B95A1"
      >
        0%
      </text>
      <text
        x={CX + R}
        y={148}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Noto Sans KR', sans-serif"
        fontWeight="400"
        fontSize="12"
        fill="#8B95A1"
      >
        목표 100%
      </text>
    </svg>
  )
}

export default GaugeChart
