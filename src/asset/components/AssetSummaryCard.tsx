import { formatKrw } from '../../common/utils/formatKrw'
import type { AssetAllocationSegment } from '../types/asset'

type Props = {
  totalAmountKrw: number
  changeAmountKrw: number | null
  changeDirection: 'UP' | 'DOWN' | 'FLAT'
  allocation: AssetAllocationSegment[]
  monthlyIncomeKrw: number
  monthlyExpenseKrw: number
}

// 분포 막대/범례에 쓰는 파랑 계열 음영 (진함 → 옅음)
const SEGMENT_COLORS = ['#0046ff', '#4f7dff', '#9db8ff', '#cdd9ff', '#e7edff']

function toMan(krw: number) {
  return Math.round(krw / 10_000).toLocaleString('ko-KR')
}

function AssetSummaryCard({
  totalAmountKrw,
  changeAmountKrw,
  changeDirection,
  allocation,
  monthlyIncomeKrw,
  monthlyExpenseKrw,
}: Props) {
  const showChange = changeDirection !== 'FLAT' && changeAmountKrw != null
  const changeColor = changeDirection === 'UP' ? 'text-success' : 'text-danger'
  const changeArrow = changeDirection === 'UP' ? '▲' : '▼'

  return (
    <div className="rounded-card-lg border border-line bg-white p-5">
      {/* 총 보유금 */}
      <p className="text-body text-ink-hint">총 보유금</p>
      <div className="mt-1 flex items-end gap-2">
        <span className="font-inter text-display text-ink font-bold tracking-tight">
          {formatKrw(totalAmountKrw)}
        </span>
        {showChange && (
          <span className={`text-sub pb-1 font-bold ${changeColor}`}>
            {changeArrow} {toMan(Math.abs(changeAmountKrw as number))}만원
          </span>
        )}
      </div>

      {allocation.length === 0 ? (
        <p className="text-caption text-ink-hint mt-4">자산 분포 데이터가 없습니다</p>
      ) : (
        <>
          {/* 분포 막대 */}
          <div className="mt-4 flex h-2 overflow-hidden rounded-full">
            {allocation.map(({ label, pct }, i) => (
              <div
                key={`${label}-${i}`}
                style={{ width: `${pct}%`, backgroundColor: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
              />
            ))}
          </div>
          {/* 범례 */}
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
            {allocation.map(({ label, pct }, i) => (
              <span key={`${label}-${i}`} className="text-caption text-ink-sub flex items-center gap-1">
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
                />
                {label} {pct}%
              </span>
            ))}
          </div>
        </>
      )}

      {/* 이번 달 수입/지출 */}
      <div className="border-line mt-4 flex border-t pt-4">
        <div className="flex-1">
          <p className="text-caption text-ink-hint">이번 달 수입</p>
          <p className="text-md text-ink mt-1 font-bold">{toMan(monthlyIncomeKrw)}만원</p>
        </div>
        <div className="bg-line w-px" />
        <div className="flex-1 pl-4">
          <p className="text-caption text-ink-hint">이번 달 지출</p>
          <p className="text-md text-ink mt-1 font-bold">{toMan(monthlyExpenseKrw)}만원</p>
        </div>
      </div>
    </div>
  )
}

export default AssetSummaryCard
