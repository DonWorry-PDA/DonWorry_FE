import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Modal from '../common/components/Modal'
import Button from '../common/components/Button'
import useGetSavedPlan from './hooks/useGetSavedPlan'
import useDeleteSavedPlan from './hooks/useDeleteSavedPlan'
import { toManwon } from './utils/planMapper'
import type { SavedPlanResponse } from './types/savedPlan'
import { useToast } from '../common/contexts/ToastContext'
import { NavHomeIc } from '../common/assets/icons'

const PLAN_TYPE_LABEL: Record<string, string> = {
  STABLE: '안정 월급형',
  BALANCED: '균형 월급형',
  LIQUIDITY: '유동성 월급형',
}

function SavedPlansPage() {
  const navigate = useNavigate()
  const { data: savedPlans, isLoading } = useGetSavedPlan()
  const { mutate: deletePlan, isPending: isDeleting } = useDeleteSavedPlan()
  const [targetPlan, setTargetPlan] = useState<SavedPlanResponse | null>(null)
  const { showToast } = useToast()

  const handleDelete = () => {
    if (!targetPlan) return
    deletePlan(targetPlan.id, {
      onSuccess: () => {
        setTargetPlan(null)
        showToast('설계안을 삭제했어요')
      },
    })
  }

  return (
    <div className="flex flex-col h-dvh bg-white">
      <AppBar
        title="저장한 설계안"
        onBack={() => navigate(-1)}
        rightAction={
          <button type="button" onClick={() => navigate('/home')} aria-label="홈으로" className="text-ink-sub">
            <NavHomeIc width={22} height={22} />
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-6 flex flex-col gap-3">
        {isLoading ? (
          <div className="h-36 animate-pulse rounded-card-lg border border-line bg-surface-muted" />
        ) : !savedPlans || savedPlans.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 pb-20">
            <p className="text-body font-semibold text-ink">저장한 설계안이 없어요</p>
            <p className="text-sub text-ink-hint">설계안 화면에서 저장해보세요</p>
          </div>
        ) : (
          savedPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-card-lg border border-line px-5 py-4 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-caption text-primary font-semibold bg-primary-tint rounded-badge px-2 py-0.5 self-start">
                    {PLAN_TYPE_LABEL[plan.planType] ?? plan.planType}
                  </span>
                  <p className="font-inter text-card font-bold text-ink mt-1">
                    월 {toManwon(plan.monthlyIncome).toLocaleString('ko-KR')}만원
                  </p>
                  <p className="text-sub text-ink-sub">
                    생활비 충당 {Math.round(plan.totalCoverageRate)}%
                  </p>
                </div>
                {plan.savedAt && (
                  <p className="text-caption text-ink-hint shrink-0">
                    {String(plan.savedAt).slice(0, 10)} 저장
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-1 border-t border-divider">
                <button
                  className="flex-1 h-10 rounded-btn border border-line text-sub font-semibold text-danger"
                  onClick={() => setTargetPlan(plan)}
                >
                  삭제
                </button>
                <button
                  className="flex-1 h-10 rounded-btn bg-primary text-sub font-semibold text-white"
                  onClick={() =>
                    navigate(`/paycheck-plan/saved/${plan.id}`, { state: { plan } })
                  }
                >
                  설계안 보기
                </button>
              </div>
            </div>
          ))
        )}
      </main>

      {targetPlan && (
        <Modal>
          <div className="flex flex-col items-center px-6 pt-8 pb-6 gap-2 text-center">
            <p className="text-card font-bold text-ink">설계안을 삭제할까요?</p>
            <p className="text-body text-ink-sub">삭제하면 다시 되돌릴 수 없어요</p>
            <div className="flex gap-2 w-full mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setTargetPlan(null)}>
                취소
              </Button>
              <Button className="flex-1" disabled={isDeleting} onClick={handleDelete}>
                {isDeleting ? '삭제 중…' : '삭제'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default SavedPlansPage
