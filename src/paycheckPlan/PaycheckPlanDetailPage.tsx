import { useNavigate, useParams } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'
import InfoBox from '../common/components/InfoBox'
import AllocationStackBar from './components/AllocationStackBar'
import CenterMessage from './components/CenterMessage'
import useGetRecommendation from './hooks/useGetRecommendation'
import { findPlan, mapPlanDetail } from './utils/planMapper'

function WarningIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-warning shrink-0 mt-0.5">
      <path
        d="M8 2L14.5 13H1.5L8 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8 6.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.75" fill="currentColor" />
    </svg>
  )
}

function PaycheckPlanDetailPage() {
  const navigate = useNavigate()
  const { planId } = useParams<{ planId: string }>()
  const { data, isLoading } = useGetRecommendation()

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <AppBar title="설계안" onBack={() => navigate(-1)} />
        <div className="flex-1 overflow-y-auto px-6 pt-4">
          <div className="mb-4 h-[56px] animate-pulse rounded-card bg-surface-muted" />
          <div className="flex flex-col gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-[52px] animate-pulse rounded-card bg-surface-muted" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // 캐시된 설계안이 있으면 백그라운드 재요청 실패(isError)와 무관하게 그대로 보여준다.
  // 정말 해당 안이 없을 때만(!plan) 안내한다.
  const plan = data && planId ? findPlan(data, planId) : undefined
  if (!data || !plan) {
    return (
      <div className="flex flex-col h-full">
        <AppBar title="설계안" onBack={() => navigate(-1)} />
        <CenterMessage variant="alert">설계안을 찾을 수 없어요</CenterMessage>
      </div>
    )
  }

  const detail = mapPlanDetail(data, plan)

  return (
    <div className="flex flex-col h-full">
      <AppBar title={detail.planName} onBack={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto">
        {/* 헤더 카드 */}
        <div className="bg-primary px-5 pt-4 pb-6 mx-6 mt-4 rounded-card-xl">
          <p className="text-sub text-white/70 mb-1">이 설계안의 예상 월급</p>
          <p className="font-inter text-display font-bold text-white">
            {detail.expectedMonthlyIncome}만원
            <span className="text-body font-normal text-white/70 ml-1">/ 월 · 세후 {detail.afterTaxIncome}만원</span>
          </p>
          <p className="text-sub text-white/80 mt-2">
            생활비 충당 {detail.coverageFrom}% → {detail.coverageTo}% · 부족분 {detail.shortfallFrom}만 → {detail.shortfallTo}만원
          </p>
        </div>

        <div className="px-6 pt-6">
          <p className="text-body font-semibold text-ink mb-3">무엇으로 만들어지나요</p>
          <AllocationStackBar allocations={detail.allocations} />

          <div className="border-t border-divider pt-4 mt-2">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-surface rounded-card p-4">
                <p className="text-sub text-ink-hint mb-1">매달 받는 월급</p>
                <p className="font-inter text-card font-bold text-ink">{detail.monthlyIncome}만원</p>
                <p className="text-sub text-ink-hint mt-1">국민연금 120만과 별도</p>
              </div>
              <div className="bg-surface rounded-card p-4">
                <p className="text-sub text-ink-hint mb-1">원금 평가액</p>
                <p className="font-inter text-card font-bold text-ink">{detail.principalValue.toLocaleString('ko-KR')}만원</p>
                <p className="text-sub text-ink-hint mt-1">시장 따라 움직여요 · 팔지 않으면 월급은 유지</p>
              </div>
            </div>

            <InfoBox tone="warning" icon={<WarningIcon />} className="mb-6">
              <p className="text-body font-semibold text-warning-text mb-0.5">월급이 보장되는 건 아니에요</p>
              <p className="text-sub text-warning-text">{detail.notice}</p>
            </InfoBox>
          </div>
        </div>
      </div>

      <StickyFooter>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/paycheck-plan/execute', { state: { planId } })}>
            진행하기
          </Button>
          <Button onClick={() => navigate('/paycheck-plan/consult')}>전문가와 같이 보기</Button>
        </div>
      </StickyFooter>
    </div>
  )
}

export default PaycheckPlanDetailPage
