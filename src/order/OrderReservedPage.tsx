import { useNavigate } from 'react-router-dom'
import Button from '../common/components/Button'

function OrderReservedPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-dvh bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-10">
        {/* 아이콘 */}
        <div className="size-16 rounded-full bg-surface flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="11" stroke="#8B95A1" strokeWidth="2" />
            <path d="M16 10v6l4 2" stroke="#8B95A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 className="text-heading font-bold text-ink text-center mb-2">
          지금은 장 시간이 아니에요
        </h2>
        <p className="text-body text-ink-sub text-center mb-8">
          주문은 평일 오전 9시 ~ 오후 3시 30분에<br />
          가능해요. 내일 장이 열리면 다시 시도해 주세요.
        </p>

        {/* 장 시간 안내 카드 */}
        <div className="w-full rounded-card border border-line px-4 py-4 flex flex-col gap-3 mb-4">
          <div className="flex justify-between items-center">
            <p className="text-body text-ink-sub">주문 가능 시간</p>
            <p className="text-body font-medium text-ink">평일 09:00 ~ 15:30</p>
          </div>
          <div className="h-px bg-divider" />
          <div className="flex justify-between items-center">
            <p className="text-body text-ink-sub">다음 장 개시</p>
            <p className="text-body font-medium text-ink">다음 영업일 09:00</p>
          </div>
        </div>

        <div className="w-full rounded-btn bg-surface px-4 py-3">
          <p className="text-sub text-ink-sub">
            장이 열리면 알림으로 알려드릴게요. 알림을 받은 후 다시 주문해 주세요.
          </p>
        </div>
      </div>

      <div className="px-5 pb-4 shrink-0">
        <Button onClick={() => navigate('/home')}>홈으로</Button>
      </div>
    </div>
  )
}

export default OrderReservedPage
