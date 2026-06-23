import { CATEGORY_STYLE } from '../eventCategory'
import type { DayEventsMap } from '../types/calendar'
import { buildMonthGrid, formatMan, WEEKDAY_LABELS } from '../utils/monthGrid'

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
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((cell) => {
          const dayEvents = events[cell.iso] ?? []
          const isToday = cell.iso === todayIso
          const isSelected = cell.iso === selectedIso

          return (
            <button
              key={cell.iso}
              onClick={() => onSelect(cell.iso)}
              className="flex min-h-[46px] flex-col items-center gap-px py-[5px]"
            >
              <span
                className={`flex h-6 min-w-[30px] items-center justify-center rounded-full text-sub font-medium ${
                  isToday
                    ? 'bg-primary font-bold text-white'
                    : isSelected
                      ? 'bg-primary-tint font-bold text-primary'
                      : weekdayColor(cell.weekday, cell.inMonth)
                }`}
              >
                {cell.day}
              </span>

              {dayEvents.map((e, i) => {
                const style = CATEGORY_STYLE[e.category]
                return (
                  <span
                    key={i}
                    className={`flex w-full flex-col items-center rounded-[5px] px-[3px] py-px leading-[1.15] ${style.badgeBg}`}
                  >
                    <span className={`text-[0.625rem] ${style.text}`}>{e.short}</span>
                    {e.amountKrw !== null && (
                      <span className={`text-[0.625rem] ${style.text}`}>
                        {formatMan(Math.abs(e.amountKrw))}
                      </span>
                    )}
                  </span>
                )
              })}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MonthGrid
