import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'

const TERMS_ITEMS = [
  {
    id: 'account',
    title: '신한 은퇴솔루션 계좌 약관',
    required: true,
    content:
      '신한 은퇴솔루션 계좌는 신한투자증권이 운영하는 은퇴 전용 자산관리 계좌입니다. 본 약관은 해당 계좌의 개설, 운용 및 해지에 관한 사항을 규정합니다.',
  },
  {
    id: 'deposit',
    title: '예금거래 기본약관',
    required: true,
    content:
      '예금거래 기본약관은 예금주와 은행 간의 예금 계약에 적용되는 기본적인 사항을 규정하며, 예금의 입출금, 이자 지급, 계좌 해지 등의 절차를 포함합니다.',
  },
  {
    id: 'privacy-collect',
    title: '개인정보 수집·이용',
    required: true,
    content:
      '수집 항목: 성명, 생년월일, 연락처, 금융거래 정보. 수집 목적: 계좌 개설 및 금융 서비스 제공. 보유 기간: 거래 종료 후 5년.',
  },
  {
    id: 'privacy-share',
    title: '개인정보 제3자 제공',
    required: true,
    content:
      '제공 대상: 신용정보원, 금융결제원. 제공 목적: 본인 확인 및 금융 사고 예방. 제공 항목: 성명, 생년월일, 계좌번호. 보유 기간: 제공 목적 달성 후 즉시 파기.',
  },
  {
    id: 'marketing',
    title: '마케팅 정보 수신 (선택)',
    required: false,
    content:
      '신한투자증권의 금융상품, 이벤트, 혜택 등의 마케팅 정보를 SMS, 이메일, 앱 푸시 알림을 통해 수신하는 것에 동의합니다. 동의하지 않아도 서비스 이용에 불이익이 없습니다.',
  },
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

type TermsItem = (typeof TERMS_ITEMS)[number]

function TermsAgreePage() {
  const navigate = useNavigate()
  const [agreed, setAgreed] = useState<AgreedState>(INITIAL_STATE)
  const [viewingTerm, setViewingTerm] = useState<TermsItem | null>(null)

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
          role="checkbox"
          aria-checked={allChecked}
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
                  role="checkbox"
                  aria-checked={isChecked}
                  onClick={() => toggle(item.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span
                    className={`shrink-0 text-[1.125rem] leading-none transition-colors ${
                      isChecked ? 'text-primary' : 'text-radio'
                    }`}
                  >
                    {isChecked ? '✓' : '○'}
                  </span>
                  <span className="flex flex-col gap-0.5 pl-[0.625rem]">
                    <span
                      className={`text-md font-medium ${item.required ? 'text-ink' : 'text-ink-sub'}`}
                    >
                      {item.title}
                    </span>
                    {item.required && <span className="text-caption text-primary">(필수)</span>}
                  </span>
                </button>

                <button
                  className="shrink-0 text-sub text-ink-hint"
                  onClick={() => setViewingTerm(item)}
                >
                  보기
                </button>
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

      {/* 약관 내용 바텀시트 */}
      {viewingTerm && (
        <>
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setViewingTerm(null)}
          />
          <div className="fixed bottom-0 left-1/2 w-full max-w-[480px] -translate-x-1/2 rounded-t-[1.25rem] bg-white px-5 pb-10 pt-5 shadow-float">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-md font-bold text-ink">{viewingTerm.title}</h3>
              <button
                aria-label="닫기"
                onClick={() => setViewingTerm(null)}
                className="flex size-8 items-center justify-center text-ink-hint"
              >
                ✕
              </button>
            </div>
            <p className="text-body text-ink-sub leading-relaxed">{viewingTerm.content}</p>
          </div>
        </>
      )}
    </div>
  )
}

export default TermsAgreePage
