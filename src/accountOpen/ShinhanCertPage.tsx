import { Fragment } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'
import useCurrentUser from '../common/hooks/useCurrentUser'
const STEPS = [
  { step: 1, label: '인증' },
  { step: 2, label: '약관' },
  { step: 3, label: '완료' },
] as const

function ShinhanCertPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { returnTo, planId } = (location.state as { returnTo?: string; planId?: string } | null) ?? {}
  const { data: currentUser } = useCurrentUser()

  return (
    <div className="flex flex-col bg-white h-dvh">
      <AppBar title="계좌 개설" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto px-6">
        {/* 단계 표시 */}
        <div className="flex items-start pb-5 pt-[0.375rem]">
          {STEPS.map(({ step, label }, index) => (
            <Fragment key={step}>
              <StepItem step={step} label={label} active={step === 1} done={false} />
              {index < STEPS.length - 1 && (
                <div className="flex-1 pt-4 min-w-0">
                  <div className="h-0.5 bg-line" />
                </div>
              )}
            </Fragment>
          ))}
        </div>

        <h2 className="text-heading font-extrabold text-ink leading-[1.47] tracking-[-0.025em]">
          계좌 개설을 위해
          <br />
          인증할게요
        </h2>
        <p className="mt-[0.4375rem] text-sub text-ink-sub mb-8">
          신한인증서로 안전하게 본인 확인을 해요.
        </p>

        {/* 인증서 카드 */}
        <div className="rounded-card-xl bg-primary relative overflow-hidden p-6 text-white">
          <div
            className="pointer-events-none absolute top-0 right-0 text-[120px] leading-none font-black text-white/10 select-none"
            aria-hidden="true"
          >
            신
          </div>

          <p className="text-card font-bold">{currentUser?.name ?? ''}</p>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-full border border-white/50">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M3 7.5c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4"
                  stroke="white"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  d="M5 5.5l2 2-2 2"
                  stroke="white"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-body">신한인증서</span>
          </div>

        </div>
      </main>

      <StickyFooter>
        <Button
          onClick={() =>
            navigate('/account-open/terms', { state: { authMethod: 'shinhan', returnTo, planId } })
          }
        >
          인증하기
        </Button>
      </StickyFooter>
    </div>
  )
}

function StepItem({
  step,
  label,
  active,
  done,
}: {
  step: number
  label: string
  active: boolean
  done: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-[0.4375rem] w-[3.25rem]">
      <div
        className={`flex size-[2.125rem] items-center justify-center rounded-full ${
          active || done ? 'bg-primary' : 'bg-track'
        }`}
      >
        {done ? (
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
            <path
              d="M1.5 5L5 8.5L11.5 1.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <span className={`text-body font-extrabold ${active ? 'text-white' : 'text-nav'}`}>
            {step}
          </span>
        )}
      </div>
      <span className={`text-caption ${active ? 'font-semibold text-ink' : 'text-ink-hint'}`}>
        {label}
      </span>
    </div>
  )
}

export default ShinhanCertPage
