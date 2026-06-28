import type { DayEventsMap } from '../types/calendar'
import { BLOCK_STYLE, FLOW_STYLE, blockCategoriesOf, flowTypesOf, isBlockEstimated } from '../flowType'
import { buildMonthGrid, WEEKDAY_LABELS } from '../utils/monthGrid'

type Props = {
  year: number
  month0: number // 0-based
  todayIso: string
  selectedIso: string
  events: DayEventsMap
  onSelect: (iso: string) => void
}

function weekdayColor(weekday: number, inMonth: boolean): string {
  if (!inMonth) return 'text-disabled'
  if (weekday === 0) return 'text-event-pension' // 일요일
  if (weekday === 6) return 'text-primary' // 토요일
  return 'text-ink'
}

function MonthGrid({ year, month0, todayIso, selectedIso, events, onSelect }: Props) {
  const cells = buildMonthGrid(year, month0)

  return (
    <div>
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 pb-2">
        {WEEKDAY_LABELS.map((label, i) => (
          <span
            key={label}
            className={`text-caption text-center ${
              i === 0 ? 'text-event-pension' : i === 6 ? 'text-primary' : 'text-ink-hint'
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-y-[10px]">
        {cells.map((cell) => {
          const dayEvents = events[cell.iso] ?? []
          // 연금·배당·이자·납입·만기는 라벨 블록, 매수/매도/입금/출금(소비 포함)은 점.
          const blocks = blockCategoriesOf(dayEvents).slice(0, 2)
          const flows = flowTypesOf(dayEvents)
          const isToday = cell.iso === todayIso
          const isSelected = cell.iso === selectedIso

          return (
            <button
              key={cell.iso}
              onClick={() => onSelect(cell.iso)}
              className="flex min-h-[76px] flex-col items-center gap-[5px] py-1.5"
            >
              <span
                className={`flex size-9 items-center justify-center rounded-full text-btn font-medium leading-none ${
                  isToday
                    ? 'bg-primary font-bold text-white'
                    : isSelected
                      ? 'bg-primary-tint font-bold text-primary'
                      : weekdayColor(cell.weekday, cell.inMonth)
                }`}
              >
                {cell.day}
              </span>

              {/* 카테고리 라벨 블록 */}
              {blocks.length > 0 && (
                <span className="flex w-full flex-col items-stretch gap-0.5 px-0.5">
                  {blocks.map((cat) => {
                    const b = BLOCK_STYLE[cat]
                    // 확정=채운 칩 / 예정(estimated)=점선 테두리 칩 (배당 등 미래 예정분 구분)
                    const estimated = isBlockEstimated(dayEvents, cat)
                    return (
                      <span
                        key={cat}
                        className={`truncate rounded-[5px] px-1.5 py-0.5 text-center text-caption leading-[1.4] ${
                          estimated ? b.estimatedChip : b.chip
                        }`}
                      >
                        {b.label}
                      </span>
                    )
                  })}
                </span>
              )}

              {/* 흐름 점(입금/출금/매수/매도). 빈 날도 높이 유지해 행 정렬 */}
              <span className="flex h-[7px] items-center gap-[4px]">
                {flows.map((f) => (
                  <span key={f} className={`size-[6px] rounded-full ${FLOW_STYLE[f].dot}`} />
                ))}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MonthGrid
