import { useNavigate } from 'react-router-dom'
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
  const { data, isLoading, isError } = useGetRecommendation()

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <AppBar title="월급 설계안" onBack={() => navigate(-1)} />
        <div className="flex-1 overflow-y-auto px-6 pt-4">
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

  if (isError || !data) {
    return (
      <div className="flex flex-col h-full">
        <AppBar title="월급 설계안" onBack={() => navigate(-1)} />
        <CenterMessage variant="alert">설계안을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</CenterMessage>
      </div>
    )
  }

  // 구조적 부족: 여유분이 없어 추천 안이 비는 트랙
  const isStructuralShortage = data.track === 'STRUCTURAL_SHORTAGE' || data.plans.length === 0
  const plans = mapPlans(data)

  return (
    <div className="flex flex-col h-full">
      <AppBar title="월급 설계안" onBack={() => navigate(-1)} />

      {isStructuralShortage ? (
        <>
          <div className="flex-1 overflow-y-auto px-6 pt-4">
            <h2 className="text-heading font-bold text-ink mb-2">
              지금은 월급 설계안을
              <br />
              만들기 어려워요
            </h2>
            <p className="text-body text-ink-sub mb-6">
              들어오는 돈이 생활비에 거의 다 쓰여서
              <br />
              지금은 더 굴릴 여유 자금이 부족해요.
            </p>

            {/* 현재 상황 — 구조적 부족이어도 BE가 내려주는 baseline 숫자로 채운다 */}
            <div className="bg-surface rounded-card-lg border border-line p-5 mb-4">
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

            {/* 산출 근거 — surplus = (총자산−연금저축) − 바닥자산, 바닥자산 = (필수생활비−국민연금)×남은 평생.
                FE엔 금액이 안 내려와 정성 설명만. 상황 카드와 통일감 위해 동일 카드 스타일. */}
            <div className="bg-surface rounded-card-lg border border-line p-5 mb-6">
              <p className="text-body font-semibold text-ink mb-1.5">왜 여유 자금이 부족한가요?</p>
              <p className="text-sub text-ink-sub leading-relaxed">
                꼭 필요한 생활비 중 국민연금으로 채워지지 않는 부분을, 앞으로 살아갈 기간 내내 메우려면 지금
                가진 자산이 거의 다 필요해요. 그래서 더 굴려서 월급을 만들 여유가 남지 않아요.
              </p>
            </div>

            <InfoBox className="mb-6">
              여유가 생기면 그때 월급 만들기를 다시 추천드릴게요. 지금은 안전자산 중심으로 지키는 운용이 우선이에요.
            </InfoBox>
          </div>

          <StickyFooter>
            <Button onClick={() => navigate('/paycheck-plan/consult')}>전문가와 같이 보기</Button>
          </StickyFooter>
        </>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-6 pt-4">
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
