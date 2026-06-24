function SimParamsBarSkeleton() {
  return (
    <div
      className="flex animate-pulse items-center gap-3 px-5 py-3"
      aria-busy="true"
      aria-label="시뮬레이션 파라미터 로딩 중"
    >
      <div className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-1">
        {/* 나이 */}
        <div className="h-[0.8125rem] w-[2.5rem] rounded bg-surface-muted" />
        <div className="h-[0.8125rem] w-[0.375rem] rounded bg-surface-muted" />
        {/* 자산 */}
        <div className="h-[0.8125rem] w-[3rem] rounded bg-surface-muted" />
        <div className="h-[0.8125rem] w-[0.375rem] rounded bg-surface-muted" />
        {/* 생활비 */}
        <div className="h-[0.8125rem] w-[3.5rem] rounded bg-surface-muted" />
        <div className="h-[0.8125rem] w-[0.375rem] rounded bg-surface-muted" />
        {/* 연금 */}
        <div className="h-[0.8125rem] w-[3rem] rounded bg-surface-muted" />
      </div>
      {/* 수정 버튼 자리 */}
      <div className="h-[0.8125rem] w-[2rem] shrink-0 rounded bg-surface-muted" />
    </div>
  )
}

export default SimParamsBarSkeleton
