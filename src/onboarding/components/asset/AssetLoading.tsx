import { useEffect, useState } from 'react'

interface Props {
  onNext: () => void
}

function AssetLoading({ onNext }: Props) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const DURATION_MS = 2000
    const INTERVAL_MS = 50
    const increment = 100 / (DURATION_MS / INTERVAL_MS)

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment
        if (next >= 100) {
          clearInterval(timer)
          return 100
        }
        return next
      })
    }, INTERVAL_MS)

    const nav = setTimeout(onNext, DURATION_MS)

    return () => {
      clearInterval(timer)
      clearTimeout(nav)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
