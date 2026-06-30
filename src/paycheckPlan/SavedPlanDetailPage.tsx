import { useLocation, useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import InfoBox from '../common/components/InfoBox'
import type { SavedPlanResponse } from './types/savedPlan'
import { toManwon } from './utils/planMapper'

const PLAN_TYPE_LABEL: Record<string, string> = {
  STABLE: '안정 월급형',
  BALANCED: '균형 월급형',
  LIQUIDITY: '유동성 월급형',
}

function WarningIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-warning shrink-0 mt-0.5">
      <path d="M8 2L14.5 13H1.5L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 6.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.75" fill="currentColor" />
    </svg>
  )
}

function SavedPlanDetailPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const plan = state?.plan as SavedPlanResponse | undefined

  if (!plan) {
    return (
      <div className="flex flex-col h-dvh">
        <AppBar title="저장한 설계안" onBack={() => navigate(-1)} />
        <div className="flex flex-col items-center justify-center flex-1 gap-2">
          <p className="text-body text-ink-sub">설계안 정보를 불러올 수 없어요</p>
        </div>
      </div>
    )
  }

  const planName = PLAN_TYPE_LABEL[plan.planType] ?? plan.planType
  const expectedIncome = toManwon(plan.monthlyIncome)
  const afterTaxIncome = Math.round(expectedIncome * 0.96)
  const coverageFrom = Math.min(100, Math.round(plan.currentCoverageRate))
  const coverageTo = Math.min(100, Math.round(plan.totalCoverageRate))
  const shortfallFrom = toManwon(plan.currentMonthlyShortfall)
  const shortfallTo = toManwon(plan.residualMonthlyShortfall)
  const principalValue = toManwon(plan.principalAmount)

  return (
    <div className="flex flex-col h-dvh">
      <AppBar title={planName} onBack={() => navigate(-1)} />

      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* 헤더 카드 */}
        <div className="bg-primary px-5 pt-4 pb-6 mx-6 mt-4 rounded-card-xl">
          <p className="text-sub text-white/70 mb-1">이 설계안의 예상 월급</p>
          <p className="font-inter text-display font-bold text-white">
            {expectedIncome}만원
          </p>
          <p className="text-sub text-white/70">월 · 세후 {afterTaxIncome}만원</p>
          <p className="text-sub text-white/80 mt-2">
            생활비 충당 {coverageFrom}% → {coverageTo}% · 부족분 {shortfallFrom}만 → {shortfallTo}만원
          </p>
        </div>

        <div className="px-6 pt-6">
          {/* 종목 구성 */}
          <p className="text-body font-semibold text-ink mb-3">종목 구성</p>
          <div className="flex flex-col gap-2 mb-4">
            {plan.holdings.map((h) => (
              <div
                key={h.productId}
                className="flex items-center justify-between bg-surface rounded-card px-4 py-3"
              >
                <p className="text-body text-ink font-medium truncate flex-1 mr-3">{h.productName}</p>
                <p className="font-inter text-sub text-ink-sub shrink-0">
                  {toManwon(h.targetAmount).toLocaleString('ko-KR')}만원
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-divider pt-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-surface rounded-card p-4">
                <p className="text-sub text-ink-hint mb-1">원금 평가액</p>
                <p className="font-inter text-card font-bold text-ink">{principalValue.toLocaleString('ko-KR')}만원</p>
                <p className="text-sub text-ink-hint mt-1">시장 따라 움직여요</p>
              </div>
              <div className="bg-surface rounded-card p-4">
                <p className="text-sub text-ink-hint mb-1">저장일</p>
                <p className="text-md font-bold text-ink">
                  {plan.savedAt ? String(plan.savedAt).slice(0, 10) : '-'}
                </p>
              </div>
            </div>

            <InfoBox tone="warning" icon={<WarningIcon />} className="mb-6">
              <p className="text-body font-semibold text-warning-text mb-0.5">월급이 보장되는 건 아니에요</p>
              <p className="text-sub text-warning-text">분배금·배당이 줄면 알림으로 알려드리고, 다시 조정하도록 도와드려요.</p>
            </InfoBox>
          </div>
        </div>
      </div>

    </div>
  )
}

export default SavedPlanDetailPage
