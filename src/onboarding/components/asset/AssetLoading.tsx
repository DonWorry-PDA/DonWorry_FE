import { useCallback, useEffect, useRef, useState } from 'react'
import { useOnboarding } from '../../contexts/OnboardingContext'
import usePostOnboarding, { toOnboardingRequest } from '../../hooks/usePostOnboarding'
import usePostMydataConnect from '@/asset/hooks/usePostMydataConnect'

interface Props {
  onNext: () => void
}

function AssetLoading({ onNext }: Props) {
  const { answers, setConnectResult } = useOnboarding()
  const { mutateAsync: submitOnboarding } = usePostOnboarding()
  const { mutateAsync: connectMydata } = usePostMydataConnect()

  const [progress, setProgress] = useState(0)
  const [failed, setFailed] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startedRef = useRef(false)

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const run = useCallback(async () => {
    setFailed(false)
    setProgress(0)
    // 진행률 표시(시각용). 실제 작업이 끝날 때까지 95%에서 대기한다.
    stopTimer()
    timerRef.current = setInterval(() => {
      setProgress(prev => (prev >= 95 ? 95 : prev + 2))
    }, 50)

    // 온보딩(UserGoal 생성)이 마이데이터 연결의 자동 재계산보다 먼저 끝나야 한다.
    // 실패 단계(온보딩 제출 / 자산 연결)를 구분해 로깅한다.
    try {
      await submitOnboarding(toOnboardingRequest(answers))
    } catch (error) {
      stopTimer()
      console.error('[onboarding] 온보딩 제출 실패', error)
      setFailed(true)
      return
    }

    try {
      const result = await connectMydata()
      setConnectResult(result)
    } catch (error) {
      stopTimer()
      console.error('[onboarding] 마이데이터 연결 실패', error)
      setFailed(true)
      return
    }

    stopTimer()
    setProgress(100)
    onNext()
  }, [answers, submitOnboarding, connectMydata, setConnectResult, onNext, stopTimer])

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    run()
    return stopTimer
  }, [run, stopTimer])

  if (failed) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center bg-white px-6">
        <p role="alert" className="text-center text-body text-ink leading-[1.6]">
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
    <div
      role="status"
      aria-live="polite"
      className="flex h-dvh flex-col items-center justify-center bg-white px-6"
    >
      <div className="relative flex size-32 items-center justify-center" aria-hidden="true">
        <div className="absolute inset-0 animate-spin">
          {[0, 60, 120, 180, 240, 300].map(deg => (
            <div
              key={deg}
              className="absolute size-3 rounded-full bg-primary/30"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${deg}deg) translateX(52px)`,
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
