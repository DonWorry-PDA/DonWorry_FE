import { CATEGORY_STYLE, SHEET_ONLY_CATEGORIES } from '../eventCategory'
import type { DayEventsMap } from '../types/calendar'
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

// 셀에는 항목 라벨만(최대 2줄) — 금액 등 상세는 날짜 탭 시 바텀시트에서 확인한다.
const MAX_LINES = 2

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
      <div className="grid grid-cols-7 gap-y-[6px]">
        {cells.map((cell) => {
          // 그리드엔 월급(현금흐름) 계산 항목만 — 소비·투자는 시트에서만 본다
          const gridEvents = (events[cell.iso] ?? []).filter(
            (e) => !SHEET_ONLY_CATEGORIES.includes(e.category),
          )
          const isToday = cell.iso === todayIso
          const isSelected = cell.iso === selectedIso

          return (
            <button
              key={cell.iso}
              onClick={() => onSelect(cell.iso)}
              className="flex flex-col items-center gap-[3px] py-1.5"
            >
              <span
                className={`flex size-8 items-center justify-center rounded-full text-md font-medium leading-none ${
                  isToday
                    ? 'bg-primary font-bold text-white'
                    : isSelected
                      ? 'bg-primary-tint font-bold text-primary'
                      : weekdayColor(cell.weekday, cell.inMonth)
                }`}
              >
                {cell.day}
              </span>

              {/* 항목 라벨 칩(카테고리 색). 빈 날도 높이 유지해 행 정렬 */}
              <span className="flex min-h-[28px] w-full flex-col items-stretch gap-px px-0.5">
                {gridEvents.slice(0, MAX_LINES).map((e, i) => {
                  const style = CATEGORY_STYLE[e.category]
                  return (
                    <span
                      key={i}
                      className={`truncate rounded-[4px] px-1 text-center text-[0.625rem] leading-[1.35] ${style.badgeBg} ${style.text}`}
                    >
                      {e.short}
                    </span>
                  )
                })}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MonthGrid
