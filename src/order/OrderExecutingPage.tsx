import { useNavigate } from 'react-router-dom'

type ItemStatus = 'done' | 'pending' | 'running'

interface OrderItem {
  id: string
  name: string
  detail: string
  status: ItemStatus
}

const ITEMS: OrderItem[] = [
  { id: '1', name: '국내주식 매도', detail: '2,000만원 체결 완료', status: 'done' },
  { id: '2', name: '월지급식 ETF 매수', detail: '2,000만원 체결 완료', status: 'done' },
  { id: '3', name: '배당 ETF 매수', detail: '체결 대기 중...', status: 'running' },
]

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5L6.5 12L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SpinnerSm() {
  return (
    <svg
      className="animate-spin text-ink-hint"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
      <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function StatusBadge({ status }: { status: ItemStatus }) {
  if (status === 'done') {
    return (
      <span className="text-sub font-semibold text-success">완료</span>
    )
  }
  if (status === 'running') {
    return (
      <span className="text-sub font-semibold text-primary">진행 중</span>
    )
  }
  return (
    <span className="text-sub text-ink-hint">대기</span>
  )
}

function StatusIcon({ status }: { status: ItemStatus }) {
  if (status === 'done') {
    return (
      <div className="size-7 rounded-full bg-success flex items-center justify-center shrink-0">
        <CheckIcon />
      </div>
    )
  }
  if (status === 'running') {
    return (
      <div className="size-7 rounded-full border-2 border-primary flex items-center justify-center shrink-0">
        <SpinnerSm />
      </div>
    )
  }
  return (
    <div className="size-7 rounded-full border-2 border-line flex items-center justify-center shrink-0" />
  )
}

function OrderExecutingPage() {
  const navigate = useNavigate()
  const doneCount = ITEMS.filter((i) => i.status === 'done').length

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 flex flex-col px-5 pt-16">
        {/* 타이틀 영역 */}
        <div className="flex flex-col items-center mb-10">
          <svg
            className="animate-spin text-primary mb-6"
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
          >
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" strokeOpacity="0.15" />
            <path d="M44 24a20 20 0 0 0-20-20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>

          <h2 className="text-center text-heading font-bold text-ink mb-2">실행 중</h2>
          <p className="text-heading font-bold text-ink text-center mb-1">주문을 실행하고 있어요</p>
          <p className="text-body text-ink-sub text-center">창을 닫아도 백그라운드로 계속 진행돼요</p>
        </div>

        {/* 주문 아이템 리스트 */}
        <div className="flex flex-col gap-4">
          {ITEMS.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <StatusIcon status={item.status} />
              <div className="flex-1">
                <p className="text-body font-semibold text-ink">{item.name}</p>
                <p className="text-sub text-ink-hint">{item.detail}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>

        {doneCount > 0 && (
          <div className="mt-6 rounded-btn bg-surface px-4 py-3">
            <p className="text-sub text-ink-sub">
              {doneCount}개 작업이 끝났어요. 마지막 주문이 체결되면 알림으로 알려드려요.
            </p>
          </div>
        )}
      </div>

      {doneCount === ITEMS.length && (
        <div className="px-5 pb-4 shrink-0">
          <button
            onClick={() => navigate('/order/result')}
            className="w-full h-[54px] rounded-btn bg-primary text-white text-btn font-bold"
          >
            결과 확인
          </button>
        </div>
      )}
    </div>
  )
}

export default OrderExecutingPage
