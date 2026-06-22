import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'
import InfoBox from '../common/components/InfoBox'
import { mockAnalysis } from './mock/paycheckPlan'

function PaycheckDiagnosisPage() {
  const navigate = useNavigate()
  const { securedCashflow, breakdown, targetExpense, additionalNeededCashflow } = mockAnalysis

  return (
    <div className="flex flex-col h-full">
      <AppBar title="현금흐름 진단" onBack={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto px-5 pt-4">
        <p className="text-body text-ink-sub mb-1">지금의 월 현금흐름</p>
        <p className="font-inter text-display font-bold text-ink mb-6">
          {securedCashflow}만원
          <span className="text-body font-normal text-ink-hint ml-1">/ 월</span>
        </p>

        <div className="flex flex-col gap-0 mb-6">
          {breakdown.map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3.5 border-b border-divider">
              <span className="text-body text-ink-sub">{item.label}</span>
              {item.value !== null ? (
                <span className="font-inter text-body font-medium text-ink">{item.value}만원</span>
              ) : (
                <span className="text-body text-ink-hint">{item.valueLabel}</span>
              )}
            </div>
          ))}
          <div className="flex items-center justify-between py-3.5 border-b border-divider">
            <span className="text-body text-ink-sub">목표 생활비</span>
            <span className="font-inter text-body font-medium text-ink">{targetExpense}만원</span>
          </div>
        </div>

        <InfoBox tone="danger" className="mb-6">
          <p className="text-sub text-danger-text mb-1">매달 부족한 돈</p>
          <p className="font-inter text-display font-bold text-danger">{additionalNeededCashflow}만원</p>
        </InfoBox>
      </div>

      <StickyFooter>
        <InfoBox className="mb-4">
          <p className="text-body font-semibold text-ink mb-0.5">
            부족한 {additionalNeededCashflow}만원, 월급으로 만들어볼까요?
          </p>
          <p className="text-sub text-ink-sub">선택은 자유예요. 원하실 때 언제든 만들 수 있어요.</p>
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
