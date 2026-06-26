import { CATEGORY_STYLE, LEGEND_ORDER } from '../eventCategory'
import type { EventCategory } from '../types/calendar'

type Props = {
  // 그 달에 실제 등장하는 카테고리만 노출한다
  categories: EventCategory[]
}

function EventLegend({ categories }: Props) {
  const visible = LEGEND_ORDER.filter((cat) => categories.includes(cat))
  if (visible.length === 0) return null

  return (
    <div className="flex flex-wrap justify-center gap-x-[9px] gap-y-1 border-b border-track pt-[14px] pb-[15px]">
      {visible.map((cat) => {
        const style = CATEGORY_STYLE[cat]
        return (
          <div key={cat} className="flex items-center gap-[3px]">
            <span className={`size-[7px] rounded-[3.5px] ${style.dot}`} />
            <span className="text-caption text-ink-sub">{style.label}</span>
          </div>
        )
      })}
    </div>
  )
}

export default EventLegend
