import { Fragment, useState, useEffect } from 'react'
import { formatKrw } from '@/common/utils/formatKrw'
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
  const [pinned, setPinned] = useState<ActiveSegment | null>(null)
  const [hovered, setHovered] = useState<ActiveSegment | null>(null)
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [drawn, setDrawn] = useState(reducedMotion)
  const active = hovered ?? pinned

  useEffect(() => {
    if (reducedMotion) return
    const id = requestAnimationFrame(() => setDrawn(true))
    return () => cancelAnimationFrame(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      width={152}
      height={152}
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
            strokeDasharray={drawn ? `${segLength} ${circumference}` : `0 ${circumference}`}
            strokeDashoffset={0}
            transform={`rotate(${segmentAngles[i]} ${CX} ${CY})`}
            style={{
              cursor: 'pointer',
              transition: reducedMotion
                ? 'stroke-width 0.18s ease'
                : `stroke-dasharray 0.5s cubic-bezier(0.4,0,0.2,1) ${i * 0.07}s, stroke-width 0.18s ease`,
            }}
            onMouseEnter={() => setHovered({ label, pct })}
            onMouseLeave={() => setHovered(null)}
            onClick={e => {
              e.stopPropagation()
              setPinned(prev => prev?.label === label ? null : { label, pct })
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

  const amountStr = formatKrw(totalAmountKrw)
  // 360px 기준 좌측 가용폭 ~163px, formatKrw 출력 기준 (예: "9,999만원"=7자, "99억 9,999만원"=11자)
  const amountSizeClass =
    amountStr.length <= 9  ? 'text-display' :      // ~수천만원 (24px)
    amountStr.length <= 12 ? 'text-[1.25rem]' :    // ~수백억원 (20px)
    'text-[1.0625rem]'                              // 수천억+ (17px)

  const changeText =
    changeAmount != null && changeDirection !== 'FLAT'
      ? `${formatKrw(Math.abs(changeAmount))} ${changeDirection === 'UP' ? '올랐어요' : '내렸어요'}`
      : changeDirection === 'FLAT'
      ? '지난 달과 동일해요'
      : null

  return (
    <div className="bg-primary rounded-card-xl px-[22px] pt-[18px] pb-[20px] flex flex-col gap-4">
      {/* Header: 총자산 + 자세히 보기 버튼 */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-[5px]">
          <p className="text-sub text-white/75">총자산</p>
          <p className={`font-inter ${amountSizeClass} font-bold text-white whitespace-nowrap tracking-tight`}>
            {amountStr}
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
      <div className="flex items-center gap-4 max-[420px]:gap-2">
        <div className="shrink-0 max-[420px]:[&>svg]:w-28 max-[420px]:[&>svg]:h-28">
          <DonutChart segments={sortedSegments} />
        </div>
        <div className="flex-1 grid grid-cols-[1fr_auto] gap-x-2 gap-y-[11px] max-[420px]:gap-y-[6px] items-center">
          {sortedSegments.map(({ label, pct }, i) => (
            <Fragment key={label}>
              <div className="flex min-w-0 items-center gap-[7px]">
                <span
                  className="size-[8px] shrink-0 rounded-full"
                  style={{ backgroundColor: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
                />
                <span className="truncate text-sub max-[420px]:text-caption text-white/90">{label}</span>
              </div>
              <span className="font-inter text-sub max-[420px]:text-caption font-bold text-white text-right">{pct}%</span>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AssetCard
