import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'
import InfoBox from '../common/components/InfoBox'
import useGetCashFlowDiagnosis from './hooks/useGetCashFlowDiagnosis'

const toMan = (won: number) => Math.round(won / 10_000)
const formatShortfall = (won: number) => {
  const man = toMan(won)
  return man < 1 ? '1만원 미만' : `${man}만원`
}

function PaycheckDiagnosisPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useGetCashFlowDiagnosis()

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <AppBar title="현금흐름 진단" onBack={() => navigate(-1)} />
        <div className="flex-1 overflow-y-auto px-5 pt-4">
          <div className="mb-2 h-5 w-28 animate-pulse rounded bg-surface-muted" />
          <div className="mb-6 h-10 w-36 animate-pulse rounded bg-surface-muted" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[52px] animate-pulse border-b border-divider bg-surface-muted" />
          ))}
          <div className="mt-6 h-[80px] animate-pulse rounded-btn bg-surface-muted" />
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col h-full">
        <AppBar title="현금흐름 진단" onBack={() => navigate(-1)} />
        <p className="text-body text-danger text-center pt-20">데이터를 불러오지 못했어요.</p>
      </div>
    )
  }

  const monthlyCashFlowMan = toMan(data.monthlyCashFlow)
  const nationalPensionMan = toMan(data.nationalPension)
  const dividendIncomeMan = toMan(data.dividendIncome)
  const targetMan = toMan(data.targetMonthlyLivingCost)
  const shortfallLabel = formatShortfall(data.monthlyShortfall)

  return (
    <div className="flex flex-col h-full">
      <AppBar title="현금흐름 진단" onBack={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto px-5 pt-4">
        <p className="text-body text-ink-sub mb-1">지금의 월 현금흐름</p>
        <p className="font-inter text-display font-bold text-ink mb-6">
          {monthlyCashFlowMan}만원
          <span className="text-body font-normal text-ink-hint ml-1">/ 월</span>
        </p>

        <div className="flex flex-col gap-0 mb-6">
          <div className="flex items-center justify-between py-3.5 border-b border-divider">
            <span className="text-body text-ink-sub">국민연금</span>
            <span className="font-inter text-body font-medium text-ink">{nationalPensionMan}만원</span>
          </div>
          <div className="flex items-center justify-between py-3.5 border-b border-divider">
            <span className="text-body text-ink-sub">배당 ETF 분배금</span>
            <span className="font-inter text-body font-medium text-ink">{dividendIncomeMan}만원</span>
          </div>
          <div className="flex items-center justify-between py-3.5 border-b border-divider">
            <span className="text-body text-ink-sub">목표 생활비</span>
            <span className="font-inter text-body font-medium text-ink">{targetMan}만원</span>
          </div>
        </div>

        {data.shortfallExists ? (
          <InfoBox tone="danger" className="mb-6">
            <p className="text-sub text-danger-text mb-1">매달 부족한 돈</p>
            <p className="font-inter text-display font-bold text-danger">{shortfallLabel}</p>
          </InfoBox>
        ) : (
          <InfoBox tone="success" className="mb-6">
            <p className="text-sub mb-1">현재 현금흐름으로</p>
            <p className="font-inter text-display font-bold">생활비가 충당돼요</p>
          </InfoBox>
        )}
      </div>

      <StickyFooter>
        <InfoBox className="mb-4">
          {data.shortfallExists ? (
            <>
              <p className="text-body font-semibold text-ink mb-0.5">
                부족한 {shortfallLabel}, 월급으로 만들어볼까요?
              </p>
              <p className="text-sub text-ink-sub">선택은 자유예요. 원하실 때 언제든 만들 수 있어요.</p>
            </>
          ) : (
            <>
              <p className="text-body font-semibold text-ink mb-0.5">
                월급 설계안도 한번 살펴볼까요?
              </p>
              <p className="text-sub text-ink-sub">더 여유로운 노후를 위한 플랜을 보여드려요.</p>
            </>
          )}
        </InfoBox>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            아니요,
            <br />
            안정도부터
          </Button>
          <Button onClick={() => navigate('/paycheck-plan/plans')}>
            네,
            <br />
            설계안 보기
          </Button>
        </div>
      </StickyFooter>
    </div>
  )
}

export default PaycheckDiagnosisPage
