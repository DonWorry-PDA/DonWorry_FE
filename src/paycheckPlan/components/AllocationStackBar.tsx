import type { AllocationItem } from '../types/paycheckPlan'

type AllocationStackBarProps = {
  allocations: AllocationItem[]
}

function AllocationStackBar({ allocations }: AllocationStackBarProps) {
  return (
    <div className="mb-4">
      {/* 스택 바 */}
      <div className="flex rounded-full overflow-hidden h-2 mb-4">
        {allocations.map((item, i) => (
          <div key={i} style={{ width: `${item.ratio}%`, backgroundColor: item.color }} />
        ))}
      </div>

      {/* 범례 */}
      <div className="flex flex-col gap-2.5">
        {allocations.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-body text-ink">{item.label}</span>
            </div>
            <span className="text-body text-ink-sub font-inter">
              {item.ratio}% · {item.detail}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllocationStackBar
