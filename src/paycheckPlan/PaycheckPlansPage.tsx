import { Navigate, useNavigate } from 'react-router-dom'
import { NavHomeIc } from '../common/assets/icons'
import { isAxiosError } from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'
import InfoBox from '../common/components/InfoBox'
import SalaryPlanCard from './components/SalaryPlanCard'
import CenterMessage from './components/CenterMessage'
import useGetRecommendation from './hooks/useGetRecommendation'
import { mapPlans, toManwon } from './utils/planMapper'

const won = (v: number) => `${toManwon(v).toLocaleString('ko-KR')}만원`

// TODO: 사용자 이름은 추천 응답에 없음 — 프로필 조회 연동 시 실명으로 교체
const userName = '고객'

function PaycheckPlansPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data, isLoading, isError, error, refetch } = useGetRecommendation()

  const handleGoToProfileEdit = () => {
    queryClient.invalidateQueries({ queryKey: ['portfolio', 'recommendation'] })
    navigate('/mypage/profile-edit')
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-dvh">
        <AppBar title="월급 설계안" onBack={() => navigate(-1)} rightAction={<button type="button" onClick={() => navigate('/home')} aria-label="홈으로" className="text-ink-sub"><NavHomeIc width={22} height={22} /></button>} />
        <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-4">
          <div className="mb-2 h-8 w-48 animate-pulse rounded bg-surface-muted" />
          <div className="mb-6 h-5 w-56 animate-pulse rounded bg-surface-muted" />
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[140px] animate-pulse rounded-card-lg bg-surface-muted" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isAxiosError(error) && error.response?.status === 403) {
    return <Navigate to="/paycheck-plan/assets" replace />
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col h-dvh">
        <AppBar title="월급 설계안" onBack={() => navigate(-1)} rightAction={<button type="button" onClick={() => navigate('/home')} aria-label="홈으로" className="text-ink-sub"><NavHomeIc width={22} height={22} /></button>} />
        <CenterMessage variant="alert">
          <div className="flex flex-col items-center gap-3">
            <p>설계안을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-btn border border-line px-5 py-2.5 text-body font-semibold text-ink"
            >
              다시 시도
            </button>
          </div>
        </CenterMessage>
      </div>
    )
  }

  // 구조적 부족: 여유분이 없어 추천 안이 비는 트랙
  const isStructuralShortage = data.track === 'STRUCTURAL_SHORTAGE' || data.plans.length === 0
  const plans = mapPlans(data)

  return (
    <div className="flex flex-col h-dvh">
      <AppBar title="월급 설계안" onBack={() => navigate(-1)} rightAction={<button type="button" onClick={() => navigate('/home')} aria-label="홈으로" className="text-ink-sub"><NavHomeIc width={22} height={22} /></button>} />

      {isStructuralShortage ? (
        <>
          <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-8 pb-6">
            <h2 className="text-heading font-bold text-ink mb-4">
              지금은 월급 설계안을
              <br />
              만들기 어려워요
            </h2>
            <p className="text-body text-ink-sub mb-7">
              들어오는 돈이 생활비에 거의 다 쓰여서
              <br />
              지금은 더 굴릴 여유 자금이 부족해요.
            </p>

            <InfoBox tone="primary" className="mb-7">
              목표 생활비를 줄이면 설계안을 만들 수 있어요.
              <br />
              아래 버튼에서 목표 생활비를 수정해보세요.
            </InfoBox>

            {/* 현재 상황 — 구조적 부족이어도 BE가 내려주는 baseline 숫자로 채운다 */}
            <div className="bg-surface rounded-card-lg border border-line p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sub text-ink-hint">매달 들어오는 돈</span>
                <span className="font-inter text-body font-semibold text-ink">
                  {won(data.currentMonthlyCashFlow)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sub text-ink-hint">목표 생활비</span>
                <span className="font-inter text-body font-semibold text-ink">
                  {won(data.targetMonthlyLivingCost)}
                </span>
              </div>
              <div className="mt-3 border-t border-divider pt-3 flex items-center justify-between">
                <span className="text-body font-semibold text-ink">매달 부족한 금액</span>
                <span className="font-inter text-card font-bold text-warning-text">
                  {won(data.currentMonthlyShortfall)}
                </span>
              </div>
            </div>
          </div>

          <StickyFooter>
            <Button onClick={handleGoToProfileEdit}>
              목표 생활비 수정하기
            </Button>
          </StickyFooter>
        </>
      ) : (
        <>
          <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-4">
            <h2 className="text-heading font-bold text-ink mb-1">
              {userName}님 자산으로 만든
              <br />
              설계안 {plans.length}가지예요
            </h2>
            <p className="text-body text-ink-sub mb-6">추천이 아니에요. 비교해 보고 직접 고르시면 돼요.</p>

            <div className="flex flex-col gap-3 mb-4">
              {plans.map((plan) => (
                <SalaryPlanCard
                  key={plan.planId}
                  plan={plan}
                  onClick={() => navigate(`/paycheck-plan/plans/${plan.planId}`)}
                />
              ))}
            </div>

            <InfoBox className="mb-6">
              위험도가 높을수록 월급이 출렁일 수 있어요. 생활비 부분은 안정형으로 묶여 있어 흔들리지 않아요.
            </InfoBox>
          </div>

          <StickyFooter>
            <Button onClick={() => navigate('/paycheck-plan/compare')}>
              {plans.length >= 3 ? '세 설계안 비교하기' : '두 설계안 나란히 비교하기'}
            </Button>
          </StickyFooter>
        </>
      )}
    </div>
  )
}

export default PaycheckPlansPage
