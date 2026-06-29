import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'
import Badge from '../common/components/Badge'
import InfoBox from '../common/components/InfoBox'
import BottomSheet from '../common/components/BottomSheet'
import CenterMessage from './components/CenterMessage'
import useGetRecommendation from './hooks/useGetRecommendation'
import { findPlan, mapExecutionSummary } from './utils/planMapper'

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

function useTapPhase() {
  const [phase, setPhase] = useState<'visible' | 'out' | 'gone'>('visible')
  useEffect(() => {
    const hide = setTimeout(() => setPhase('out'), 2800)
    const remove = setTimeout(() => setPhase('gone'), 3400)
    return () => { clearTimeout(hide); clearTimeout(remove) }
  }, [])
  return phase
}

function TapBubble() {
  const phase = useTapPhase()
  if (phase === 'gone') return null
  return (
    <div className={`absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-opacity motion-reduce:transition-none duration-500 ${phase === 'visible' ? 'opacity-100' : 'opacity-0'}`}>
      <div className="relative bg-ink rounded-card px-3 py-1.5">
        <p className="text-caption font-semibold text-white whitespace-nowrap">탭하면 상세를 볼 수 있어요</p>
        <div className="absolute top-full right-3 border-x-[5px] border-t-[6px] border-x-transparent border-t-ink" />
      </div>
    </div>
  )
}

function TapRipple() {
  const phase = useTapPhase()
  if (phase === 'gone') return null
  return (
    <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 transition-opacity motion-reduce:transition-none duration-500 ${phase === 'visible' ? 'opacity-100' : 'opacity-0'}`}>
      <div className="relative size-7">
        <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping motion-reduce:animate-none" />
        <div className="size-7 rounded-full bg-primary/15" />
      </div>
    </div>
  )
}

function PaycheckExecutePage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const planId = state?.planId as string | undefined
  const [showAccountSheet, setShowAccountSheet] = useState(false)
  const { data, isLoading } = useGetRecommendation()

  if (isLoading) {
    return (
      <div className="flex flex-col h-dvh">
        <AppBar title="실행 요약" onBack={() => navigate(-1)} />
        <CenterMessage>설계안을 불러오고 있어요</CenterMessage>
      </div>
    )
  }

  const plan = data && planId ? findPlan(data, planId) : undefined
  if (!data || !plan) {
    return (
      <div className="flex flex-col h-dvh">
        <AppBar title="실행 요약" onBack={() => navigate(-1)} />
        <CenterMessage variant="alert">설계안 정보를 불러올 수 없어요. 설계안 화면으로 돌아가 다시 시도해주세요.</CenterMessage>
      </div>
    )
  }

  const summary = {
    ...mapExecutionSummary(data, plan),
    estimatedFee: 0, // TODO: BE 미제공
  }

  return (
    <div className="flex flex-col h-dvh">
      <AppBar title="실행 요약" onBack={() => navigate(-1)} />

      <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-4">
        <Badge tone="primary" className="mb-3">{summary.planName}</Badge>

        <h2 className="text-heading font-bold text-ink mb-1 mt-3">
          이 설계안을 실행하면
          <br />
          <span className="text-primary">매달 받는 돈이 늘어요</span>
        </h2>

        {/* 충당률 변화 카드 */}
        <div className="border border-line rounded-card px-4 py-3 flex items-center justify-between mb-4 mt-4">
          <div>
            <p className="text-sub text-ink-hint mb-0.5">지금 충당률</p>
            <p className="font-inter text-card font-bold text-warning">{summary.coverageFrom}%</p>
          </div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-ink-hint">
            <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="text-right">
            <p className="text-sub text-ink-hint mb-0.5">실행 후</p>
            <p className="font-inter text-card font-bold text-success">{summary.coverageTo}%</p>
          </div>
        </div>

        <InfoBox tone="success" className="mb-5">
          매달 받는 돈이 {summary.cashflowFrom}만원 →{' '}
          <span className="font-semibold">{summary.cashflowTo}만원</span>으로 늘어날 것으로 예상돼요.
        </InfoBox>

        <div className="relative mb-3">
          <p className="text-sub text-ink-hint">실행 내용 · {summary.items.length}가지</p>
          <TapBubble />
        </div>

        <div className="flex flex-col gap-3 mb-4">
          {summary.items.map((item, idx) => (
            <button
              key={item.id}
              className="flex items-center gap-3 w-full text-left"
              onClick={() =>
                item.productId != null &&
                navigate('/order/product', {
                  state: { productId: item.productId, ticker: item.ticker },
                })
              }
            >
              <div
                className={`size-8 rounded-icon flex items-center justify-center shrink-0 ${
                  item.action === 'sell' ? 'bg-danger-bg text-danger' : 'bg-success-bg text-success'
                }`}
              >
                {item.action === 'sell' ? <ArrowDownIcon /> : <ArrowUpIcon />}
              </div>
              <div className="flex-1">
                <p className="text-body font-semibold text-ink">{item.name}</p>
                <p className="text-sub text-ink-hint">{item.description}</p>
              </div>
              <p className="font-inter text-body font-bold text-ink shrink-0">{item.amount.toLocaleString()}만</p>
              {item.productId != null && (
                <div className="relative shrink-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-ink-hint">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {idx === 0 && <TapRipple />}
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between py-3 border-t border-divider mb-4">
          <p className="text-body text-ink-sub">예상 수수료·세금</p>
          <p className="font-inter text-body font-medium text-ink">약 {summary.estimatedFee}만원</p>
        </div>

        <InfoBox className="mb-6">{summary.notice}</InfoBox>
      </div>

      <StickyFooter>
        <div className="flex flex-col gap-2">
          <button onClick={() => navigate('/home')} className="text-body text-ink-hint text-center py-1">나중에하기</button>
          <Button onClick={() => setShowAccountSheet(true)}>실행 시작하기</Button>
        </div>
      </StickyFooter>

      <BottomSheet open={showAccountSheet} onClose={() => setShowAccountSheet(false)}>
        <div className="px-6 pb-8 pt-4">
          <h3 className="text-card font-bold text-ink mb-2">설계안 실행에 계좌가 필요해요</h3>
          <p className="text-body text-ink-sub mb-6">
            신한 은퇴솔루션 계좌가 있어야<br />이 설계안을 바로 실행할 수 있어요.
          </p>
          <Button
            onClick={() =>
              navigate('/account-open', { state: { returnTo: 'execute', planId } })
            }
          >
            계좌 만들기
          </Button>
          <button
            className="w-full text-center text-body text-ink-hint py-3 mt-1"
            onClick={() => {
              setShowAccountSheet(false)
              navigate('/order/pin', { state: { planId } })
            }}
          >
            이미 있어요
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}

export default PaycheckExecutePage
