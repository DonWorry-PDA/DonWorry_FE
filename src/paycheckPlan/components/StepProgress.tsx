type StepProgressProps = {
  current: number
  total: number
}

function StepProgress({ current, total }: StepProgressProps) {
  return (
    <div className="px-5 pt-1 pb-4">
      <p className="text-sub text-ink-hint mb-2">
        설계 준비 {current} / {total}
      </p>
      <div className="h-1 w-full rounded-full bg-track">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  )
}

export default StepProgress
