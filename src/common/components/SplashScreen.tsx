import { useEffect, useRef, useState } from 'react'
import solMark from '@/assets/sol-mark.png'
import pxr from '@/common/utils/pxr'

type Variant = 'spin' | 'flip' | 'zoom'

interface SplashScreenProps {
  onFinish?: () => void
  minDuration?: number
  variant?: Variant
}

const SYMBOL_SIZE = 120

const variantAnim: Record<Variant, string> = {
  spin: 'splash-spin 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both',
  flip: 'splash-flip 0.9s ease-out both',
  zoom: 'splash-zoom 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both',
}

function SplashScreen({ onFinish, minDuration = 3200, variant = 'spin' }: SplashScreenProps) {
  const [fadingOut, setFadingOut] = useState(false)
  const onFinishRef = useRef(onFinish)
  useEffect(() => { onFinishRef.current = onFinish }, [onFinish])

  useEffect(() => {
    let finishId: ReturnType<typeof setTimeout>
    const exitId = setTimeout(() => {
      setFadingOut(true)
      finishId = setTimeout(() => onFinishRef.current?.(), 450)
    }, minDuration)
    return () => {
      clearTimeout(exitId)
      clearTimeout(finishId)
    }
  }, [minDuration])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
      style={{ transition: 'opacity 0.45s ease', opacity: fadingOut ? 0 : 1 }}
      aria-live="polite"
      aria-label="앱 로딩 중"
    >
      {/* 심볼 + 링 */}
      <div className="relative flex items-center justify-center">
        {[0.2, 0.5].map((delay) => (
          <span
            key={delay}
            className="splash-ring pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary"
            style={{
              width: pxr(SYMBOL_SIZE),
              height: pxr(SYMBOL_SIZE),
              animationDelay: `${delay}s`,
            }}
          />
        ))}
        <img
          src={solMark}
          alt="연금SOL사"
          className="splash-symbol relative z-10 object-contain"
          style={{
            width: pxr(SYMBOL_SIZE),
            height: pxr(SYMBOL_SIZE),
            animation: variantAnim[variant],
          }}
        />
      </div>

      {/* 워드마크 */}
      <p
        className="splash-wordmark font-brand font-bold text-ink"
        style={{ fontSize: pxr(30), marginTop: pxr(20) }}
      >
        연금<span className="text-primary">SOL</span>사
      </p>

      {/* 태그라인 */}
      <p
        className="splash-tagline text-sub text-ink-sub"
        style={{ marginTop: pxr(8) }}
      >
        내 연금, 월급처럼
      </p>

      {/* 로딩 점 */}
      <div
        className="splash-dots flex"
        style={{ gap: pxr(8), marginTop: pxr(48) }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="splash-dot rounded-full bg-primary"
            style={{
              width: pxr(8),
              height: pxr(8),
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default SplashScreen
