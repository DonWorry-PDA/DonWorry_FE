import { Fragment } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'
import type { AccountOpenResult } from './types/accountOpen'
import CheckBadge from '../common/components/CheckBadge'

type StepState = 'completed' | 'active' | 'inactive'

const STEPS: { step: number; label: string; state: StepState }[] = [
  { step: 1, label: '인증', state: 'completed' },
  { step: 2, label: '약관', state: 'completed' },
  { step: 3, label: '완료', state: 'active' },
]

function AccountOpenCompletePage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const result = state as AccountOpenResult | null

  if (!result) return <Navigate to="/account-open" replace />

  return (
    <div className="flex flex-col bg-white h-dvh">
      <AppBar title="계좌 개설" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto px-6 pt-2">
        {/* 단계 표시 */}
        <div className="flex items-center justify-between pb-5 pt-[0.375rem]">
          {STEPS.map(({ step, label, state }, index) => (
            <Fragment key={step}>
              <StepItem step={step} label={label} state={state} />
              {index < STEPS.length - 1 && (
                <div className="h-px w-[1.875rem] bg-primary" />
              )}
            </Fragment>
          ))}
        </div>

        {/* 성공 아이콘 + 타이틀 */}
        <div className="flex flex-col items-center gap-[1.125rem] pb-[0.625rem] pt-6">
          <CheckBadge />
          <h2 className="text-center text-heading font-bold text-ink leading-[1.46]">
            계좌 개설이
            <br />
            완료되었어요
          </h2>
        </div>

        {/* 계좌 정보 카드 */}
        <div className="mt-[0.625rem] rounded-card border border-line p-[1.1875rem]">
          <div className="flex flex-col items-center gap-1">
            <span className="text-sub font-bold text-primary">신한 은퇴솔루션 계좌</span>
            <span className="font-inter text-btn font-bold text-ink">{result?.accountNumber}</span>
            <span className="mt-1 text-caption text-ink-hint">개설일 {result?.openedAt}</span>
          </div>
        </div>
      </main>

      {/* 하단 CTA */}
      <StickyFooter>
        <Button onClick={() => navigate('/home')}>자산관리 시작하기</Button>
      </StickyFooter>
    </div>
  )
}

function StepItem({
  step,
  label,
  state,
}: {
  step: number
  label: string
  state: StepState
}) {
  const circleStyle =
    state === 'inactive' ? 'bg-track' : 'bg-primary'

  const labelStyle =
    state === 'active'
      ? 'font-semibold text-ink'
      : state === 'completed'
        ? 'text-ink-sub'
        : 'text-ink-hint'

  return (
    <div className="flex flex-col items-center gap-[0.375rem]">
      <div className={`flex size-[1.875rem] items-center justify-center rounded-full ${circleStyle}`}>
        {state === 'completed' ? (
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
          <span className={`text-body font-bold ${state === 'active' ? 'text-white' : 'text-nav'}`}>
            {step}
          </span>
        )}
      </div>
      <span className={`text-caption ${labelStyle}`}>{label}</span>
    </div>
  )
}

export default AccountOpenCompletePage
