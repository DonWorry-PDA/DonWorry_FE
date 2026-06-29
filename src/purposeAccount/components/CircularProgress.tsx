interface CircularProgressProps {
  percentage: number
  /** 실제 hex 값 — SVG stroke/fill attribute 전용 */
  hexColor: string
  size?: number
  strokeWidth?: number
  label?: string
}

export default function CircularProgress({
  percentage,
  hexColor,
  size = 64,
  strokeWidth = 8,
  label,
}: CircularProgressProps) {
  const clamped = Math.max(0, Math.min(percentage, 100))
  const r = (size - strokeWidth) / 2
  const c = 2 * Math.PI * r
  const offset = c - (clamped / 100) * c
  const cx = size / 2
  const cy = size / 2

  const pctFontSize = Math.round(size * 0.175)
  const labelFontSize = Math.round(size * 0.125)
  const pctY = label ? cy - labelFontSize * 0.7 : cy
  const labelY = cy + pctFontSize * 0.6

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
    >
      {/* 트랙 */}
      <circle cx={cx} cy={cy} r={r} stroke="#EDF0F4" strokeWidth={strokeWidth} />

      {/* 진행 호: 12시 방향에서 시작 */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        stroke={hexColor}
        strokeWidth={strokeWidth}
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />

      {/* 퍼센트 */}
      <text
        x={cx}
        y={pctY}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Inter, 'Noto Sans KR', sans-serif"
        fontWeight="700"
        fontSize={pctFontSize}
        fill={hexColor}
      >
        {clamped}%
      </text>

      {/* 보조 라벨 */}
      {label && (
        <text
          x={cx}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="'Noto Sans KR', sans-serif"
          fontSize={labelFontSize}
          fill="#8B95A1"
        >
          {label}
        </text>
      )}
    </svg>
  )
}
