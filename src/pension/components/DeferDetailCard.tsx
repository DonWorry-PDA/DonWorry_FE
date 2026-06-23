import { formatKrw } from '@/common/utils/formatKrw'
import type { PensionDeferDetail } from '../types/pensionDefer'

type DeferDetailCardProps = {
  data: PensionDeferDetail
}

function formatBreakEven(months: number): string {
  const years = Math.floor(months / 12)
  const remainMonths = months % 12
  if (years > 0 && remainMonths > 0) return `약 ${years}년 ${remainMonths}개월`
  if (years > 0) return `약 ${years}년`
  return `약 ${remainMonths}개월`
}

function DeferDetailCard({ data }: DeferDetailCardProps) {
  const {
    deferRate,
    deferYears,
    duringDeferMonthly,
    afterDeferMonthly,
    monthlyIncrease,
    breakEvenMonths,
    coverageRateBefore,
    coverageRateAfter,
  } = data

  const isImmediate = deferRate === 0
  const immediateRate = 100 - deferRate
  const title = isImmediate
    ? '즉시 수령 선택 시'
    : `${deferRate}% · ${deferYears}년 연기 선택 시`

  return (
    <div className="mx-5 overflow-hidden rounded-card-lg border-2 border-primary">
      {/* 헤더: 핵심 숫자 하나 */}
      <div className="bg-primary-tint px-5 pb-4 pt-5">
        <p className="text-sub font-semibold text-primary">{title}</p>
        <div className="mt-2 flex items-end gap-[6px]">
          <span className="font-inter text-display font-bold leading-none text-primary">
            월 {formatKrw(afterDeferMonthly)}
          </span>
          <span className="mb-[2px] text-body text-primary">· 평생</span>
        </div>
      </div>

      {/* 바디: 조용한 데이터 행 */}
      <div className="divide-y divide-line bg-white">
        <DetailRow
          label={`연기 중 월 수령 (${immediateRate}%)`}
          value={
            isImmediate
              ? formatKrw(duringDeferMonthly)
              : `${formatKrw(duringDeferMonthly)} + 자산 충당`
          }
        />
        {!isImmediate && (
          <DetailRow label="월 증가액" value={`+${formatKrw(monthlyIncrease)}`} />
        )}
        <DetailRow
          label="생활비 충당률"
          value={`${coverageRateBefore}% → ${coverageRateAfter}%`}
        />
        {!isImmediate && breakEvenMonths != null && (
          <DetailRow
            label="손익분기 (받기 시작 후)"
            value={formatBreakEven(breakEvenMonths)}
          />
        )}
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-[13px]">
      <p className="text-body text-ink-sub shrink-0">{label}</p>
      <p className="text-body font-bold text-right text-ink">{value}</p>
    </div>
  )
}

export default DeferDetailCard
