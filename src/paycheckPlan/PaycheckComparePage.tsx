import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import Badge from '../common/components/Badge'
import InfoBox from '../common/components/InfoBox'
import { mockComparisonTable } from './mock/paycheckPlan'

const toneMap = {
  success: 'success' as const,
  warning: 'warning' as const,
  default: undefined,
}

function PaycheckComparePage() {
  const navigate = useNavigate()
  const { leftPlanName, rightPlanName, rows, notice } = mockComparisonTable

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
            <div className="flex justify-center">
              {row.isBadge ? (
                <Badge tone={toneMap[row.leftTone ?? 'default'] ?? 'muted'}>{row.left}</Badge>
              ) : (
                <p className="text-body font-semibold text-ink text-center">{row.left}</p>
              )}
            </div>
            <div className="flex justify-center">
              {row.isBadge ? (
                <Badge tone={toneMap[row.rightTone ?? 'default'] ?? 'muted'}>{row.right}</Badge>
              ) : (
                <p className="text-body font-semibold text-ink text-center">{row.right}</p>
              )}
            </div>
          </div>
        ))}

        <InfoBox className="mt-4 mb-6">{notice}</InfoBox>
      </div>

      <div className="px-5 py-4 shrink-0 flex gap-3">
        <Button variant="outline" onClick={() => navigate('/paycheck-plan/plans/stable')}>
          {leftPlanName} 보기
        </Button>
        <Button onClick={() => navigate('/paycheck-plan/plans/balanced')}>
          {rightPlanName} 보기
        </Button>
      </div>
    </div>
  )
}

export default PaycheckComparePage
