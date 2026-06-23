import Badge from '@/common/components/Badge'
import { formatKrw } from '@/common/utils/formatKrw'
import type { SimResult } from '../types/simulation'

interface SimResultCardsProps {
  result: SimResult
}

function formatMonths(months: number): string {
  const years = Math.floor(months / 12)
  const m = months % 12
  if (years === 0) return `약 ${m}개월`
  if (m === 0) return `약 ${years}년`
  return `약 ${years}년 ${m}개월`
}

const coverageValueClass: Record<SimResult['status'], string> = {
  stable: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
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

function SimResultCards({ result }: SimResultCardsProps) {
  const { coverageRatePct, monthlyShortfallKrw, coverableMonths, status } = result

  return (
    <div className="px-5">
      <p className="mb-3 text-sub font-semibold text-ink-hint">이 조건이라면</p>

      {/* 상단 두 카드 */}
      <div className="mb-3 grid grid-cols-2 gap-3">
        <ResultCard label="생활비 충당률">
          <span className={`font-inter text-display font-bold ${coverageValueClass[status]}`}>
            {coverageRatePct}%
          </span>
        </ResultCard>
        <ResultCard label="월 부족액">
          <span className="font-inter text-display font-bold text-ink">
            {monthlyShortfallKrw === 0 ? '없음' : formatKrw(monthlyShortfallKrw)}
          </span>
        </ResultCard>
      </div>

      {/* 하단 넓은 카드 */}
      <ResultCard label="부족분 보완 가능 기간">
        <div className="flex items-center justify-between">
          <span className="font-inter text-display font-bold text-ink">
            {coverableMonths === 0 ? '충당 가능' : formatMonths(coverableMonths)}
          </span>
          {status !== 'stable' && (
            <Badge tone={badgeTone[status]}>{statusLabel[status]}</Badge>
          )}
        </div>
      </ResultCard>
    </div>
  )
}

function ResultCard({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-card border border-line bg-white px-4 py-4">
      <p className="mb-2 text-sub text-ink-hint">{label}</p>
      {children}
    </div>
  )
}

export default SimResultCards
