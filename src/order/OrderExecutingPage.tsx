import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import BuyConfirmModal, { type BuyItem } from './components/BuyConfirmModal'
import usePostBuy from './hooks/usePostBuy'

type Phase = 'confirming' | 'executing'

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5L6.5 12L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SpinnerSm() {
  return (
    <svg className="animate-spin text-primary" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
      <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

type ItemStatus = 'done' | 'running' | 'pending' | 'error'

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
  if (status === 'error') {
    return (
      <div className="size-7 rounded-full bg-danger flex items-center justify-center shrink-0">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 2l8 8M10 2l-8 8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
    )
  }
  return (
    <div className="size-7 rounded-full border-2 border-line flex items-center justify-center shrink-0" />
  )
}

function StatusBadge({ status }: { status: ItemStatus }) {
  if (status === 'done') return <span className="text-sub font-semibold text-success">완료</span>
  if (status === 'running') return <span className="text-sub font-semibold text-primary">진행 중</span>
  if (status === 'error') return <span className="text-sub font-semibold text-danger">실패</span>
  return <span className="text-sub text-ink-hint">대기</span>
}

function OrderExecutingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const items: BuyItem[] = location.state?.items ?? []
  const planId: string | undefined = location.state?.planId

  const [phase, setPhase] = useState<Phase>('confirming')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [doneCount, setDoneCount] = useState(0)
  const [failedIndices, setFailedIndices] = useState<Set<number>>(new Set())

  const buy = usePostBuy()
  const depositTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resultsRef = useRef<Array<{ id: string; name: string; detail: string; status: 'done' | 'failed' }>>([])

  useEffect(() => {
    return () => {
      if (depositTimerRef.current != null) clearTimeout(depositTimerRef.current)
    }
  }, [])

  const advance = useCallback(
    (failed = false) => {
      const item = items[currentIndex]
      resultsRef.current = [
        ...resultsRef.current,
        {
          id: String(currentIndex + 1),
          name: item.name,
          detail: failed ? '체결 실패' : `${item.amount} 완료`,
          status: failed ? 'failed' : 'done',
        },
      ]
      if (failed) setFailedIndices((prev) => new Set(prev).add(currentIndex))
      const next = currentIndex + 1
      setDoneCount(next)
      if (next < items.length) {
        setCurrentIndex(next)
        setPhase('confirming')
      } else {
        navigate('/order/complete', { state: { results: resultsRef.current, planId } })
      }
    },
    [currentIndex, items, navigate, planId],
  )

  function handleConfirm(quantity: number | undefined) {
    setPhase('executing')
    const item = items[currentIndex]

    if (item.productType === 'ETF') {
      if (item.productId == null || quantity == null) {
        advance(true)
        return
      }
      buy.mutate(
        { productId: item.productId, quantity },
        {
          onSuccess: () => advance(false),
          onError: () => advance(true),
        },
      )
    } else {
      // DEPOSIT / PENSION_SAVING — API 미구현, 잠시 후 자동 진행
      depositTimerRef.current = setTimeout(() => advance(false), 1500)
    }
  }

  // items가 없으면 바로 완료로
  useEffect(() => {
    if (items.length === 0) navigate('/order/complete', { state: { planId } })
  }, [items.length, navigate, planId])

  function itemStatus(idx: number): ItemStatus {
    if (idx < doneCount) return failedIndices.has(idx) ? 'error' : 'done'
    if (idx === currentIndex && phase === 'executing') return 'running'
    return 'pending'
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 flex flex-col px-5 pt-16">
        <div className="flex flex-col items-center mb-10">
          {phase === 'executing' ? (
            <svg className="animate-spin text-primary mb-6" width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" strokeOpacity="0.15" />
              <path d="M44 24a20 20 0 0 0-20-20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
          ) : (
            <div className="size-12 rounded-full bg-primary-tint flex items-center justify-center mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v7l4 2" stroke="#0046FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="9" stroke="#0046FF" strokeWidth="2" />
              </svg>
            </div>
          )}

          <h2 className="text-heading font-bold text-ink mb-1">
            {phase === 'executing' ? '체결 중' : '다음 종목 확인'}
          </h2>
          <p className="text-body text-ink-sub text-center">
            {phase === 'executing'
              ? '창을 닫아도 백그라운드로 계속 진행돼요'
              : '아래 내용을 확인하고 매수를 진행해주세요'}
          </p>
        </div>

        {/* 종목 리스트 */}
        <div className="flex flex-col gap-4">
          {items.map((item, idx) => (
            <div key={`${idx}-${item.name}`} className="flex items-center gap-3">
              <StatusIcon status={itemStatus(idx)} />
              <div className="flex-1">
                <p className="text-body font-semibold text-ink">{item.name}</p>
                <p className="text-sub text-ink-hint">
                  {itemStatus(idx) === 'done'
                    ? `${item.amount}원 체결 완료`
                    : itemStatus(idx) === 'error'
                      ? '체결 실패'
                      : itemStatus(idx) === 'running'
                        ? '체결 대기 중...'
                        : `${item.amount}원`}
                </p>
              </div>
              <StatusBadge status={itemStatus(idx)} />
            </div>
          ))}
        </div>

        {doneCount > 0 && phase === 'executing' && (
          <div className="mt-6 rounded-btn bg-surface px-4 py-3">
            <p className="text-sub text-ink-sub">
              {doneCount}개 완료됐어요. 마지막 주문이 체결되면 알림으로 알려드려요.
            </p>
          </div>
        )}
      </div>

      {phase === 'executing' && (
        <div className="px-5 pb-8 shrink-0">
          <p className="text-sub text-ink-hint text-center">잠시만 기다려주세요</p>
        </div>
      )}

      {phase === 'confirming' && items[currentIndex] && (
        <BuyConfirmModal
          item={items[currentIndex]}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}

export default OrderExecutingPage
