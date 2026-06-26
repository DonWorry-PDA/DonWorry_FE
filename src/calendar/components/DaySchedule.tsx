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
        <p className="py-8 text-center text-sub text-ink-hint">예정된 일정이 없어요</p>
      ) : (
        <ul className="pt-1">
          {items.map((item) => {
            const style = CATEGORY_STYLE[item.category]
            const hasAmount = item.amountKrw !== null
            // 수입(+) 파랑 · 지출(−) 빨강으로 입출 방향을 명확히
            const amountColor = hasAmount && item.amountKrw! < 0 ? 'text-danger' : 'text-primary'
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
                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                  <span className="truncate text-body text-ink">{item.title}</span>
                  {item.estimated && (
                    <span className="shrink-0 rounded-badge bg-surface-muted px-1.5 py-0.5 text-caption text-ink-sub">
                      예상
                    </span>
                  )}
                </div>
                {hasAmount && (
                  <span className={`text-body font-bold ${amountColor}`}>
                    {formatSignedWon(item.amountKrw!)}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default DaySchedule
