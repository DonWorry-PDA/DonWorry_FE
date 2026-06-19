import { BackArrowIc, NavHomeIc, NotificationIc } from '../../../common/assets/icons'

interface Props {
  onNext: () => void
  onPrev: () => void
}

function AssetAuth({ onNext, onPrev }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex items-center justify-between px-6 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onPrev} className="text-ink">
            <BackArrowIc width={24} height={24} />
          </button>
          <span className="text-body text-ink-sub">자산 연결 방법 선택 · 인증하기 2/3</span>
        </div>
        <div className="flex gap-4 text-ink">
          <NotificationIc width={24} height={24} />
          <NavHomeIc width={24} height={24} />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 pt-8">
        <h1 className="text-heading font-bold text-ink">
          이용 중인 금융상품<br />연결을 위해 인증할게요
        </h1>

        <div className="mt-8 rounded-card-lg bg-primary p-5 text-white">
          <p className="text-card font-bold">김영수</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="size-6 rounded-full bg-white/30" />
            <span className="text-body">신한인증서</span>
          </div>
          <p className="mt-2 text-sub opacity-70">인증일 28.02.29</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 px-6 pb-10">
        <button type="button" className="text-body text-ink-sub underline">
          다른 방법으로 인증하기
        </button>
        <button
          type="button"
          onClick={onNext}
          className="w-full rounded-btn bg-primary py-4 text-btn font-bold text-white"
        >
          인증하기
        </button>
      </div>
    </div>
  )
}

export default AssetAuth
