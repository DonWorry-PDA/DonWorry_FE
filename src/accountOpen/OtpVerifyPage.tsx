import { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'

const STEPS = [
  { step: 1, label: '인증' },
  { step: 2, label: '약관' },
  { step: 3, label: '완료' },
] as const

const OTP_LENGTH = 6
const TIMER_SECONDS = 3 * 60

function OtpVerifyPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [otp, setOtp] = useState('')
  const [seconds, setSeconds] = useState(TIMER_SECONDS)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const phone = (location.state as { phone?: string } | null)?.phone
    if (!phone) navigate('/account-open', { replace: true })
  }, [location.state, navigate])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (seconds <= 0) return
    const id = setInterval(() => setSeconds((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [seconds])

  const timerText =
    seconds > 0
      ? `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')} 남음`
      : '시간 초과'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH)
    setOtp(v)
  }

  const handleResend = () => { setOtp(''); setSeconds(TIMER_SECONDS) }

  const isComplete = otp.length === OTP_LENGTH && seconds > 0

  return (
    <div className="flex flex-col bg-white h-dvh">
      <AppBar title="계좌 개설" onBack={() => navigate(-1)} />

      <main
        className="flex-1 overflow-y-auto"
        onClick={() => inputRef.current?.focus()}
      >
        {/* 단계 표시 */}
        <div className="flex items-start px-6 pb-5 pt-[0.375rem]">
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

        <div className="px-5">
          <h2 className="text-heading font-bold text-ink leading-[1.47]">인증번호 입력</h2>
          <p className="mt-[0.4375rem] text-body text-ink-sub">
            휴대폰으로 받은 6자리 숫자를 입력해주세요.
          </p>

          {/* OTP 입력 박스 */}
          <div className="relative mt-6" onClick={(e) => e.stopPropagation()}>
            <input
              ref={inputRef}
              type="tel"
              inputMode="numeric"
              value={otp}
              onChange={handleChange}
              maxLength={OTP_LENGTH}
              className="absolute inset-0 opacity-0 w-full h-full cursor-default"
              aria-label="인증번호 6자리"
            />
            <div className="flex gap-2 pointer-events-none" aria-hidden>
              {Array.from({ length: OTP_LENGTH }).map((_, i) => {
                const isActive = i === otp.length
                const isFilled = i < otp.length
                return (
                  <div
                    key={i}
                    className={`flex-1 h-[3.75rem] flex items-center justify-center rounded-card transition-all ${
                      isActive
                        ? 'border-2 border-primary shadow-[0_0_0_3px_rgba(0,70,255,0.10)]'
                        : 'border border-line'
                    }`}
                  >
                    <span className={`font-inter text-display font-extrabold ${isFilled ? 'text-ink' : 'text-transparent'}`}>
                      {isFilled ? otp[i] : '0'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 타이머 + 재전송 */}
          <div className="mt-3 flex items-center justify-between">
            <span className={`text-sub font-bold ${seconds > 0 ? 'text-danger' : 'text-danger'}`}>
              {timerText}
            </span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleResend() }}
              className="text-sub font-bold text-primary"
            >
              재전송
            </button>
          </div>

          {/* 안내 박스 */}
          <div className="mt-5 rounded-card-lg bg-[#f1f5fb] px-4 py-[1.125rem]">
            <p className="text-sub text-ink-sub leading-[1.66]">
              인증번호가 오지 않으면 휴대폰 번호를 확인하거나 '재전송'을 눌러주세요. 유효시간이 지나면 다시 받아야 해요.
            </p>
          </div>
        </div>
      </main>

      <StickyFooter>
        <Button disabled={!isComplete} onClick={() => navigate('/account-open/terms')}>
          인증 완료
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

export default OtpVerifyPage
