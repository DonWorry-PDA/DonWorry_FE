import { Fragment, useRef, useState } from 'react'
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

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

function IdentityVerifyPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { returnTo, planId } = (location.state as { returnTo?: string; planId?: string } | null) ?? {}
  const { data: currentUser } = useCurrentUser()

  const [activeTab, setActiveTab] = useState<'phone' | 'shinhan'>('phone')
  const [ssnFront, setSsnFront] = useState('')
  const [ssnBack, setSsnBack] = useState('')
  const [phone, setPhone] = useState('')
  const [ssnBackFocused, setSsnBackFocused] = useState(false)

  const ssnBackRef = useRef<HTMLInputElement>(null)

  const handleSsnFront = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 6)
    setSsnFront(v)
    if (v.length === 6) ssnBackRef.current?.focus()
  }

  const handleSsnBack = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSsnBack(e.target.value.replace(/\D/g, '').slice(0, 7))
  }

  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value))
  }

  const isValid =
    /^\d{6}$/.test(ssnFront) &&
    /^\d{7}$/.test(ssnBack) &&
    /^\d{10,11}$/.test(phone.replace(/\D/g, ''))

  const ssnBackActive = ssnBackFocused || ssnBack.length > 0

  return (
    <div className="flex flex-col bg-white h-dvh">
      <AppBar title="계좌 개설" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto">
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

        {/* 제목 */}
        <div className="px-6">
          <h2 className="text-heading font-extrabold text-ink leading-[1.47] tracking-[-0.025em]">
            본인 인증
          </h2>
          <p className="mt-[0.4375rem] text-sub text-ink-sub">
            본인 명의 정보로 안전하게 인증해요.
          </p>
        </div>

        {/* 탭 */}
        <div className="mt-[1.125rem] flex border-b border-divider px-6">
          <button
            type="button"
            onClick={() => setActiveTab('phone')}
            className={`flex-1 py-3 text-center text-body font-bold transition-colors ${
              activeTab === 'phone'
                ? '-mb-px border-b-[2.5px] border-primary text-primary'
                : 'text-ink-hint'
            }`}
          >
            휴대폰 인증
          </button>
          <button
            type="button"
            onClick={() => navigate('/account-open/shinhan-cert', { state: { returnTo, planId } })}
            className="flex-1 py-3 text-center text-body font-bold transition-colors text-ink-hint"
          >
            신한인증서
          </button>
        </div>

        {/* 필드 */}
        <div className="px-6">
          {/* 이름 */}
          <div className="flex flex-col gap-[0.5625rem] border-b border-divider pb-[1.1875rem] pt-[1.125rem]">
            <span className="text-sub text-ink-sub">이름</span>
            {currentUser ? (
              <span className="font-inter text-card font-bold text-ink">{currentUser.name}</span>
            ) : (
              <div className="h-6 w-20 animate-pulse rounded bg-surface-muted" />
            )}
          </div>

          {/* 주민등록번호 */}
          <div className="flex flex-col gap-[0.5625rem] border-b border-divider pb-[1.1875rem] pt-[1.125rem]">
            <label htmlFor="ssn-front" className="text-sub text-ink-sub">주민등록번호</label>
            <div className="flex items-center gap-[0.625rem]">
              {/* 앞 6자리 */}
              <input
                id="ssn-front"
                type="tel"
                inputMode="numeric"
                value={ssnFront}
                onChange={handleSsnFront}
                maxLength={6}
                placeholder="앞 6자리"
                className="w-[5.5rem] shrink-0 bg-transparent font-inter text-card font-bold text-ink outline-none placeholder:font-normal placeholder:text-disabled"
              />
              <span className="shrink-0 text-card font-bold text-ink-hint">—</span>
              {/* 뒤 7자리 */}
              <div
                className={`flex flex-1 items-center border-b-2 pb-0.5 transition-colors ${
                  ssnBackActive ? 'border-primary' : 'border-line'
                }`}
              >
                <input
                  id="ssn-back"
                  ref={ssnBackRef}
                  type="password"
                  inputMode="numeric"
                  value={ssnBack}
                  onChange={handleSsnBack}
                  onFocus={() => setSsnBackFocused(true)}
                  onBlur={() => setSsnBackFocused(false)}
                  maxLength={7}
                  placeholder="뒤 7자리"
                  aria-label="주민등록번호 뒷자리"
                  className="w-full bg-transparent font-inter text-card font-bold text-ink outline-none placeholder:font-normal placeholder:text-disabled"
                />
              </div>
            </div>
          </div>

          {/* 휴대폰 번호 */}
          <div className="flex flex-col gap-[0.5625rem] pb-[1.1875rem] pt-[1.125rem]">
            <label htmlFor="phone" className="text-sub text-ink-sub">휴대폰 번호</label>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={handlePhone}
              placeholder="010-0000-0000"
              className="bg-transparent font-inter text-card font-bold text-ink outline-none placeholder:font-normal placeholder:text-disabled"
            />
          </div>
        </div>

        {/* 안내 박스 */}
        <div className="mx-6 mb-6 rounded-card-lg bg-[#f1f5fb] px-4 py-[1.125rem]">
          <p className="text-sub text-ink-sub leading-[1.66]">
            주민등록번호 뒷자리와 휴대폰 번호를 확인하고 인증번호를 보내드려요. 입력 정보는 본인확인 용도로만 사용돼요.
          </p>
        </div>
      </main>

      <StickyFooter>
        <Button
          disabled={!isValid}
          onClick={() => navigate('/account-open/otp', { state: { phone, returnTo, planId } })}
        >
          인증번호 받기
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

export default IdentityVerifyPage
