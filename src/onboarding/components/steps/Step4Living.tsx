import { useState } from 'react'
import { BackArrowIc } from '../../../common/assets/icons'
import OnboardingProgressBar from '../OnboardingProgressBar'
import { useOnboarding } from '../../contexts/OnboardingContext'

const MOCK_MONTHLY_INCOME_MAN = 130

interface Props {
  onNext: () => void
  onPrev: () => void
}

function Step4Living({ onNext, onPrev }: Props) {
  const { answers, updateAnswers } = useOnboarding()
  const [living, setLiving] = useState<string>(
    answers.monthlyLiving?.toString() ?? '220'
  )
  const [medical, setMedical] = useState<string>(
    answers.monthlyMedical?.toString() ?? '50'
  )

  const livingNum = parseInt(living, 10) || 0
  const shortfall = livingNum - MOCK_MONTHLY_INCOME_MAN

  function handleNext() {
    updateAnswers({
      monthlyLiving: livingNum || null,
      monthlyMedical: parseInt(medical, 10) || null,
    })
    onNext()
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="px-6 pt-12">
        <button type="button" onClick={onPrev} className="mb-4 text-ink">
          <BackArrowIc width={24} height={24} />
        </button>
      </div>

      <OnboardingProgressBar current={4} total={6} />

      <div className="flex flex-1 flex-col px-6 pt-8">
        <h1 className="text-heading font-bold text-ink">
          한 달에 얼마면<br />생활할 수 있을까요?
        </h1>

        <div className="mt-10 flex flex-col gap-8">
          <div>
            <p className="mb-2 text-sub text-ink-sub">목표 생활비 (월)</p>
            <div className="flex items-baseline gap-2 border-b border-line pb-3">
              <input
                type="number"
                value={living}
                onChange={e => setLiving(e.target.value)}
                className="w-24 bg-transparent font-inter text-display font-semibold text-ink outline-none"
                min={0}
              />
              <span className="text-body text-ink">만 원</span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sub text-ink-sub">예상 의료비 (월)</p>
            <div className="flex items-baseline gap-2 border-b border-line pb-3">
              <input
                type="number"
                value={medical}
                onChange={e => setMedical(e.target.value)}
                className="w-24 bg-transparent font-inter text-display font-semibold text-ink outline-none"
                min={0}
              />
              <span className="text-body text-ink">만 원</span>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-card bg-surface p-4">
          <div className="flex justify-between text-body">
            <span className="text-ink-sub">지금 예상되는 원수입</span>
            <span className="text-ink">{MOCK_MONTHLY_INCOME_MAN}만원</span>
          </div>
          <div className="mt-2 flex justify-between text-body">
            <span className="text-ink-sub">목표 생활비까지</span>
            {shortfall > 0 ? (
              <span className="font-bold text-danger">매달 {shortfall}만원 부족</span>
            ) : (
              <span className="font-bold text-success">충분해요</span>
            )}
          </div>
          {shortfall > 0 && (
            <p className="mt-3 text-sub text-ink-sub">
              괜찮아요. 부족분을 채우는 방법을 이어서 살펴볼게요.
            </p>
          )}
        </div>
      </div>

      <div className="px-6 pb-10">
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

export default Step4Living
