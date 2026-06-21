import { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import { MOCK_USER_PROFILE } from '../mypage/mock/mypage'
import type { UserIdentityInfo } from './types/accountOpen'

const MOCK_IDENTITY: UserIdentityInfo = {
  name: MOCK_USER_PROFILE.name,
  idNumberMasked: '601015 — ●●●●●●●',
  phone: '010-1234-5678',
}

const STEPS = [
  { step: 1, label: '인증' },
  { step: 2, label: '약관' },
  { step: 3, label: '완료' },
] as const

type AuthTab = 'phone' | 'shinhan'

function IdentityVerifyPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<AuthTab>('phone')

  return (
    <div className="flex flex-col bg-white h-dvh">
      <AppBar title="계좌 개설" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto">
        {/* 단계 표시 */}
        <div className="flex items-center justify-between px-5 pb-5 pt-[0.375rem]">
          {STEPS.map(({ step, label }, index) => (
            <Fragment key={step}>
              <StepItem step={step} label={label} active={step === 1} />
              {index < STEPS.length - 1 && (
                <div className="h-px w-[1.875rem] bg-line" />
              )}
            </Fragment>
          ))}
        </div>

        <div className="px-5">
          {/* 제목 */}
          <h2 className="text-heading font-bold text-ink leading-[1.47]">본인 인증</h2>
          <p className="mt-[0.4375rem] text-body text-ink-sub">
            본인 명의 정보로 안전하게 인증해요.
          </p>

          {/* 탭 */}
          <div className="mt-[1.125rem] flex border-b border-line">
            {(['phone', 'shinhan'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-center text-body transition-colors ${
                  activeTab === tab
                    ? '-mb-px border-b-2 border-primary font-bold text-primary'
                    : 'text-ink-hint'
                }`}
              >
                {tab === 'phone' ? '휴대폰 인증' : '신한인증서'}
              </button>
            ))}
          </div>

          {/* 사용자 정보 (사전 입력) */}
          <FieldRow label="이름" value={MOCK_IDENTITY.name} hasDivider />
          <FieldRow label="주민등록번호" value={MOCK_IDENTITY.idNumberMasked} hasDivider />
          <FieldRow label="휴대폰 번호" value={MOCK_IDENTITY.phone} />
        </div>
      </main>

      {/* 하단 CTA */}
      <div className="shrink-0 px-5 pb-8 pt-3">
        <Button
          onClick={() =>
            navigate('/account-open/complete', {
              state: {
                accountNumber: '123-456-789012',
                openedAt: new Date().toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                }).replace(/\.\s?/g, '.').replace(/\.$/, ''),
              },
            })
          }
        >
          인증번호 받기
        </Button>
      </div>
    </div>
  )
}

function StepItem({
  step,
  label,
  active,
}: {
  step: number
  label: string
  active: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-[0.375rem]">
      <div
        className={`flex size-[1.875rem] items-center justify-center rounded-full ${
          active ? 'bg-primary' : 'bg-track'
        }`}
      >
        <span className={`text-body font-bold ${active ? 'text-white' : 'text-nav'}`}>
          {step}
        </span>
      </div>
      <span className={`text-caption ${active ? 'font-semibold text-ink' : 'text-ink-hint'}`}>
        {label}
      </span>
    </div>
  )
}

function FieldRow({
  label,
  value,
  hasDivider = false,
}: {
  label: string
  value: string
  hasDivider?: boolean
}) {
  return (
    <div
      className={`flex flex-col gap-2 pb-[0.9375rem] pt-[1.125rem] ${hasDivider ? 'border-b border-line' : ''}`}
    >
      <span className="text-sub text-ink-sub">{label}</span>
      <span className="font-inter text-card font-bold text-ink">{value}</span>
    </div>
  )
}

export default IdentityVerifyPage
