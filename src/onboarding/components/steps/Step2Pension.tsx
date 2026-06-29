import { useState } from 'react'
import { BackArrowIc } from '../../../common/assets/icons'
import OnboardingProgressBar from '../OnboardingProgressBar'
import SelectionCard from '../SelectionCard'
import { useOnboarding } from '../../contexts/OnboardingContext'
import type { PensionStatus } from '../../types/onboarding'

interface Props {
  onNext: () => void
  onPrev: () => void
}

function Step2Pension({ onNext, onPrev }: Props) {
  const { answers, updateAnswers } = useOnboarding()
  const [selected, setSelected] = useState<PensionStatus | null>(answers.pensionStatus)

  function handleSelect(value: PensionStatus) {
    setSelected(value)
    updateAnswers({ pensionStatus: value })
  }

  return (
    <div className="flex h-dvh flex-col bg-white">
      <div className="px-6 pt-12">
        <button type="button" onClick={onPrev} className="mb-4 text-ink">
          <BackArrowIc width={24} height={24} />
        </button>
      </div>

      <OnboardingProgressBar current={2} total={6} />

      <div className="flex flex-1 min-h-0 flex-col overflow-y-auto px-6 pt-8">
        <h1 className="text-heading font-bold text-ink">
          국민연금은<br />받고 계신가요?
        </h1>
        <p className="mt-2 text-body text-ink-sub">
          받기 전이라면, 언제부터 받을지도 함께 따져볼 수 있어요.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <SelectionCard
            title="아직 받기 전이에요"
            description="지금 받기 vs 미루기를 비교해드려요"
            selected={selected === 'before'}
            onClick={() => handleSelect('before')}
          />
          <SelectionCard
            title="받고 있어요"
            description="매달 들어오는 현금을 월급에 더해요"
            selected={selected === 'receiving'}
            onClick={() => handleSelect('receiving')}
          />
        </div>
      </div>

      <div className="relative shrink-0 px-6 pb-10">
        <div className="pointer-events-none absolute -top-8 inset-x-0 h-8 bg-gradient-to-b from-white/0 to-white" />
        <button
          type="button"
          onClick={onNext}
          disabled={selected === null}
          className="w-full rounded-btn bg-primary py-4 text-btn font-bold text-white disabled:bg-disabled disabled:text-white"
        >
          다음
        </button>
      </div>
    </div>
  )
}

export default Step2Pension
