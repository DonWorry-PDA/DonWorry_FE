import { BackArrowIc } from '../../../common/assets/icons'

interface Props {
  onNext: () => void
  onPrev: () => void
}

function AssetAuth({ onNext, onPrev }: Props) {
  return (
    <div className="flex h-dvh flex-col bg-white">
      {/* AppBar */}
      <div className="flex items-center justify-between px-6 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onPrev} className="text-ink">
            <BackArrowIc width={24} height={24} />
          </button>
          <span className="text-card text-ink font-bold">자산연결</span>
        </div>
        {/* <div className="flex items-center gap-3">
          <button type="button" aria-label="고객센터" className="text-ink">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8.5 14.5s1.5 1.5 3.5 1.5 3.5-1.5 3.5-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="9.5" cy="10.5" r="1" fill="currentColor" />
              <circle cx="14.5" cy="10.5" r="1" fill="currentColor" />
            </svg>
          </button>
          <button type="button" aria-label="닫기" className="text-ink">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div> */}
      </div>

      {/* 단계 표시 */}
      <div className="border-line flex items-center justify-between border-b px-6 py-3">
        <span className="text-body text-ink-sub">자산연결방법 선택</span>
        <span className="bg-surface-muted text-sub text-ink-sub rounded-full px-3 py-0.5">2/3</span>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-6 pt-8">
        <h1 className="text-heading text-ink font-bold">
          이용 중이신 금융상품
          <br />
          연결을 위해 인증할게요
        </h1>

        {/* 인증서 카드 */}
        <div className="rounded-card-xl bg-primary relative mt-8 overflow-hidden p-6 text-white">
          <div
            className="pointer-events-none absolute top-0 right-0 text-[120px] leading-none font-black text-white/10 select-none"
            aria-hidden="true"
          >
            신
          </div>

          <p className="text-card font-bold">김준수</p>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-full border border-white/50">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M3 7.5c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4"
                  stroke="white"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  d="M5 5.5l2 2-2 2"
                  stroke="white"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-body">신한인증서</span>
          </div>

          <p className="text-body mt-4">만료일 28.02.29</p>

          <span className="rounded-badge text-sub mt-2 inline-block bg-white/20 px-2.5 py-0.5">
            D-620
          </span>
        </div>

        {/* <button
          type="button"
          className="text-body text-ink-sub mt-6 flex w-full items-center justify-center gap-0.5"
        >
          다른방법으로 인증하기
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M6 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button> */}
      </div>

      <div className="shrink-0 px-6 pb-10">
        <button
          type="button"
          onClick={onNext}
          className="rounded-btn bg-primary text-btn w-full py-4 font-bold text-white"
        >
          인증하기
        </button>
      </div>
    </div>
  )
}

export default AssetAuth
