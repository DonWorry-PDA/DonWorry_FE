import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'

function ArrowUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 11V3M3 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 3v8M3 7l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const SELL_ITEMS = [
  { name: '국내주식', detail: '시장가 약 320주', amount: '2,000만' },
]

const BUY_ITEMS = [
  { name: '월지급식 ETF', detail: '약 1,720주 · 예상 11,600원', amount: '2,000만' },
  { name: '배당 ETF', detail: '약 980주 · 예상 10,200원', amount: '1,000만' },
]

function OrderReviewPage() {
  const navigate = useNavigate()
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div className="flex flex-col h-full">
      <AppBar title="주문 검토" onBack={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-6">
        <h2 className="text-heading font-bold text-ink mb-6">이렇게 주문할게요</h2>

        {/* 팔 자산 */}
        <p className="text-sub text-ink-hint mb-2">팔 자산</p>
        <div className="flex flex-col gap-3 mb-5">
          {SELL_ITEMS.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <div className="size-8 rounded-icon flex items-center justify-center shrink-0 bg-danger-bg text-danger">
                <ArrowDownIcon />
              </div>
              <div className="flex-1">
                <p className="text-body font-semibold text-ink">{item.name}</p>
                <p className="text-sub text-ink-hint">{item.detail}</p>
              </div>
              <p className="font-inter text-body font-bold text-ink shrink-0">{item.amount}</p>
            </div>
          ))}
        </div>

        {/* 살 자산 */}
        <p className="text-sub text-ink-hint mb-2">살 자산</p>
        <div className="flex flex-col gap-3 mb-5">
          {BUY_ITEMS.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <div className="size-8 rounded-icon flex items-center justify-center shrink-0 bg-success-bg text-success">
                <ArrowUpIcon />
              </div>
              <div className="flex-1">
                <p className="text-body font-semibold text-ink">{item.name}</p>
                <p className="text-sub text-ink-hint">{item.detail}</p>
              </div>
              <p className="font-inter text-body font-bold text-ink shrink-0">{item.amount}</p>
            </div>
          ))}
        </div>

        {/* 합계 */}
        <div className="border border-line rounded-card px-4 py-3 flex flex-col gap-2.5">
          <div className="flex justify-between items-center">
            <p className="text-body text-ink-sub">총 주문액</p>
            <p className="font-inter text-body font-semibold text-ink">3,000만원</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-body text-ink-sub">예상 수수료</p>
            <p className="font-inter text-body text-ink">9,800원</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-body text-ink-sub">증권거래세 (매도분)</p>
            <p className="font-inter text-body text-ink">36,000원</p>
          </div>
          <div className="h-px bg-divider" />
          <div className="flex justify-between items-center">
            <p className="text-body font-semibold text-ink">예상 차감 합계</p>
            <p className="font-inter text-body font-bold text-ink">약 4만 5,800원</p>
          </div>
        </div>

        <p className="text-sub text-ink-hint mt-3 px-1">
          예상은 실시간 시세라 체결 가격과 달라질 수 있어요. 본 문서 내용은 자동으로 최소화해요.
        </p>

        {/* 확인 체크 */}
        <button
          onClick={() => setConfirmed((v) => !v)}
          className="flex items-center gap-3 mt-5 w-full text-left"
        >
          <span
            className={`shrink-0 size-6 rounded-full flex items-center justify-center transition-colors ${
              confirmed ? 'bg-primary' : 'border-2 border-radio bg-white'
            }`}
          >
            {confirmed && (
              <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                <path d="M1 4.5L4.5 8L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span className="text-body text-ink">위 주문 내용을 확인했어요</span>
        </button>
      </div>

      <div className="px-5 pb-4 shrink-0">
        <Button disabled={!confirmed} onClick={() => navigate('/order/executing')}>
          주문 실행
        </Button>
      </div>
    </div>
  )
}

export default OrderReviewPage
