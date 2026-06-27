import { Fragment, useState } from 'react'
import type { AssetSegment } from '../types/home'

type Props = {
  totalAmountKrw: number
  changeAmount: number | null
  changeDirection: 'UP' | 'DOWN' | 'FLAT'
  segments: AssetSegment[]
  onAnalysisClick?: () => void
}

const SEGMENT_COLORS = [
  'rgba(255, 255, 255, 0.9)',
  'rgba(255, 212, 102, 0.9)',
  'rgba(94, 228, 180, 0.9)',
  'rgba(255, 158, 181, 0.9)',
  'rgba(196, 170, 255, 0.9)',
]

type ActiveSegment = { label: string; pct: number }

function DonutChart({ segments }: { segments: AssetSegment[] }) {
  const [active, setActive] = useState<ActiveSegment | null>(null)

  if (segments.length === 0) return null

  const CX = 50, CY = 50, R = 34
  const circumference = 2 * Math.PI * R
  const GAP = circumference * (2.5 / 360)

  const segmentAngles = segments.map((_, i) => {
    const startPct = segments.slice(0, i).reduce((acc, s) => acc + s.pct, 0)
    return (startPct / 100) * 360 - 90
  })

  return (
    <svg
      viewBox="0 0 100 100"
      width={180}
      height={180}
      fill="none"
      onClick={e => e.stopPropagation()}
    >
      {segments.map(({ pct, label }, i) => {
        const segLength = Math.max(0, (pct / 100) * circumference - GAP)
        return (
          <circle
            key={label}
            cx={CX} cy={CY} r={R}
            stroke={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
            strokeWidth={active?.label === label ? 24 : 16}
            strokeDasharray={`${segLength} ${circumference}`}
            strokeDashoffset={0}
            transform={`rotate(${segmentAngles[i]} ${CX} ${CY})`}
            style={{ cursor: 'pointer', transition: 'stroke-width 0.18s ease' }}
            onMouseEnter={() => setActive({ label, pct })}
            onMouseLeave={() => setActive(null)}
            onClick={e => {
              e.stopPropagation()
              setActive(prev => prev?.label === label ? null : { label, pct })
            }}
          />
        )
      })}
      {active && (
        <>
          <text
            x={CX} y={CY - 7}
            textAnchor="middle" dominantBaseline="central"
            fontFamily="'Noto Sans KR', sans-serif" fontWeight="400" fontSize="7"
            fill="rgba(255,255,255,0.8)"
          >
            {active.label}
          </text>
          <text
            x={CX} y={CY + 6}
            textAnchor="middle" dominantBaseline="central"
            fontFamily="Inter, sans-serif" fontWeight="600" fontSize="9"
            fill="white"
          >
            {active.pct}%
          </text>
        </>
      )}
    </svg>
  )
}

function AssetCard({ totalAmountKrw, changeAmount, changeDirection, segments, onAnalysisClick }: Props) {
  const sortedSegments = [...segments].sort((a, b) => b.pct - a.pct)
  const totalNumber = totalAmountKrw.toLocaleString('ko-KR')

  const changeText =
    changeAmount != null && changeDirection !== 'FLAT'
      ? `${Math.abs(changeAmount).toLocaleString('ko-KR')}원 ${changeDirection === 'UP' ? '올랐어요' : '내렸어요'}`
      : changeDirection === 'FLAT'
      ? '지난 달과 동일해요'
      : null

  return (
    <div className="bg-primary rounded-card-xl px-[22px] pt-[18px] pb-[20px] flex flex-col gap-4">
      {/* Header: 총자산 + 자세히 보기 버튼 */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-[5px]">
          <p className="text-sub text-white/75">총자산</p>
          <p className="font-inter text-[1.875rem] font-bold text-white leading-tight tracking-tight">
            {totalNumber}원
          </p>
          {changeText && (
            <p className="text-sub text-white/65">{changeText}</p>
          )}
        </div>
        {onAnalysisClick && (
          <button
            className="shrink-0 text-sub font-bold text-white px-4 py-[7px] rounded-badge bg-white/20"
            onClick={(e) => { e.stopPropagation(); onAnalysisClick() }}
            aria-label="자산 분석 보기"
          >
            자세히 보기
          </button>
        )}
      </div>

      {/* Chart + legend */}
      <div className="flex items-center gap-4">
        <div className="shrink-0">
          <DonutChart segments={sortedSegments} />
        </div>
        <div className="flex-1 grid grid-cols-[1fr_auto] gap-x-2 gap-y-[11px] items-center">
          {sortedSegments.map(({ label, pct }, i) => (
            <Fragment key={label}>
              <div className="flex items-center gap-[7px]">
                <span
                  className="size-[8px] rounded-full shrink-0"
                  style={{ backgroundColor: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
                />
                <span className="text-sub text-white/90">{label}</span>
              </div>
              <span className="font-inter text-sub font-bold text-white text-right">{pct}%</span>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AssetCard
