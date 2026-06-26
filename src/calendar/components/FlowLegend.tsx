import { FLOW_ORDER, FLOW_STYLE, type FlowType } from '../flowType'

type Props = {
  // 그 달에 실제 등장하는 흐름 유형만 노출
  flows: FlowType[]
}

function FlowLegend({ flows }: Props) {
  const visible = FLOW_ORDER.filter((f) => flows.includes(f))
  if (visible.length === 0) return null

  return (
    <div className="flex flex-wrap justify-center gap-x-[10px] gap-y-1 pt-[14px] pb-[15px]">
      {visible.map((f) => (
        <div key={f} className="flex items-center gap-[3px]">
          <span className={`size-[7px] rounded-full ${FLOW_STYLE[f].dot}`} />
          <span className="text-caption text-ink-sub">{FLOW_STYLE[f].label}</span>
        </div>
      ))}
    </div>
  )
}

export default FlowLegend
