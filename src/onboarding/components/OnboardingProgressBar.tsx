interface Props {
  current: number // 1–6 (피그마 표시 기준)
  total: number // 항상 6
}

function OnboardingProgressBar({ current, total }: Props) {
  const widthPct = Math.round((current / total) * 100)

  return (
    <div className="w-full" role="status" aria-live="polite" aria-label={`온보딩 진행: ${current} / ${total} 단계`}>
      <p className="px-6 pb-3 text-sub text-ink-sub">
        {current}/{total} 단계
      </p>
      <div className="h-[2px] w-full bg-track">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${widthPct}%` }}
        />
      </div>
    </div>
  )
}

export default OnboardingProgressBar
