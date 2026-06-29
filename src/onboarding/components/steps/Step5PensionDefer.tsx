import { BackArrowIc } from '../../../common/assets/icons'
import OnboardingProgressBar from '../OnboardingProgressBar'

interface Props {
  onNext: () => void
  onPrev: () => void
}

function Step5PensionDefer({ onNext, onPrev }: Props) {
  return (
    <div className="flex h-dvh flex-col bg-white">
      <div className="px-6 pt-12">
        <button type="button" onClick={onPrev} className="mb-4 text-ink">
          <BackArrowIc width={24} height={24} />
        </button>
      </div>

      <OnboardingProgressBar current={6} total={6} />

      <div className="flex flex-1 min-h-0 flex-col overflow-y-auto px-6 pt-8">
        <h1 className="text-heading font-bold text-ink">
          받기 전이시라면,<br />이것 하나만 보고 가세요
        </h1>
        <p className="mt-2 text-body text-ink-sub">
          국민연금은 1년 미룰 때마다 7.2%씩 늘어나요. 물가에 따라 오르고, 평생 받아요.
        </p>

        <div className="mt-8 flex gap-3">
          <div className="flex-1 rounded-card border border-line bg-white p-4">
            <p className="text-sub text-ink-sub">지금 받으면</p>
            <p className="mt-2 font-inter text-card font-bold text-ink">월 120만원</p>
            <p className="mt-1 text-sub text-ink-sub">65세부터</p>
          </div>
          <div className="flex-1 rounded-card border-2 border-primary bg-primary-tint p-4">
            <p className="text-sub font-bold text-primary">5년 미루면</p>
            <p className="mt-2 font-inter text-card font-bold text-primary">월 163만원</p>
            <p className="mt-1 text-sub text-primary">70세부터·평생</p>
          </div>
        </div>

        <div className="mt-4 rounded-card bg-surface p-4">
          <p className="text-sub text-ink-sub">
            미루는 동안의 생활비는 갖고 계신 자산으로 메울 수 있는지까지 홈에서 함께 계산해드려요.
            지금 정하지 않아도 돼요.
          </p>
        </div>
      </div>

      <div className="relative shrink-0 px-6 pb-10">
        <div className="pointer-events-none absolute -top-8 inset-x-0 h-8 bg-gradient-to-b from-white/0 to-white" />
        <button
          type="button"
          onClick={onNext}
          className="w-full rounded-btn bg-primary py-4 text-btn font-bold text-white"
        >
          자산 연결하고 시작하기
        </button>
      </div>
    </div>
  )
}

export default Step5PensionDefer
