import { useNavigate, useLocation } from 'react-router-dom'
import Button from '../common/components/Button'

function OrderReservedPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const itemCount: number = (state as { itemCount?: number } | null)?.itemCount ?? 0

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-10">
        {/* 아이콘 */}
        <div className="size-16 rounded-full bg-primary-tint flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="11" stroke="#0046FF" strokeWidth="2" />
            <path d="M16 10v6l4 2" stroke="#0046FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 className="text-heading font-bold text-ink text-center mb-2">
          주문이 예약됐어요
        </h2>
        <p className="text-body text-ink-sub text-center mb-8">
          지금은 장이 닫혀 있어요.<br />
          내일 장이 열리면 자동으로 주문이 들어가요.
        </p>

        {/* 안내 카드 */}
        <div className="w-full rounded-card border border-line px-4 py-4 flex flex-col gap-3 mb-4">
          <div className="flex justify-between items-center">
            <p className="text-body text-ink-sub">예약 주문 수</p>
            <p className="font-inter text-body font-semibold text-ink">{itemCount}건</p>
          </div>
          <div className="h-px bg-divider" />
          <div className="flex justify-between items-center">
            <p className="text-body text-ink-sub">예상 실행 시각</p>
            <p className="text-body font-medium text-ink">내일 09:00 장 개시 후</p>
          </div>
        </div>

        <div className="w-full rounded-btn bg-surface px-4 py-3">
          <p className="text-sub text-ink-sub">
            주문이 체결되면 알림으로 알려드려요. 체결 전까지는 주문 내역에서 취소할 수 있어요.
          </p>
        </div>
      </div>

      <div className="px-5 pb-4 shrink-0 flex flex-col gap-2">
        <button
          onClick={() => navigate('/order/modify')}
          className="w-full text-body text-ink-sub text-center py-3"
        >
          예약 내역 보기
        </button>
        <Button onClick={() => navigate('/home')}>홈으로</Button>
      </div>
    </div>
  )
}

export default OrderReservedPage
