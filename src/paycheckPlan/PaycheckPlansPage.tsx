import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import InfoBox from '../common/components/InfoBox'
import SalaryPlanCard from './components/SalaryPlanCard'
import { mockPlans } from './mock/paycheckPlan'

// mockPlans: 2개 열림 케이스 (여유자금 성장형 locked)
// mockPlansUnlocked: 3개 모두 열린 케이스 — 맞춤운용등급 기반으로 추후 분기
const plans = mockPlans
const hasLockedPlan = plans.some((p) => p.status === 'locked')
const availableCount = plans.filter((p) => p.status !== 'locked').length
const userName = '김영수'

function PaycheckPlansPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full">
      <AppBar title="월급 설계안" onBack={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto px-5 pt-4">
        {hasLockedPlan ? (
          <>
            <h2 className="text-heading font-bold text-ink mb-1">
              {userName}님 자산으로 만든
              <br />
              설계안 3가지예요
            </h2>
            <p className="text-body text-ink-sub mb-6">추천이 아니에요. 비교해 보고 직접 고르시면 돼요.</p>
          </>
        ) : (
          <>
            <h2 className="text-heading font-bold text-ink mb-1">
              생활이 안정적이라
              <br />
              3가지 모두 열어드렸어요
            </h2>
            <p className="text-body text-ink-sub mb-6">여유자금 성장형까지 비교해 보세요.</p>
          </>
        )}

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
          {availableCount === 3 ? '세 설계안 비교하기' : '두 설계안 나란히 비교하기'}
        </Button>
      </div>
    </div>
  )
}

export default PaycheckPlansPage
