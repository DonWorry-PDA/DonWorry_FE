import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackArrowIc } from '../common/assets/icons'
import SurveyQuestion from './components/SurveyQuestion'
import { questions } from './data/questions'

const TOTAL = questions.length

function SurveyPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(TOTAL).fill(null))

  const currentAnswer = answers[step]

  function handleSelect(index: number) {
    setAnswers((prev) => {
      const next = [...prev]
      next[step] = index
      return next
    })
  }

  function handleNext() {
    if (currentAnswer === null) return
    if (step < TOTAL - 1) {
      setStep((prev) => prev + 1)
    } else {
      navigate('/')
    }
  }

  function handleBack() {
    if (step > 0) {
      setStep((prev) => prev - 1)
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* 헤더 */}
      <header className="flex h-[52px] shrink-0 items-center px-5">
        <button onClick={handleBack} className="flex size-7 items-center justify-center">
          <BackArrowIc className="text-ink" width={22} height={22} />
        </button>
        <div className="flex-1" />
        <span className="text-sub font-medium text-ink-sub">
          {step + 1} / {TOTAL}
        </span>
      </header>

      {/* 질문 */}
      <SurveyQuestion
        step={step + 1}
        total={TOTAL}
        data={questions[step]}
        selectedIndex={currentAnswer}
        onSelect={handleSelect}
      />

      {/* 다음 버튼 */}
      <div className="px-6 pb-10 pt-6">
        <button
          onClick={handleNext}
          disabled={currentAnswer === null}
          className={`w-full rounded-btn py-4 text-btn font-bold text-white transition-colors ${
            currentAnswer !== null ? 'bg-primary' : 'bg-disabled'
          }`}
        >
          다음
        </button>
      </div>
    </div>
  )
}

export default SurveyPage
