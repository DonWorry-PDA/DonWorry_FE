import { BackArrowIc } from '../../../common/assets/icons'
import useCurrentUser from '../../../common/hooks/useCurrentUser'
import { calcDday } from '../../../common/utils/formatDate'

interface Props {
  onNext: () => void
  onPrev: () => void
}

// 신한인증서 만료일(목업). 사용자별 인증서 데이터가 BE에 없어 정적 값으로 유지하되,
// 만료일을 단일 출처로 두고 표시 문자열과 D-day(calcDday)를 함께 파생해 값이 서로 어긋나지 않게 한다.
const CERT_EXPIRY = new Date(2028, 1, 29) // 2028-02-29

function formatExpiry(date: Date) {
  const yy = String(date.getFullYear()).slice(2)
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yy}.${mm}.${dd}`
}

function AssetAuth({ onNext, onPrev }: Props) {
  const { data: currentUser } = useCurrentUser()
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

      <div className="flex flex-1 min-h-0 flex-col overflow-y-auto px-6 pt-8">
        <h1 className="text-heading text-ink font-bold">
          이용 중이신 금융상품
          <br />
          연결을 위해 인증할게요
        </h1>

        {/* 인증서 카드 */}
        <button
          type="button"
          onClick={onNext}
          className="rounded-card-xl bg-primary relative mt-8 w-full overflow-hidden p-6 text-left text-white active:opacity-90"
        >
          <svg
            className="pointer-events-none absolute top-0 right-0 select-none"
            width="144"
            height="128"
            viewBox="0 0 144 128"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="144" cy="0" r="64" stroke="white" strokeWidth="1.5" strokeOpacity="0.2" />
            <circle cx="144" cy="0" r="94" stroke="white" strokeWidth="1.5" strokeOpacity="0.13" />
            <circle cx="144" cy="0" r="124" stroke="white" strokeWidth="1.5" strokeOpacity="0.08" />
          </svg>

          <p className="text-card font-bold">{currentUser?.name ?? ''}</p>

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

          <p className="text-body mt-4">만료일 {formatExpiry(CERT_EXPIRY)}</p>

          <span className="rounded-badge text-sub mt-2 inline-block bg-white/20 px-2.5 py-0.5">
            {calcDday(CERT_EXPIRY)}
          </span>
        </button>

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

      <div className="relative shrink-0 px-6 pb-10">
        <div className="pointer-events-none absolute -top-8 inset-x-0 h-8 bg-gradient-to-b from-white/0 to-white" />
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
