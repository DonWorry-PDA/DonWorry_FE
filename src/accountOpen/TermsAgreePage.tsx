import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'

const TERMS_ITEMS = [
  { id: 'account', title: '신한 은퇴솔루션 계좌 약관', required: true },
  { id: 'deposit', title: '예금거래 기본약관', required: true },
  { id: 'privacy-collect', title: '개인정보 수집·이용', required: true },
  { id: 'privacy-share', title: '개인정보 제3자 제공', required: true },
  { id: 'marketing', title: '마케팅 정보 수신 (선택)', required: false },
] as const

type TermsId = (typeof TERMS_ITEMS)[number]['id']

type AgreedState = Record<TermsId, boolean>

const INITIAL_STATE: AgreedState = {
  account: false,
  deposit: false,
  'privacy-collect': false,
  'privacy-share': false,
  marketing: false,
}

function TermsAgreePage() {
  const navigate = useNavigate()
  const [agreed, setAgreed] = useState<AgreedState>(INITIAL_STATE)

  const allChecked = TERMS_ITEMS.every((item) => agreed[item.id])
  const requiredChecked = TERMS_ITEMS.filter((item) => item.required).every((item) => agreed[item.id])

  const toggleAll = () => {
    const next = !allChecked
    setAgreed(Object.fromEntries(TERMS_ITEMS.map((item) => [item.id, next])) as AgreedState)
  }

  const toggle = (id: TermsId) => {
    setAgreed((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex flex-col bg-white h-dvh">
      <AppBar title="약관 동의" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto px-5 pt-[0.4375rem]">
        {/* 제목 */}
        <h2 className="text-heading font-bold text-ink leading-[1.47] mb-[1.125rem]">
          서비스 이용을 위해
          <br />
          약관에 동의해주세요
        </h2>

        {/* 전체 동의 */}
        <button
          onClick={toggleAll}
          className={`flex w-full items-center gap-3 rounded-btn border p-[1.0625rem] text-left transition-colors ${
            allChecked ? 'border-primary bg-primary-tint' : 'border-line bg-white'
          }`}
        >
          <span
            className={`flex size-[1.375rem] shrink-0 items-center justify-center rounded-[0.375rem] transition-colors ${
              allChecked ? 'bg-primary' : 'border-2 border-line bg-white'
            }`}
          >
            {allChecked && (
              <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
                <path
                  d="M1.5 5L5 8.5L11.5 1.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
          <span className="text-md font-semibold text-ink">전체 동의합니다</span>
        </button>

        {/* 개별 항목 */}
        <div className="mt-2">
          {TERMS_ITEMS.map((item, index) => {
            const isChecked = agreed[item.id]
            const isLast = index === TERMS_ITEMS.length - 1
            return (
              <div
                key={item.id}
                className={`flex items-center gap-3 px-0.5 py-[0.9375rem] ${!isLast ? 'border-b border-divider' : ''}`}
              >
                <button
                  onClick={() => toggle(item.id)}
                  className={`text-[1.125rem] leading-none transition-colors ${
                    isChecked ? 'text-primary' : 'text-radio'
                  }`}
                  aria-label={item.title}
                >
                  {isChecked ? '✓' : '○'}
                </button>

                <button
                  onClick={() => toggle(item.id)}
                  className="flex min-w-0 flex-1 flex-col gap-0.5 pl-[0.625rem] text-left"
                >
                  <span
                    className={`text-md font-medium ${item.required ? 'text-ink' : 'text-ink-sub'}`}
                  >
                    {item.title}
                  </span>
                  {item.required && <span className="text-caption text-primary">(필수)</span>}
                </button>

                <button className="shrink-0 text-sub text-ink-hint">보기</button>
              </div>
            )
          })}
        </div>
      </main>

      {/* 하단 CTA */}
      <div className="shrink-0 px-5 pb-8 pt-3">
        <Button disabled={!requiredChecked} onClick={() => navigate('/account-open/identity')}>
          동의하고 계속
        </Button>
      </div>
    </div>
  )
}

export default TermsAgreePage
