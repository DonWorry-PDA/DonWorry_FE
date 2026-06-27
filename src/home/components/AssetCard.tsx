import { useState } from 'react'
import type { AssetSegment } from '../types/home'

type Props = {
  totalAmountKrw: number
  segments: AssetSegment[]
  monthlyIncomeKrw: number
}

function DonutChart({ segments }: { segments: AssetSegment[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  if (segments.length === 0) return null

  const CX = 50, CY = 50, R = 33
  const circumference = 2 * Math.PI * R
  const GAP = circumference * (3 / 360)

  const COLORS = [
    'rgba(255,255,255,0.35)',
    'rgba(255,255,255,0.65)',
    'rgba(255,255,255,0.92)',
  ]

  const segmentAngles = segments.map((_, i) => {
    const startPct = segments.slice(0, i).reduce((acc, s) => acc + s.pct, 0)
    return (startPct / 100) * 360 - 90
  })

  const defaultIdx = segments.reduce((maxI, s, i) => s.pct > segments[maxI].pct ? i : maxI, 0)
  const displayed = segments[hoveredIdx ?? defaultIdx]

  return (
    <svg viewBox="0 0 100 100" width="130" height="130" fill="none">
      {segments.map(({ pct, label }, i) => {
        const segLength = Math.max(0, (pct / 100) * circumference - GAP)
        const isHovered = hoveredIdx === i
        const isDimmed = hoveredIdx !== null && !isHovered
        return (
          <g key={label}>
            <circle
              cx={CX} cy={CY} r={R}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={isHovered ? 23 : 16}
              strokeDasharray={`${segLength} ${circumference}`}
              strokeDashoffset={0}
              transform={`rotate(${segmentAngles[i]} ${CX} ${CY})`}
              opacity={isDimmed ? 0.3 : 1}
              className="donut-transition"
            />
            {/* 히트 영역 */}
            <circle
              cx={CX} cy={CY} r={R}
              stroke="transparent"
              strokeWidth={28}
              strokeDasharray={`${segLength} ${circumference}`}
              strokeDashoffset={0}
              transform={`rotate(${segmentAngles[i]} ${CX} ${CY})`}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          </g>
        )
      })}
      <text
        x={CX} y={CY - 5}
        textAnchor="middle" dominantBaseline="central"
        fontFamily="'Noto Sans KR', sans-serif" fontWeight="700" fontSize="10"
        fill="white"
      >
        {displayed.label}
      </text>
      <text
        x={CX} y={CY + 8}
        textAnchor="middle" dominantBaseline="central"
        fontFamily="Inter, sans-serif" fontWeight="700" fontSize="10"
        fill="white"
      >
        {displayed.pct}%
      </text>
    </svg>
  )
}

function AssetCard({ totalAmountKrw, segments, monthlyIncomeKrw }: Props) {
  const totalMan = Math.round(totalAmountKrw / 10_000)
  const eok = Math.floor(totalMan / 10_000)
  const remainMan = totalMan % 10_000
  const totalLabel = remainMan > 0
    ? `${eok}억 ${remainMan.toLocaleString('ko-KR')}만원`
    : `${eok}억원`

  const monthlyMan = Math.round(monthlyIncomeKrw / 10_000)

  return (
    <div className="bg-primary rounded-card-xl p-[22px] flex gap-1 items-start">
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <p className="text-caption text-white/80">총자산</p>
        <p className="font-inter text-[1.25rem] font-bold text-white leading-tight tracking-tight">
          {totalLabel}
        </p>
        <div className="flex flex-wrap gap-x-[14px] gap-y-1 opacity-90 pt-1 pb-[10px]">
          {segments.map(({ label, pct }) => (
            <span key={label} className="text-caption text-white">
              {label} {pct}%
            </span>
          ))}
        </div>
        <div className="border-t border-white/20 pt-[15px] flex items-center gap-3">
          <span className="text-body text-white/85">월 예상 수입</span>
          <span className="font-inter text-md font-bold text-white">
            {monthlyMan.toLocaleString('ko-KR')}만원
          </span>
        </div>
      </div>
      <div className="shrink-0">
        <DonutChart segments={segments} />
      </div>
    </div>
  )
}

export default AssetCard
