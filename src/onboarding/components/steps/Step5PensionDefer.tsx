import { useState } from 'react'
import { BackArrowIc } from '../../../common/assets/icons'
import OnboardingProgressBar from '../OnboardingProgressBar'

type CompareOption = 'now' | 'defer'

interface Props {
  onNext: () => void
  onPrev: () => void
}

function Step5PensionDefer({ onNext, onPrev }: Props) {
  const [selected, setSelected] = useState<CompareOption>('now')

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

        {/* 토글 탭 */}
        <div className="mt-8 flex gap-1 rounded-card bg-surface-muted p-1">
          {(['now', 'defer'] as CompareOption[]).map((option) => {
            const isSelected = selected === option
            const label = option === 'now' ? '지금 받으면' : '5년 미루면'
            return (
              <button
                key={option}
                type="button"
                onClick={() => setSelected(option)}
                className={`flex h-[2.875rem] flex-1 items-center justify-center rounded-icon text-md transition-all ${
                  isSelected
                    ? 'bg-white font-bold text-primary shadow-[0px_1px_2px_rgba(0,0,0,0.10)]'
                    : 'font-semibold text-ink-sub'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* 비교 카드 */}
        {selected === 'now' ? (
          <div className="mt-4 rounded-card border border-line bg-white p-6">
            <p className="text-sub text-ink-sub">65세부터 수령</p>
            <p className="mt-3 font-inter text-jumbo font-bold text-ink">120만원</p>
            <p className="mt-1 text-body text-ink-sub">매달</p>
          </div>
        ) : (
          <div className="mt-4 rounded-card border-2 border-primary bg-primary-tint p-6">
            <div className="flex items-center gap-2">
              <p className="text-sub font-bold text-primary">70세부터 수령</p>
              <span className="rounded-badge bg-primary px-2 py-0.5 text-caption font-bold text-white">
                +43만원
              </span>
            </div>
            <p className="mt-3 font-inter text-jumbo font-bold text-primary">163만원</p>
            <p className="mt-1 text-body text-primary/70">매달·평생</p>
          </div>
        )}

        {selected === 'defer' && (
          <p className="mt-3 text-sub text-ink-sub">
            지금 받는 것보다 <span className="font-bold text-primary">월 43만원</span> 더 받아요
          </p>
        )}

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
