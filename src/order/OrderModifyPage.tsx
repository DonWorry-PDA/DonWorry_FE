import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'

function WarningIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
      <path d="M8 6v3M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.8 2.6a1.4 1.4 0 0 1 2.4 0l4.9 8.4A1.4 1.4 0 0 1 12.9 13H3.1a1.4 1.4 0 0 1-1.2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function OrderModifyPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full">
      <AppBar title="주문 정정·취소" onBack={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6">
        <h2 className="text-heading font-bold text-ink mb-1">
          주문을 바꾸거나
          <br />
          취소할 수 있어요
        </h2>
        <p className="text-body text-ink-sub mb-6">체결 전인지 후인지에 따라 방법이 달라요.</p>

        {/* 아직 체결 전 */}
        <p className="text-sub font-semibold text-ink-hint mb-2">아직 체결 전</p>
        <div className="rounded-card border border-line px-4 py-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-body font-semibold text-ink">배당 ETF 매수</p>
              <p className="text-sub text-ink-hint">1,000만원 · 예약 주문</p>
            </div>
            <span className="text-sub font-semibold text-primary rounded-badge bg-primary-tint px-2 py-0.5">접수됨</span>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 h-11 rounded-btn border border-line text-body font-semibold text-ink">
              정정
            </button>
            <button className="flex-1 h-11 rounded-btn border border-line text-body font-semibold text-ink">
              취소
            </button>
          </div>
        </div>

        {/* 이미 체결됨 */}
        <p className="text-sub font-semibold text-ink-hint mb-2">이미 체결됨</p>
        <div className="rounded-card border border-line px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-body font-semibold text-ink">월지급식 ETF 매수</p>
              <p className="text-sub text-ink-hint">2,000만원 · 6월 15일 체결</p>
            </div>
            <span className="text-sub font-semibold text-success rounded-badge bg-success-bg px-2 py-0.5">체결됨</span>
          </div>

          <div className="rounded-btn bg-warning-bg border border-warning/20 px-3 py-3 flex gap-2 mb-3">
            <span className="text-warning">
              <WarningIcon />
            </span>
            <div>
              <p className="text-sub font-semibold text-warning-text">되돌리려면 다시 팔아야 해요</p>
              <p className="text-sub text-warning-text/80">
                이미 산 상품이라 '취소'가 아니라 되팔기(역주문)가 필요해요. 그 사이 가격이 달라지고 수수료·세금이 새로 들어요.
              </p>
            </div>
          </div>

          <button className="w-full h-11 rounded-btn border border-line text-body font-semibold text-ink">
            되팔기 주문 넣기
          </button>
        </div>
      </div>

      <div className="px-6 pb-4 shrink-0">
        <button className="w-full text-body text-primary font-semibold text-center py-2">
          상담원과 함께 처리하기
        </button>
      </div>
    </div>
  )
}

export default OrderModifyPage
