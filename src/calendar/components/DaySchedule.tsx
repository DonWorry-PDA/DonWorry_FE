import { CATEGORY_STYLE } from '../eventCategory'
import type { ScheduleItem } from '../types/calendar'
import { formatSignedWon } from '../utils/monthGrid'

type Props = {
  title: string // '6월 25일 (수) 일정'
  items: ScheduleItem[]
}

function DaySchedule({ title, items }: Props) {
  return (
    <section className="pt-[14px]">
      <h2 className="text-body font-bold text-ink">{title}</h2>

      {items.length === 0 ? (
        <p className="py-6 text-center text-sub text-ink-hint">예정된 일정이 없어요</p>
      ) : (
        <ul>
          {items.map((item) => {
            const style = CATEGORY_STYLE[item.category]
            const amountColor = item.amountKrw < 0 ? 'text-ink' : style.text
            return (
              <li
                key={item.id}
                className="flex items-center gap-3 border-b border-divider py-[13px] last:border-b-0"
              >
                <span
                  className={`flex size-[34px] shrink-0 items-center justify-center rounded-full ${style.iconBg}`}
                >
                  <span className={`text-body ${style.text}`}>₩</span>
                </span>
                <span className="min-w-0 flex-1 truncate text-body text-ink">
                  {item.title}
                </span>
                <span className={`text-body font-bold ${amountColor}`}>
                  {formatSignedWon(item.amountKrw)}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default DaySchedule
