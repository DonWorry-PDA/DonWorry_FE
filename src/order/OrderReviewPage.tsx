import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import RedirectWithToast from '../common/components/RedirectWithToast'
import Button from '../common/components/Button'
import { type BuyItem } from './components/BuyConfirmModal'
import useGetRecommendation from '../paycheckPlan/hooks/useGetRecommendation'
import { findPlan, mapExecutionSummary } from '../paycheckPlan/utils/planMapper'
import CenterMessage from '../paycheckPlan/components/CenterMessage'
import usePostMarketOpenReminder from '@/notification/hooks/usePostMarketOpenReminder'

function ArrowUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 11V3M3 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function OrderReviewPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const planId = state?.planId as string | undefined

  const { data, isLoading } = useGetRecommendation()
  const [confirmed, setConfirmed] = useState(false)
  const [reminderError, setReminderError] = useState(false)
  const { mutate: subscribeMarketOpenReminder } = usePostMarketOpenReminder()

  if (isLoading) {
    return (
      <div className="flex flex-col h-dvh">
        <AppBar title="주문 검토" onBack={() => navigate(-1)} />
        <CenterMessage>설계안을 불러오고 있어요</CenterMessage>
      </div>
    )
  }

  const plan = data && planId ? findPlan(data, planId) : undefined
  if (!data || !plan) {
    return <RedirectWithToast to="/paycheck-plan/plans" message="설계안 정보를 찾을 수 없어요" />
  }

  const summary = mapExecutionSummary(data, plan)
  const buyItems = summary.items.filter((i) => i.action === 'buy')
  const totalAmount = buyItems.reduce((sum, i) => sum + i.amount, 0)

  const buyModalItems: BuyItem[] = buyItems.map((item) => ({
    name: item.productName ?? item.name,
    productType: 'ETF',
    amount: `${(item.amount * 10000).toLocaleString('ko-KR')}`,
    amountWon: item.amount * 10000,
    ticker: item.ticker,
    productId: item.productId,
  }))

  function isMarketOpen() {
    if (import.meta.env.VITE_SKIP_MARKET_CHECK === 'true') return true
    const now = new Date()
    const kst = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
    const day = kst.getDay()
    if (day === 0 || day === 6) return false
    const total = kst.getHours() * 60 + kst.getMinutes()
    return total >= 9 * 60 && total < 15 * 60 + 30
  }

  function handleOrderStart() {
    if (!isMarketOpen()) {
      setReminderError(false)
      subscribeMarketOpenReminder(undefined, {
        onSuccess: () => navigate('/order/reserved'),
        onError: () => setReminderError(true),
      })
      return
    }
    const totalAmountWon = buyModalItems.reduce((sum, item) => sum + (item.amountWon ?? 0), 0)
    navigate('/order/transfer', { state: { items: buyModalItems, totalAmountWon, planId } })
  }

  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <AppBar title="주문 검토" onBack={() => navigate(-1)} />

      <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-4 pb-6">
        <h2 className="text-heading font-bold text-ink mb-6">이렇게 주문할게요</h2>

        <div className="flex flex-col gap-4">
          {buyItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="size-8 rounded-icon flex items-center justify-center shrink-0 bg-success-bg text-success">
                <ArrowUpIcon />
              </div>
              <div className="flex-1">
                <p className="text-body font-semibold text-ink-hint">{item.productName ?? item.name}</p>
              </div>
              <p className="font-inter text-body font-bold text-ink shrink-0">
                {(item.amount * 10000).toLocaleString('ko-KR')}원
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative shrink-0 px-6 pb-6 pt-3">
        <div className="pointer-events-none absolute -top-8 inset-x-0 h-8 bg-gradient-to-b from-white/0 to-white" />
        {/* 합계 */}
        <div className="border border-line rounded-card px-4 py-3 flex flex-col gap-2.5 mb-2">
          <div className="flex justify-between items-center">
            <p className="text-body text-ink-sub">총 주문액</p>
            <p className="font-inter text-body font-semibold text-ink">
              {(totalAmount * 10000).toLocaleString('ko-KR')}원
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-body text-ink-sub">예상 수수료</p>
            <p className="font-inter text-body text-ink">협의 예정</p>
          </div>
        </div>

        <p className="text-sub text-ink-hint mb-4 px-1">
          예상은 실시간 시세라 체결 가격과 달라질 수 있어요.
        </p>

        {/* 확인 체크 */}
        <button
          role="checkbox"
          aria-checked={confirmed}
          onClick={() => setConfirmed((v) => !v)}
          className="flex items-center gap-3 mb-4 w-full text-left"
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

        {reminderError && (
          <p className="text-sub text-danger mb-3">알림 등록에 실패했어요. 다시 시도해 주세요.</p>
        )}
        <Button disabled={!confirmed} onClick={handleOrderStart}>
          주문 실행
        </Button>
      </div>

    </div>
  )
}

export default OrderReviewPage
