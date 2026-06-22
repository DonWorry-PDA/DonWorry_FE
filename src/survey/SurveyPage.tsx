import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackArrowIc } from '../common/assets/icons'
import SurveyQuestion from './components/SurveyQuestion'
import { questions } from './data/questions'
import useGetSurvey from './hooks/useGetSurvey'
import usePostSurvey from './hooks/usePostSurvey'

const TOTAL = questions.length

function SurveyPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(TOTAL).fill(null))

  const { data: savedSurvey, isLoading: isSurveyLoading } = useGetSurvey()
  const { mutate: postSurvey, isPending, isError } = usePostSurvey()

  useEffect(() => {
    if (savedSurvey) {
      setAnswers([savedSurvey.q1, savedSurvey.q2, savedSurvey.q3])
    }
  }, [savedSurvey])

  const currentAnswer = answers[step]

  function handleSelect(index: number) {
    setAnswers((prev) => {
      const next = [...prev]
      next[step] = index
      return next
    })
  }

  function handleNext() {
    if (currentAnswer === null || isPending) return
    if (step < TOTAL - 1) {
      setStep((prev) => prev + 1)
    } else {
      postSurvey(
        { q1: answers[0]!, q2: answers[1]!, q3: answers[2]! },
        { onSuccess: () => navigate('/paycheck-plan/assets') },
      )
    }
  }

  function handleBack() {
    if (step > 0) {
      setStep((prev) => prev - 1)
    } else {
      navigate(-1)
    }
  }

  if (isSurveyLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-body text-ink-hint">불러오는 중...</p>
      </div>
    )
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
          disabled={currentAnswer === null || isPending}
          className={`w-full rounded-btn py-4 text-btn font-bold text-white transition-colors ${
            currentAnswer !== null && !isPending ? 'bg-primary' : 'bg-disabled'
          }`}
        >
          {isPending ? '저장 중...' : '다음'}
        </button>
        {isError && (
          <p className="mt-3 text-center text-sub text-danger">
            저장에 실패했어요. 다시 시도해주세요.
          </p>
        )}
      </div>
    </div>
  )
}

export default SurveyPage
