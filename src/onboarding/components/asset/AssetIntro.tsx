// import { NavHomeIc, NotificationIc } from '../../../common/assets/icons'
import { BackArrowIc } from '../../../common/assets/icons'

interface Props {
  onNext: () => void
  onPrev: () => void
}

function AssetIntro({ onNext, onPrev }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* AppBar */}
      <div className="flex items-center justify-between px-6 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onPrev} className="text-ink">
            <BackArrowIc width={24} height={24} />
          </button>
          <span className="text-card text-ink font-bold">자산연결</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center px-6 pt-8">
        <h1 className="text-heading text-ink w-full font-bold">
          내 자산, 한눈에
          <br />
          모아서 관리해요
        </h1>
        <p className="text-body text-ink-sub mt-2 w-full">
          흩어진 금융자산을 연결하면 생활비 충당 상태를 정확히 알 수 있어요.
        </p>

        <img
          src="/images/asset-intro-character.png"
          alt="연금Sol사 캐릭터"
          className="mt-18 w-150"
        />

        <p className="text-sub text-ink-sub mt-6 text-center">
          마이데이터인증서로 본인인증이 필요해요.
          <br />
          이용 중인 금융기관으로 안내 받으세요.
        </p>
      </div>

      <div className="px-6 pb-10">
        <button
          type="button"
          onClick={onNext}
          className="rounded-btn bg-primary text-btn w-full py-4 font-bold text-white"
        >
          한번에 불러오기
        </button>
      </div>
    </div>
  )
}

export default AssetIntro
