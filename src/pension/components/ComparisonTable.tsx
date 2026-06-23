import { formatKrw } from '@/common/utils/formatKrw'
import type { PensionDeferComparisonRow } from '../types/pensionDefer'

type ComparisonTableProps = {
  rows: PensionDeferComparisonRow[]
  selectedRate: number
}

function ComparisonTable({ rows, selectedRate }: ComparisonTableProps) {
  return (
    <div className="mx-5">
      <div className="mb-2 flex items-center px-4">
        <p className="flex-1 text-sub font-semibold text-ink-sub">연기율</p>
        <p className="flex-1 text-center text-sub font-semibold text-ink-sub">연기 후 월연금</p>
        <p className="flex-1 text-right text-sub font-semibold text-ink-sub">안정도</p>
      </div>

      <div className="flex flex-col gap-[6px]">
        {rows.map((row) => (
          <TableRow
            key={row.deferRate}
            row={row}
            isSelected={row.deferRate === selectedRate}
          />
        ))}
      </div>
    </div>
  )
}

function TableRow({ row, isSelected }: { row: PensionDeferComparisonRow; isSelected: boolean }) {
  const rateLabel = row.deferRate === 0 ? '즉시' : `${row.deferRate}%`
  const isStable = row.stabilityAfter === '안정'

  return (
    <div
      className={[
        'flex items-center rounded-card px-4 py-[13px]',
        isSelected ? 'bg-primary-tint' : 'bg-surface',
      ].join(' ')}
    >
      <p
        className={[
          'flex-1 text-body',
          isSelected ? 'font-bold text-primary' : 'font-medium text-ink-sub',
        ].join(' ')}
      >
        {rateLabel}
      </p>

      <p
        className={[
          'flex-1 font-inter text-body text-center',
          isSelected ? 'font-bold text-ink' : 'font-medium text-ink',
        ].join(' ')}
      >
        {formatKrw(row.afterDeferMonthly)}
      </p>

      <div className="flex-1 flex justify-end">
        <span
          className={[
            'rounded-badge px-2 py-[3px] text-sub font-semibold',
            isStable ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning-text',
          ].join(' ')}
        >
          {row.stabilityAfter}
        </span>
      </div>
    </div>
  )
}

export default ComparisonTable
