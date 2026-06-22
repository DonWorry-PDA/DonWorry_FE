import { useState } from 'react'
import { BackArrowIc } from '../../../common/assets/icons'
import OnboardingProgressBar from '../OnboardingProgressBar'
import SelectionCard from '../SelectionCard'
import { useOnboarding } from '../../contexts/OnboardingContext'
import type { Situation } from '../../types/onboarding'

interface Props {
  onNext: () => void
  onPrev: () => void
}

function Step1Situation({ onNext, onPrev }: Props) {
  const { answers, updateAnswers } = useOnboarding()
  const [selected, setSelected] = useState<Situation | null>(answers.situation)

  function handleSelect(value: Situation) {
    setSelected(value)
    updateAnswers({ situation: value })
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="px-6 pt-12">
        <button type="button" onClick={onPrev} className="mb-4 text-ink">
          <BackArrowIc width={24} height={24} />
        </button>
      </div>

      <OnboardingProgressBar current={1} total={6} />

      <div className="flex flex-1 flex-col px-6 pt-8">
        <h1 className="text-heading font-bold text-ink">
          지금 어떤 상황에<br />가까우신가요?
        </h1>
        <p className="mt-2 text-body text-ink-sub">
          상황에 맞게 필요한 것만 여쭤볼게요.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <SelectionCard
            title="은퇴를 준비하고 있어요"
            description="은퇴 시점까지의 계획을 함께 세워요"
            selected={selected === 'preparing'}
            onClick={() => handleSelect('preparing')}
          />
          <SelectionCard
            title="이미 은퇴했어요"
            description="지금 자산으로 매달 생활비를 만들어요"
            selected={selected === 'retired'}
            onClick={() => handleSelect('retired')}
          />
        </div>
      </div>

      <div className="px-6 pb-10">
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

export default Step1Situation
