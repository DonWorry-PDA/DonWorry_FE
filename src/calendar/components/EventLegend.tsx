import { CATEGORY_STYLE, LEGEND_ORDER } from '../eventCategory'

function EventLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-x-[9px] gap-y-1 border-b border-track pt-[14px] pb-[15px]">
      {LEGEND_ORDER.map((cat) => {
        const style = CATEGORY_STYLE[cat]
        return (
          <div key={cat} className="flex items-center gap-[3px]">
            <span className={`size-[7px] rounded-[3.5px] ${style.dot}`} />
            <span className="text-[0.65rem] text-ink-sub">{style.label}</span>
          </div>
        )
      })}
    </div>
  )
}

export default EventLegend
