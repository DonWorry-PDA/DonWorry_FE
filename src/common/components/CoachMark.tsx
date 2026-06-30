import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import pxr from '@/common/utils/pxr'

export type CoachMarkStep = {
  targetId: string
  title: string
  description: string
  spotlightPadding?: number
  spotlightRadius?: number
  spotlightShape?: 'rect' | 'circle' | 'none'
}

type TargetRect = { x: number; y: number; width: number; height: number }

type TargetState = {
  rect: TargetRect | null
  ready: boolean
  found: boolean
}

type Props = {
  steps: CoachMarkStep[]
  onComplete: () => void
  onSkip: () => void
}

const TOOLTIP_MARGIN = 16
const TOOLTIP_GAP = 14
const ARROW_W = 9  // 삼각형 반폭
const ARROW_H = 8  // 삼각형 높이
const DEFAULT_PADDING = 0
const DEFAULT_RADIUS = 0

function useTargetRect(targetId: string): TargetState {
  const [state, setState] = useState<TargetState>({ rect: null, ready: false, found: false })

  useEffect(() => {
    setState({ rect: null, ready: false, found: false })

    let cancelled = false
    let pollId: ReturnType<typeof setTimeout>
    let giveUpId: ReturnType<typeof setTimeout>

    const measure = () => {
      const el = document.querySelector(`[data-onboarding-id="${targetId}"]`)
      if (el) {
        const r = el.getBoundingClientRect()
        if (r.width > 0 || r.height > 0) {
          if (!cancelled) {
            clearTimeout(giveUpId)
            setState({ rect: { x: r.x, y: r.y, width: r.width, height: r.height }, ready: true, found: true })
          }
          return
        }
      }
      if (!cancelled) pollId = setTimeout(measure, 200)
    }

    pollId = setTimeout(measure, 400)

    giveUpId = setTimeout(() => {
      if (!cancelled) {
        cancelled = true
        const el = document.querySelector(`[data-onboarding-id="${targetId}"]`)
        if (el) {
          setState({ rect: null, ready: true, found: true })
        } else {
          setState({ rect: null, ready: true, found: false })
        }
      }
    }, 3000)

    return () => {
      cancelled = true
      clearTimeout(pollId)
      clearTimeout(giveUpId)
    }
  }, [targetId])

  useEffect(() => {
    if (!state.ready || !state.found) return
    const update = () => {
      const el = document.querySelector(`[data-onboarding-id="${targetId}"]`)
      if (el) {
        const r = el.getBoundingClientRect()
        setState((prev) => ({
          ...prev,
          rect: { x: r.x, y: r.y, width: r.width, height: r.height },
        }))
      }
    }
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [targetId, state.ready, state.found])

  return state
}

function CoachMarkInner({ steps, onComplete, onSkip }: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const step = steps[currentStep]
  const { rect, ready, found } = useTargetRect(step.targetId)
  const isLastStep = currentStep === steps.length - 1
  const tooltipRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<Element | null>(null)

  useEffect(() => {
    if (!ready || found) return
    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStep((s) => s + 1)
    }
  }, [ready, found, isLastStep, onComplete])

  useEffect(() => {
    const el = document.querySelector(`[data-onboarding-id="${step.targetId}"]`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    }
  }, [currentStep, step.targetId])

  useEffect(() => {
    const prevent = (e: TouchEvent) => {
      const tooltip = document.getElementById('coachmark-tooltip')
      if (tooltip && tooltip.contains(e.target as Node)) return
      e.preventDefault()
    }
    document.addEventListener('touchmove', prevent, { passive: false })
    return () => document.removeEventListener('touchmove', prevent)
  }, [])

  // 마운트 시 이전 포커스 저장 → 첫 버튼으로 이동, 언마운트 시 복원
  useEffect(() => {
    previousFocusRef.current = document.activeElement
    const first = tooltipRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    first?.focus()
    return () => {
      ;(previousFocusRef.current as HTMLElement | null)?.focus()
    }
  }, [])

  // Tab / Shift+Tab 포커스 트랩
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const tooltip = tooltipRef.current
      if (!tooltip) return
      const focusable = Array.from(
        tooltip.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleNext = useCallback(() => {
    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStep((s) => s + 1)
    }
  }, [isLastStep, onComplete])

  if (!ready || !found) return null

  const padding = step.spotlightPadding ?? DEFAULT_PADDING
  const radius = step.spotlightRadius ?? DEFAULT_RADIUS
  const shape = step.spotlightShape ?? 'rect'

  const vw = window.innerWidth
  const vh = window.innerHeight

  const spotX = rect ? rect.x - padding : 0
  const spotY = rect ? rect.y - padding : 0
  const spotW = rect ? rect.width + padding * 2 : 0
  const spotH = rect ? rect.height + padding * 2 : 0

  // 원형 spotlight: 지정 radius 또는 min(w,h)/2
  const circleR = rect
    ? (step.spotlightRadius ?? Math.min(rect.width, rect.height) / 2) + padding
    : 0
  const circleCx = rect ? rect.x + rect.width / 2 : 0
  const circleCy = rect ? rect.y + rect.height / 2 : 0

  const tooltipW = Math.min(280, vw - TOOLTIP_MARGIN * 2)
  const targetCenterX = rect ? rect.x + rect.width / 2 : vw / 2
  const tooltipLeft = Math.max(
    TOOLTIP_MARGIN,
    Math.min(targetCenterX - tooltipW / 2, vw - tooltipW - TOOLTIP_MARGIN),
  )

  const spotBottom = shape === 'circle' ? circleCy + circleR : spotY + spotH
  const spotTop = shape === 'circle' ? circleCy - circleR : spotY
  const showBelow = !rect || spotTop + (spotBottom - spotTop) < vh * 0.55

  const tooltipPositionStyle: React.CSSProperties = rect
    ? showBelow
      ? { top: spotBottom + TOOLTIP_GAP }
      : { bottom: vh - spotTop + TOOLTIP_GAP }
    : { top: '50%', transform: 'translateY(-50%)' }

  return (
    <>
      <svg
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 9998,
          pointerEvents: 'all',
        }}
      >
        <defs>
          <mask id="coachmark-spotlight" maskUnits="userSpaceOnUse">
            <rect x={0} y={0} width={vw} height={vh} fill="white" />
            {rect && shape === 'circle' && (
              <circle cx={circleCx} cy={circleCy} r={circleR} fill="black" />
            )}
            {rect && shape === 'rect' && (
              <rect
                x={spotX}
                y={spotY}
                width={spotW}
                height={spotH}
                rx={radius}
                ry={radius}
                fill="black"
              />
            )}
            {/* shape === 'none': 컷아웃 없이 전체 오버레이만 */}
          </mask>
        </defs>
        <rect
          x={0}
          y={0}
          width={vw}
          height={vh}
          fill="rgba(0,0,0,0.62)"
          mask="url(#coachmark-spotlight)"
        />
      </svg>

      {/* 컴팩트 툴팁 박스 */}
      <div
        ref={tooltipRef}
        id="coachmark-tooltip"
        role="dialog"
        aria-modal="true"
        aria-label={`온보딩 안내 ${currentStep + 1}단계`}
        style={{
          position: 'fixed',
          left: tooltipLeft,
          width: tooltipW,
          zIndex: 9999,
          filter: 'drop-shadow(0 0.3125rem 1.25rem rgba(0,0,0,0.10))',
          ...tooltipPositionStyle,
        }}
        className="relative bg-white rounded-card-xl px-4 pt-4 pb-3 flex flex-col gap-3"
      >
        {/* 말풍선 꼬리 — 요소 방향으로 */}
        {rect && (() => {
          const arrowLeft = Math.max(
            16,
            Math.min(tooltipW - 16 - ARROW_W * 2, targetCenterX - tooltipLeft - ARROW_W),
          )
          return showBelow ? (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: pxr(-ARROW_H + 1),
                left: pxr(arrowLeft),
                width: 0,
                height: 0,
                borderLeft: `${pxr(ARROW_W)} solid transparent`,
                borderRight: `${pxr(ARROW_W)} solid transparent`,
                borderBottom: `${pxr(ARROW_H)} solid white`,
              }}
            />
          ) : (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: pxr(-ARROW_H + 1),
                left: pxr(arrowLeft),
                width: 0,
                height: 0,
                borderLeft: `${pxr(ARROW_W)} solid transparent`,
                borderRight: `${pxr(ARROW_W)} solid transparent`,
                borderTop: `${pxr(ARROW_H)} solid white`,
              }}
            />
          )
        })()}
        {/* 단계 인디케이터 */}
        <div className="flex gap-[5px] justify-center">
          {steps.map((_, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                width: 5,
                height: 5,
                borderRadius: 3,
                backgroundColor: i === currentStep ? '#0046FF' : '#DDE2E9',
                transition: 'background-color 0.2s',
              }}
            />
          ))}
        </div>

        {/* 안내 텍스트 */}
        <div className="flex flex-col gap-1">
          <p className="text-md font-bold text-ink">{step.title}</p>
          <p className="text-sub text-ink-sub leading-relaxed">{step.description}</p>
        </div>

        {/* 컴팩트 버튼 */}
        <div className="flex items-center justify-between">
          <button
            aria-label="온보딩 건너뛰기"
            onClick={onSkip}
            className="text-sub font-medium text-ink-hint py-1"
          >
            건너뛰기
          </button>
          <button
            aria-label={isLastStep ? '온보딩 완료' : '다음 단계로 이동'}
            onClick={handleNext}
            className="text-sub font-bold text-primary py-1"
          >
            {isLastStep ? '시작하기' : '다음'}
          </button>
        </div>
      </div>
    </>
  )
}

function CoachMark(props: Props) {
  return createPortal(<CoachMarkInner {...props} />, document.body)
}

export default CoachMark
