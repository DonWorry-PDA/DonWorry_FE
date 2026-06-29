import { useState } from 'react'
import { BackArrowIc } from '../../../common/assets/icons'
import OnboardingProgressBar from '../OnboardingProgressBar'
import { useOnboarding } from '../../contexts/OnboardingContext'

interface Props {
  onNext: () => void
  onPrev: () => void
}

function Step3BasicInfo({ onNext, onPrev }: Props) {
  const { answers, updateAnswers } = useOnboarding()
  const [age, setAge] = useState<string>(answers.age?.toString() ?? '63')
  const [retiredYear, setRetiredYear] = useState<string>(
    answers.retiredYear?.toString() ?? '2024'
  )

  function handleNext() {
    updateAnswers({
      age: age ? parseInt(age, 10) : null,
      retiredYear: retiredYear ? parseInt(retiredYear, 10) : null,
    })
    onNext()
  }

  return (
    <div className="flex h-dvh flex-col bg-white">
      <div className="px-6 pt-12">
        <button type="button" onClick={onPrev} className="mb-4 text-ink">
          <BackArrowIc width={24} height={24} />
        </button>
      </div>

      <OnboardingProgressBar current={3} total={6} />

      <div className="flex flex-1 min-h-0 flex-col overflow-y-auto px-6 pt-8">
        <h1 className="text-heading font-bold text-ink">기본 정보를 알려주세요</h1>
        <p className="mt-2 text-body text-ink-sub">
          생활비를 감당할 수 있는지 계산하는 데 쓰여요.
        </p>

        <div className="mt-10 flex flex-col gap-8">
          <div>
            <p className="mb-2 text-sub text-ink-sub">나이</p>
            <div className="flex items-baseline gap-2 border-b border-line pb-3">
              <input
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
                className="w-24 bg-transparent font-inter text-display font-semibold text-ink outline-none"
                min={1}
                max={120}
              />
              <span className="text-body text-ink">세</span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sub text-ink-sub">은퇴한 시점</p>
            <div className="flex items-baseline gap-2 border-b border-line pb-3">
              <input
                type="number"
                value={retiredYear}
                onChange={e => setRetiredYear(e.target.value)}
                className="w-28 bg-transparent font-inter text-display font-semibold text-ink outline-none"
                min={1900}
                max={2100}
              />
              <span className="text-body text-ink">년</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative shrink-0 px-6 pb-10">
        <div className="pointer-events-none absolute -top-8 inset-x-0 h-8 bg-gradient-to-b from-white/0 to-white" />
        <button
          type="button"
          onClick={handleNext}
          className="w-full rounded-btn bg-primary py-4 text-btn font-bold text-white"
        >
          다음
        </button>
      </div>
    </div>
  )
}

export default Step3BasicInfo
