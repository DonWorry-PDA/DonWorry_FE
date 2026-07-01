import { Navigate, useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'
import InfoBox from '../common/components/InfoBox'
import CenterMessage from './components/CenterMessage'
import useGetRecommendation from './hooks/useGetRecommendation'
import { mapComparison, toManwon, Q3_LABELS } from './utils/planMapper'
import { NavHomeIc } from '../common/assets/icons'

function PaycheckComparePage() {
  const navigate = useNavigate()
  const { data, isLoading, isError, error } = useGetRecommendation()

  const homeAction = (
    <button type="button" onClick={() => navigate('/home')} aria-label="홈으로" className="text-ink-sub">
      <NavHomeIc width={22} height={22} />
    </button>
  )

  if (isLoading) {
    return (
      <div className="flex flex-col h-dvh">
        <AppBar title="설계안 비교" onBack={() => navigate(-1)} rightAction={homeAction} />
        <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-4">
          <div className="mb-4 h-10 animate-pulse rounded-card bg-surface-muted" />
          <div className="flex flex-col gap-0">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[52px] animate-pulse border-b border-divider bg-surface-muted first:rounded-t-card last:rounded-b-card last:border-0" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isAxiosError(error) && error.response?.status === 403) {
    return <Navigate to="/paycheck-plan/assets" replace />
  }

  if (isError) {
    return (
      <div className="flex flex-col h-dvh">
        <AppBar title="설계안 비교" onBack={() => navigate(-1)} rightAction={homeAction} />
        <CenterMessage variant="alert">설계안을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</CenterMessage>
      </div>
    )
  }

  const comparison = data ? mapComparison(data) : null
  if (!comparison) {
    return (
      <div className="flex flex-col h-dvh">
        <AppBar title="설계안 비교" onBack={() => navigate(-1)} rightAction={homeAction} />
        <CenterMessage>비교할 설계안이 충분하지 않아요</CenterMessage>
      </div>
    )
  }

  const { columns, rows, notice } = comparison
  const q3Scenarios = data?.q3Scenarios ?? []
  const q3Title = data?.q3ReferenceLabel
  const gridColsClass = columns.length >= 3 ? 'grid-cols-[1fr_1fr_1fr_1fr]' : 'grid-cols-[1fr_1fr_1fr]'

  return (
    <div className="flex flex-col h-dvh">
      <AppBar title="설계안 비교" onBack={() => navigate(-1)} rightAction={homeAction} />

      <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-4">
        <p className="text-body text-ink-sub mb-6">
          같은 잣대로 나란히 놓고 비교해요. 숫자가 아니라{' '}
          <span className="font-bold text-ink">상황</span>으로 골라보세요.
        </p>

        {/* 헤더 행 */}
        <div className={`grid ${gridColsClass} mb-1`}>
          <div />
          {columns.map((col, i) => (
            <p
              key={col.planId}
              className={`text-sub font-semibold text-center ${i === 0 ? 'text-primary' : 'text-ink-sub'}`}
            >
              {col.planName}
            </p>
          ))}
        </div>

        {/* 비교 행 */}
        {rows.map((row) => (
          <div
            key={row.label}
            className={`grid ${gridColsClass} items-center py-3.5 border-t border-divider`}
          >
            <p className="text-sub text-ink-hint pr-2">{row.label}</p>
            {row.values.map((value, i) => (
              <p key={columns[i].planId} className="text-body font-semibold text-ink text-center">
                {value}
              </p>
            ))}
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

      <StickyFooter>
        <button
          type="button"
          className="mb-3 w-full text-center text-sub text-ink-hint"
          onClick={() =>
            navigate('/paycheck-plan/consult/branch', {
              state: { context: 'SALARY_PLAN', institution: 'SHINHAN_SECURITIES' },
            })
          }
        >
          전문가와 같이 보기
        </button>
        <div className={`grid ${columns.length >= 3 ? 'grid-cols-3 gap-2' : 'grid-cols-2 gap-3'}`}>
          {columns.map((col, i) => (
            <Button
              key={col.planId}
              variant={i === columns.length - 1 ? 'primary' : 'outline'}
              className="min-w-0 px-2 truncate"
              onClick={() => navigate(`/paycheck-plan/plans/${col.planId}`)}
            >
              {columns.length >= 3 ? col.planName : `${col.planName} 보기`}
            </Button>
          ))}
        </div>
      </StickyFooter>
    </div>
  )
}

export default PaycheckComparePage
