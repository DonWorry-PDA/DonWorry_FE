import { useLocation, useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'
import Badge from '../common/components/Badge'
import InfoBox from '../common/components/InfoBox'
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

function PaycheckExecutePage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const planId = state?.planId as string | undefined
  const { data, isLoading } = useGetRecommendation()

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <AppBar title="실행 요약" onBack={() => navigate(-1)} />
        <CenterMessage>설계안을 불러오고 있어요</CenterMessage>
      </div>
    )
  }

  const plan = data && planId ? findPlan(data, planId) : undefined
  if (!data || !plan) {
    return (
      <div className="flex flex-col h-full">
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
    <div className="flex flex-col h-full">
      <AppBar title="실행 요약" onBack={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto px-6 pt-4">
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

        <p className="text-sub text-ink-hint mb-3">실행 내용 · {summary.items.length}가지</p>

        <div className="flex flex-col gap-3 mb-4">
          {summary.items.map((item) => (
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
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-ink-hint shrink-0">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
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
          <Button onClick={() => navigate('/order/pin', { state: { planId } })}>실행 시작하기</Button>
        </div>
      </StickyFooter>
    </div>
  )
}

export default PaycheckExecutePage
