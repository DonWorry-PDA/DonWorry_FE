import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'

type ItemStatus = 'done' | 'failed'

interface ResultItem {
  id: string
  name: string
  detail: string
  status: ItemStatus
}

const ITEMS: ResultItem[] = [
  { id: '1', name: '국내주식 매도', detail: '2,000만원 완료', status: 'done' },
  { id: '2', name: '월지급식 ETF 매수', detail: '2,000만원 완료', status: 'done' },
  { id: '3', name: '배당 ETF 매수', detail: '체결 실패 · 거래정지', status: 'failed' },
]

function CheckCircle() {
  return (
    <div className="size-7 rounded-full bg-success flex items-center justify-center shrink-0">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function XCircle() {
  return (
    <div className="size-7 rounded-full bg-danger-bg flex items-center justify-center shrink-0">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M4 4l6 6M10 4l-6 6" stroke="#DF3550" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function OrderResultPage() {
  const navigate = useNavigate()
  const failedCount = ITEMS.filter((i) => i.status === 'failed').length
  const doneCount = ITEMS.filter((i) => i.status === 'done').length

  return (
    <div className="flex flex-col h-full">
      <AppBar title="실행 결과" onBack={() => navigate('/home')} />

      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6">
        {/* 부분 실패 경고 */}
        {failedCount > 0 && (
          <div className="rounded-btn bg-warning-bg border border-warning/20 px-4 py-3 flex gap-2 mb-5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5 text-warning">
              <path d="M8 6v3M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M6.8 2.6a1.4 1.4 0 0 1 2.4 0l4.9 8.4A1.4 1.4 0 0 1 12.9 13H3.1a1.4 1.4 0 0 1-1.2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <p className="text-sub font-semibold text-warning-text">
              {ITEMS.length}가지 중 {doneCount}가지만 처리됐어요
            </p>
          </div>
        )}

        <p className="text-sub text-ink-hint mb-3">처리 상태</p>

        {/* 결과 리스트 */}
        <div className="flex flex-col gap-4 mb-6">
          {ITEMS.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              {item.status === 'done' ? <CheckCircle /> : <XCircle />}
              <div className="flex-1">
                <p className="text-body font-semibold text-ink">{item.name}</p>
                <p className={`text-sub ${item.status === 'failed' ? 'text-danger' : 'text-ink-hint'}`}>
                  {item.detail}
                </p>
              </div>
              <span className={`text-sub font-semibold ${item.status === 'done' ? 'text-success' : 'text-danger'}`}>
                {item.status === 'done' ? '완료' : '실패'}
              </span>
            </div>
          ))}
        </div>

        {failedCount > 0 && (
          <div className="rounded-btn bg-surface px-4 py-3 mb-5">
            <p className="text-sub text-ink-sub">
              실패 시 남은 1,000만원에 투자되지 않고 현금으로 계좌에 남아 있어요.
            </p>
          </div>
        )}

        {/* 이렇게 할까요 */}
        {failedCount > 0 && (
          <>
            <p className="text-sub text-ink-hint mb-3">어떻게 할까요?</p>
            <div className="flex flex-col gap-1">
              <button className="flex items-center gap-3 py-4 border-b border-divider text-left">
                <div className="size-8 rounded-icon bg-surface flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8a5 5 0 1 1 10 0" stroke="#0046FF" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M13 8v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" stroke="#0046FF" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-body font-semibold text-ink">실패한 것만 다시 시도</p>
                  <p className="text-sub text-ink-hint">거래 재개시 자동으로 주문해요</p>
                </div>
                <span className="text-ink-hint"><ChevronRightIcon /></span>
              </button>

              <button className="flex items-center gap-3 py-4 border-b border-divider text-left">
                <div className="size-8 rounded-icon bg-surface flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3v10M5 10l3 3 3-3" stroke="#5B6573" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-body font-semibold text-ink">여기서 멈추기</p>
                  <p className="text-sub text-ink-hint">남은 1,000만원은 계좌에 그대로 둬요</p>
                </div>
                <span className="text-ink-hint"><ChevronRightIcon /></span>
              </button>

              <button className="flex items-center gap-3 py-4 text-left">
                <div className="size-8 rounded-icon bg-surface flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3-3m0 0l3 3m-3-3v8M13 8l-3 3m0 0l-3-3m3 3V0" stroke="#5B6573" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-body font-semibold text-ink">전체 되돌리기</p>
                  <p className="text-sub text-ink-hint">원상복구 시도 · 비용 발생 · 상담 연결</p>
                </div>
                <span className="text-ink-hint"><ChevronRightIcon /></span>
              </button>
            </div>
          </>
        )}

        {failedCount === 0 && (
          <button
            onClick={() => navigate('/order/complete')}
            className="w-full h-[54px] rounded-btn bg-primary text-white text-btn font-bold"
          >
            완료 확인
          </button>
        )}
      </div>
    </div>
  )
}

export default OrderResultPage
