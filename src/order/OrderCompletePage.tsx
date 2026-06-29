import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from '../common/components/Button'
import CheckBadge from '../common/components/CheckBadge'
import useGetRecommendation from '../paycheckPlan/hooks/useGetRecommendation'
import usePostSalaryPlanConfirm from '../paycheckPlan/hooks/usePostSalaryPlanConfirm'
import { buildSalaryPlanConfirm, findPlan, mapExecutionSummary } from '../paycheckPlan/utils/planMapper'

function OrderCompletePage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const planId = (state as { planId?: string } | null)?.planId

  const { data, isLoading, isError } = useGetRecommendation()
  const plan = data && planId ? findPlan(data, planId) : undefined
  const summary = data && plan ? mapExecutionSummary(data, plan) : undefined

  // 매수 완료 시점에 plan을 확정해 기이용자로 전환(운용현황 분기 활성화).
  // planId가 있는 월급 만들기 실행에서만 동작하고, 추천 데이터가 준비되면 1회만 호출한다.
  const { mutate: confirmPlan } = usePostSalaryPlanConfirm()
  const confirmedRef = useRef(false)
  useEffect(() => {
    if (confirmedRef.current || !data || !plan) return
    confirmedRef.current = true
    confirmPlan(buildSalaryPlanConfirm(data, plan))
  }, [data, plan, confirmPlan])

  const summaryUnavailable = isLoading || isError || !planId || (data && !plan)

  return (
    <div className="flex h-dvh flex-col bg-white">
      <div className="flex flex-1 flex-col items-center overflow-y-auto px-6 pt-[calc(5dvh+1.375rem)] pb-6">
        <CheckBadge />

        <h2 className="mt-6 text-heading font-bold text-ink text-center mb-1">실행을 마쳤어요</h2>
        <p className="text-body text-ink-sub text-center mb-8">설계안이 실제 계좌에 반영됐어요</p>

        {/* 월수입 변화 카드 */}
        <div className="w-full rounded-card-lg bg-primary px-5 py-5 mb-4">
          <p className="text-sub text-white/70 mb-1">이제 매달 받는 돈</p>
          {summaryUnavailable ? (
            <p className="text-body text-white/70">
              {isLoading ? '불러오는 중...' : '설계안 정보를 확인할 수 없어요'}
            </p>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-inter text-display font-bold text-white">
                {summary!.cashflowFrom.toLocaleString('ko-KR')}만원
              </span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white/60">
                <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-inter text-display font-bold text-white">
                {summary!.cashflowTo.toLocaleString('ko-KR')}만원
              </span>
            </div>
          )}
        </div>

        {/* 충당률 반영 */}
        <div className="w-full rounded-card border border-line px-4 py-4 flex items-center gap-3 mb-4">
          <div className="size-6 rounded-full bg-success flex items-center justify-center shrink-0">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6.5L4.5 9L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-body font-semibold text-ink">홈·캘린더에 반영됐어요</p>
            {summary ? (
              <p className="text-sub text-ink-hint">
                생활 안정도 충당률 {summary.coverageFrom}% → {summary.coverageTo}%
              </p>
            ) : (
              <p className="text-sub text-ink-hint">충당률이 개선됐어요</p>
            )}
          </div>
        </div>

        {/* 안내 박스 */}
        <div className="w-full rounded-btn bg-surface px-4 py-3 mb-8">
          <p className="text-sub text-ink-sub">
            계약일로부터 <span className="font-semibold text-ink">7영업일 이내</span> 청약을 철회할 수 있어요. (일부 상품 한정)
          </p>
        </div>
      </div>

      <div className="px-5 pb-4 shrink-0">
        <Button onClick={() => navigate('/order/result', { state })}>다음</Button>
      </div>
    </div>
  )
}

export default OrderCompletePage
