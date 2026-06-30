import Badge from '@/common/components/Badge'
import { formatKrw } from '@/common/utils/formatKrw'
import type { SimResult } from '../types/simulation'

function formatMonths(months: number): string {
  const years = Math.floor(months / 12)
  const m = months % 12
  if (years === 0) return `약 ${m}개월`
  if (m === 0) return `약 ${years}년`
  return `약 ${years}년 ${m}개월`
}

const FILL_COLOR: Record<SimResult['status'], string> = {
  stable: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
}

const badgeTone: Record<SimResult['status'], 'success' | 'warning' | 'danger'> = {
  stable: 'success',
  warning: 'warning',
  danger: 'danger',
}

const statusLabel: Record<SimResult['status'], string> = {
  stable: '충당 가능',
  warning: '보완 필요',
  danger: '개선 필요',
}

const CX = 122
const CY = 130
const R = 100
const STROKE_WIDTH = 14
const CIRCUMFERENCE = Math.PI * R
const TRACK_PATH = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`

function CoverageGauge({ pct, status }: { pct: number; status: SimResult['status'] }) {
  const fillColor = FILL_COLOR[status]
  const dashOffset = CIRCUMFERENCE * (1 - Math.min(pct, 100) / 100)

  return (
    <div className="mx-auto w-full max-w-[260px]">
      <svg
        viewBox="0 0 244 156"
        overflow="visible"
        fill="none"
        aria-label={`생활비 충당률 ${pct}%`}
        className="w-full"
      >
        {/* 트랙 */}
        <path
          d={TRACK_PATH}
          stroke="#EDF0F4"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
        />
        {/* 채움 — strokeDashoffset 애니메이션 */}
        <path
          d={TRACK_PATH}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={`${CIRCUMFERENCE}`}
          style={{
            stroke: fillColor,
            strokeDashoffset: dashOffset,
            transition:
              'stroke-dashoffset 0.45s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s ease',
          }}
        />
        {/* 퍼센트 숫자 */}
        <text
          x={CX}
          y={86}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Inter, 'Noto Sans KR', sans-serif"
          fontWeight="800"
          fontSize="30"
          style={{ fill: fillColor, transition: 'fill 0.3s ease' }}
        >
          {pct}%
        </text>
        {/* 레이블 */}
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
        {/* 끝 레이블 */}
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
    </div>
  )
}

function SimResultCards({ result }: { result: SimResult }) {
  const { coverageRatePct, monthlyShortfallKrw, coverableMonths, status } = result

  const durationText =
    monthlyShortfallKrw === 0 && coverableMonths === 0
      ? '충당 가능'
      : coverableMonths === 0
        ? '즉시 소진'
        : coverableMonths >= 1200
          ? '100년 이상'
          : formatMonths(coverableMonths)

  return (
    <div className="px-5 pb-2">
      <CoverageGauge pct={coverageRatePct} status={status} />

      <CashflowBreakdown result={result} />

      <div className="mt-3">
        <MetricCard label="생활비 지속 가능 기간">
          <span className="font-inter text-card font-bold text-ink">{durationText}</span>
        </MetricCard>
      </div>

      <div className="mt-3 flex justify-end">
        <Badge tone={badgeTone[status]}>{statusLabel[status]}</Badge>
      </div>
    </div>
  )
}

// 월 수입 구성(연금 + 투자수익)과 생활비 대비를 보여줘 게이지가 왜 그 %인지 설명
function CashflowBreakdown({ result }: { result: SimResult }) {
  const {
    monthlyPensionKrw,
    monthlyInvestmentIncomeKrw,
    monthlyIncomeKrw,
    monthlyLivingKrw,
    monthlyShortfallKrw,
  } = result
  const pensionPct = monthlyIncomeKrw > 0 ? (monthlyPensionKrw / monthlyIncomeKrw) * 100 : 0
  const investPct = monthlyIncomeKrw > 0 ? (monthlyInvestmentIncomeKrw / monthlyIncomeKrw) * 100 : 0

  return (
    <div className="mt-5">
      <p className="mb-2 text-sub font-semibold text-ink-hint">월 현금흐름</p>
      {/* 수입 구성 막대 (연금 + 투자수익) */}
      <div className="mb-3 flex h-2.5 overflow-hidden rounded-full bg-track" aria-hidden="true">
        <div className="bg-primary" style={{ width: `${pensionPct}%` }} />
        <div className="bg-primary-muted" style={{ width: `${investPct}%` }} />
      </div>
      <div className="rounded-card-lg bg-surface px-4 py-3">
        <CashflowRow dotClass="bg-primary" label="연금" value={monthlyPensionKrw} />
        <CashflowRow dotClass="bg-primary-muted" label="투자수익" value={monthlyInvestmentIncomeKrw} sign="+" />
        <div className="my-2 border-t border-divider" />
        <CashflowRow label="월 수입" value={monthlyIncomeKrw} bold />
        <CashflowRow label="월 생활비" value={monthlyLivingKrw} sign="−" />
        <div className="my-2 border-t border-divider" />
        {monthlyShortfallKrw > 0 ? (
          <CashflowRow label="월 부족액" value={monthlyShortfallKrw} bold valueClass="text-danger" />
        ) : (
          <div className="flex items-center justify-between py-0.5">
            <span className="text-body font-bold text-ink">충당 상태</span>
            <span className="text-body font-bold text-success">생활비 충당</span>
          </div>
        )}
      </div>
    </div>
  )
}

interface CashflowRowProps {
  label: string
  value: number
  sign?: string
  bold?: boolean
  dotClass?: string
  valueClass?: string
}

function CashflowRow({ label, value, sign = '', bold = false, dotClass, valueClass }: CashflowRowProps) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="flex items-center gap-1.5">
        {dotClass && <span className={`size-2 shrink-0 rounded-full ${dotClass}`} aria-hidden="true" />}
        <span className={bold ? 'text-body font-bold text-ink' : 'text-body text-ink-sub'}>{label}</span>
      </span>
      <span className={`font-inter text-body ${bold ? 'font-bold' : 'font-semibold'} ${valueClass ?? 'text-ink'}`}>
        {sign}
        {formatKrw(value)}
      </span>
    </div>
  )
}

function MetricCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-card-lg bg-surface px-4 py-4">
      <p className="mb-1.5 text-sub text-ink-hint">{label}</p>
      {children}
    </div>
  )
}

export default SimResultCards
