import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import InfoBox from '../common/components/InfoBox'
import useGetRecommendation from './hooks/useGetRecommendation'
import { mapComparison, toManwon, Q3_LABELS } from './utils/planMapper'

function CenterMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center h-full px-8 text-center text-body text-ink-hint">
      {children}
    </div>
  )
}

function PaycheckComparePage() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useGetRecommendation()

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <AppBar title="설계안 비교" onBack={() => navigate(-1)} />
        <CenterMessage>설계안을 불러오고 있어요</CenterMessage>
      </div>
    )
  }

  const comparison = data ? mapComparison(data) : null
  if (isError || !comparison) {
    return (
      <div className="flex flex-col h-full">
        <AppBar title="설계안 비교" onBack={() => navigate(-1)} />
        <CenterMessage>비교할 설계안이 충분하지 않아요</CenterMessage>
      </div>
    )
  }

  const { leftPlanId, rightPlanId, leftPlanName, rightPlanName, rows, notice } = comparison
  const q3Scenarios = data?.q3Scenarios ?? []
  const q3Title = data?.q3ReferenceLabel

  return (
    <div className="flex flex-col h-full">
      <AppBar title="설계안 비교" onBack={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto px-5 pt-4">
        <p className="text-body text-ink-sub mb-6">
          같은 잣대로 나란히 놓고 비교해요. 숫자가 아니라{' '}
          <span className="font-bold text-ink">상황</span>으로 골라보세요.
        </p>

        {/* 헤더 행 */}
        <div className="grid grid-cols-[1fr_1fr_1fr] mb-1">
          <div />
          <p className="text-sub font-semibold text-primary text-center">{leftPlanName}</p>
          <p className="text-sub font-semibold text-ink-sub text-center">{rightPlanName}</p>
        </div>

        {/* 비교 행 */}
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[1fr_1fr_1fr] items-center py-3.5 border-t border-divider"
          >
            <p className="text-sub text-ink-hint pr-2">{row.label}</p>
            <p className="text-body font-semibold text-ink text-center">{row.left}</p>
            <p className="text-body font-semibold text-ink text-center">{row.right}</p>
          </div>
        ))}

        <InfoBox className="mt-4 mb-6">{notice}</InfoBox>

        {/* Q3 트레이드오프 — 안정안 기준 상속 vs 소비 */}
        {q3Scenarios.length > 0 && (
          <div className="mb-6">
            <p className="text-body font-semibold text-ink mb-1">소진 방식별 상속 vs 소비</p>
            {q3Title && <p className="text-sub text-ink-hint mb-3">{q3Title}</p>}

            <div className="grid grid-cols-[1fr_1fr_1fr] mb-1">
              <div />
              <p className="text-sub font-semibold text-ink-sub text-center">월수령</p>
              <p className="text-sub font-semibold text-ink-sub text-center">예상 상속</p>
            </div>
            {q3Scenarios.map((s) => (
              <div
                key={s.q3}
                className="grid grid-cols-[1fr_1fr_1fr] items-center py-3 border-t border-divider"
              >
                <p className="text-sub text-ink-hint pr-2">{Q3_LABELS[s.q3]}</p>
                <p className="font-inter text-body font-semibold text-ink text-center">
                  {toManwon(s.monthlyIncome).toLocaleString('ko-KR')}만원
                </p>
                <p className="font-inter text-body font-semibold text-ink text-center">
                  {toManwon(s.inheritanceAmount).toLocaleString('ko-KR')}만원
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 py-4 shrink-0 flex gap-3">
        <Button variant="outline" onClick={() => navigate(`/paycheck-plan/plans/${leftPlanId}`)}>
          {leftPlanName} 보기
        </Button>
        <Button onClick={() => navigate(`/paycheck-plan/plans/${rightPlanId}`)}>
          {rightPlanName} 보기
        </Button>
      </div>
    </div>
  )
}

export default PaycheckComparePage
