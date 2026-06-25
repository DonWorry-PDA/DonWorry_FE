import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'

function CheckCircleIcon({ checked }: { checked: boolean }) {
  return (
    <span
      className={`shrink-0 size-6 rounded-full flex items-center justify-center transition-colors ${
        checked ? 'bg-primary' : 'border-2 border-radio bg-white'
      }`}
    >
      {checked && (
        <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
          <path d="M1 4.5L4.5 8L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const TERMS = [
  { id: 'prospectus', label: '[필수] 투자설명서·핵심상품설명서 교부 확인', required: true },
  { id: 'trading', label: '[필수] 금융투자상품 거래 약관', required: true },
  { id: 'suitability', label: '[필수] 적합성·적정성 확인 동의', required: true },
  { id: 'privacy', label: '[필수] 개인정보 수집·이용 동의', required: true },
  { id: 'marketing', label: '[선택] 마케팅 정보 수신', required: false },
]

function OrderTermsPage() {
  const navigate = useNavigate()
  const [agreed, setAgreed] = useState<Record<string, boolean>>({
    prospectus: false,
    trading: false,
    suitability: false,
    privacy: false,
    marketing: false,
  })

  const allChecked = TERMS.every((t) => agreed[t.id])
  const requiredChecked = TERMS.filter((t) => t.required).every((t) => agreed[t.id])

  function toggleAll() {
    const next = !allChecked
    setAgreed(Object.fromEntries(TERMS.map((t) => [t.id, next])))
  }

  function toggle(id: string) {
    setAgreed((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex flex-col h-full">
      <AppBar title="약관 동의" onBack={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6">
        <h2 className="text-heading font-bold text-ink mb-6">약관에 동의해 주세요</h2>

        {/* 전체 동의 */}
        <button
          role="checkbox"
          aria-checked={allChecked}
          onClick={toggleAll}
          className={`w-full flex items-center gap-3 px-4 py-4 rounded-card border transition-colors ${
            allChecked ? 'bg-primary-tint border-primary' : 'bg-white border-line'
          }`}
        >
          <span
            className={`shrink-0 size-6 rounded-full flex items-center justify-center transition-colors ${
              allChecked ? 'bg-primary' : 'border-2 border-radio bg-white'
            }`}
          >
            {allChecked && (
              <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                <path d="M1 4.5L4.5 8L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span className="text-body font-bold text-ink">전체 동의</span>
          <span className="text-sub text-ink-hint ml-auto">아래 필수·선택 항목을 모두 포함해요</span>
        </button>

        {/* 개별 항목 */}
        <div className="mt-4 flex flex-col divide-y divide-divider border border-line rounded-card overflow-hidden">
          {TERMS.map((term) => (
            <div key={term.id} className="flex items-center gap-3 px-4 py-4">
              <button
                role="checkbox"
                aria-checked={agreed[term.id]}
                onClick={() => toggle(term.id)}
                className="flex items-center gap-3 flex-1 text-left"
              >
                <CheckCircleIcon checked={agreed[term.id]} />
                <span className={`text-body ${agreed[term.id] ? 'text-ink font-medium' : 'text-ink-sub'}`}>
                  {term.label}
                </span>
              </button>
              <button aria-label={`${term.label} 보기`} className="shrink-0 text-ink-hint">
                <ChevronRightIcon />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-btn bg-surface px-4 py-3">
          <p className="text-sub text-ink-sub">
            적합성 확인은 앞서 고르신 투자 성향과 이 상품의 위험등급(4등급)을 맞춰보는 절차예요.
          </p>
        </div>
      </div>

      <div className="px-6 pb-4 shrink-0">
        <Button disabled={!requiredChecked} onClick={() => navigate('/order/review')}>
          동의하고 계속
        </Button>
      </div>
    </div>
  )
}

export default OrderTermsPage
