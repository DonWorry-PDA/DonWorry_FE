import { useCallback, useEffect, useRef, useState } from 'react'
import { useOnboarding } from '../../contexts/OnboardingContext'
import usePostOnboarding, { toOnboardingRequest } from '../../hooks/usePostOnboarding'
import usePostMydataConnect from '@/asset/hooks/usePostMydataConnect'

interface Props {
  onNext: () => void
}

function AssetLoading({ onNext }: Props) {
  const { answers } = useOnboarding()
  const { mutateAsync: submitOnboarding } = usePostOnboarding()
  const { mutateAsync: connectMydata } = usePostMydataConnect()

  const [progress, setProgress] = useState(0)
  const [failed, setFailed] = useState(false)
  const startedRef = useRef(false)

  // 진행률 표시(시각용). 실제 작업이 끝날 때까지 95%에서 대기한다.
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => (prev >= 95 ? 95 : prev + 2))
    }, 50)
    return () => clearInterval(timer)
  }, [])

  const run = useCallback(async () => {
    setFailed(false)
    try {
      // 온보딩(UserGoal 생성)이 마이데이터 연결의 자동 재계산보다 먼저 끝나야 한다.
      await submitOnboarding(toOnboardingRequest(answers))
      await connectMydata()
      setProgress(100)
      onNext()
    } catch {
      setFailed(true)
    }
  }, [answers, submitOnboarding, connectMydata, onNext])

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    run()
  }, [run])

  if (failed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
        <p className="text-center text-body text-ink leading-[1.6]">
          자산 연결에 실패했어요.
          <br />
          잠시 후 다시 시도해주세요.
        </p>
        <button
          type="button"
          onClick={run}
          className="mt-6 rounded-btn border border-line px-5 py-2.5 text-body font-semibold text-ink"
        >
          다시 시도
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
      <div className="relative flex size-32 items-center justify-center">
        <div className="absolute inset-0 animate-spin">
          {[0, 60, 120, 180, 240, 300].map(deg => (
            <div
              key={deg}
              className="absolute size-3 rounded-full bg-primary/30"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${deg}deg) translateX(52px) translateY(-50%)`,
              }}
            />
          ))}
        </div>
        <div className="flex size-16 items-center justify-center rounded-full bg-primary">
          <span className="text-body font-bold text-white">신한</span>
        </div>
      </div>

      <p className="mt-8 font-inter text-display font-bold text-ink">
        {Math.floor(progress)}%
      </p>
      <p className="mt-3 text-center text-body text-ink">
        자산이 연결되는 동안<br />잠시만 기다려주세요
      </p>
      <p className="mt-2 text-center text-sub text-ink-sub">
        통신 환경에 따라 최대 1분 정도 걸릴 수 있어요.
      </p>
    </div>
  )
}

export default AssetLoading
