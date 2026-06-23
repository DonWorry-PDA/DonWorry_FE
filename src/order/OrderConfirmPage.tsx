import { useNavigate } from 'react-router-dom'

function ClockIcon() {
  return (
    <div className="size-16 rounded-full bg-primary-tint flex items-center justify-center mb-6">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="11" stroke="#0046FF" strokeWidth="2" />
        <path d="M16 10v6l4 2" stroke="#0046FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function OrderConfirmPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-10">
        <ClockIcon />

        <h2 className="text-heading font-bold text-ink text-center mb-1">
          주문 접수를
          <br />
          확인하고 있어요
        </h2>
        <p className="text-body text-ink-sub text-center mb-8">
          통신이 잠시 불안정해 결과가 아직 확실하지 않아요.
        </p>

        {/* 경고 박스 */}
        <div className="w-full rounded-btn bg-warning-bg border border-warning/20 px-4 py-4 flex gap-3">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5 text-warning">
            <path d="M8 6v3M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M6.8 2.6a1.4 1.4 0 0 1 2.4 0l4.9 8.4A1.4 1.4 0 0 1 12.9 13H3.1a1.4 1.4 0 0 1-1.2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          <div>
            <p className="text-body font-semibold text-warning-text mb-1">다시 실행하지 말아주세요</p>
            <p className="text-sub text-warning-text/80">
              같은 주문이 두 번 들어갈 수 있어요. 결과는 1~2분 안에 알림으로 알려드릴게요.
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 pb-4 shrink-0 flex flex-col gap-2">
        <button
          onClick={() => navigate('/order/modify')}
          className="w-full h-[54px] rounded-btn border border-line text-btn font-semibold text-ink"
        >
          주문 내역에서 확인
        </button>
        <button
          onClick={() => navigate('/home')}
          className="w-full text-body text-ink-sub text-center py-2"
        >
          닫기
        </button>
      </div>
    </div>
  )
}

export default OrderConfirmPage
