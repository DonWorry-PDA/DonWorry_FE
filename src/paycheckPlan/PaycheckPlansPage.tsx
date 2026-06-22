import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import InfoBox from '../common/components/InfoBox'
import SalaryPlanCard from './components/SalaryPlanCard'
import useGetRecommendation from './hooks/useGetRecommendation'
import { mapPlans } from './utils/planMapper'

// TODO: 사용자 이름은 추천 응답에 없음 — 프로필 조회 연동 시 교체
const userName = '김영수'

function CenterMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center h-full px-8 text-center text-body text-ink-hint">
      {children}
    </div>
  )
}

function PaycheckPlansPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useGetRecommendation()

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <AppBar title="월급 설계안" onBack={() => navigate(-1)} />
        <CenterMessage>설계안을 불러오고 있어요</CenterMessage>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col h-full">
        <AppBar title="월급 설계안" onBack={() => navigate(-1)} />
        <CenterMessage>설계안을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</CenterMessage>
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
        <CenterMessage>
          지금은 생활비를 메우기 위한 여유 자금이 부족해요.
          <br />
          먼저 안전자산 중심으로 지키는 운용을 추천드려요.
        </CenterMessage>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-5 pt-4">
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

          <div className="px-5 py-4 shrink-0">
            <Button onClick={() => navigate('/paycheck-plan/compare')}>
              {plans.length >= 3 ? '세 설계안 비교하기' : '두 설계안 나란히 비교하기'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default PaycheckPlansPage
