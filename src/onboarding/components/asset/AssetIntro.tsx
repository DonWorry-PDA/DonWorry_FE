import { NavHomeIc, NotificationIc } from '../../../common/assets/icons'

interface Props {
  onNext: () => void
}

function AssetIntro({ onNext }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex items-center justify-between px-6 pt-12 pb-4">
        <span className="text-card font-bold text-ink">자산 연결</span>
        <div className="flex gap-4 text-ink">
          <NotificationIc width={24} height={24} />
          <NavHomeIc width={24} height={24} />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center px-6 pt-8">
        <h1 className="w-full text-heading font-bold text-ink">
          내 자산, 한눈에<br />모아서 관리해요
        </h1>
        <p className="mt-2 w-full text-body text-ink-sub">
          흩어진 금융자산을 연결하면 생활비 충당 상태를 정확히 알 수 있어요.
        </p>

        <div className="mt-12 flex size-24 items-center justify-center rounded-full bg-primary">
          <span className="text-card font-bold text-white">신한</span>
        </div>

        <p className="mt-6 text-center text-sub text-ink-sub">
          마이데이터인증서로 본인인증이 필요해요.<br />
          이용 중인 금융기관으로 안내 받으세요.
        </p>
      </div>

      <div className="px-6 pb-10">
        <button
          type="button"
          onClick={onNext}
          className="w-full rounded-btn bg-primary py-4 text-btn font-bold text-white"
        >
          한번에 불러오기
        </button>
      </div>
    </div>
  )
}

export default AssetIntro
