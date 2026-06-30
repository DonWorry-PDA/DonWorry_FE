import Badge from '../../common/components/Badge'
import type { Plan } from '../types/paycheckPlan'

type SalaryPlanCardProps = {
  plan: Plan
  onClick?: () => void
}

const RISK_DOT_COLOR: Record<1 | 2 | 3, string> = {
  1: 'bg-success',
  2: 'bg-warning',
  3: 'bg-danger',
}

function RiskDots({ score }: { score: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-1" aria-label={`위험도 ${score}/3`}>
      {([1, 2, 3] as const).map((n) => (
        <span
          key={n}
          className={`block size-2 rounded-full ${n <= score ? RISK_DOT_COLOR[score] : 'bg-line'}`}
        />
      ))}
    </div>
  )
}

function SalaryPlanCard({ plan, onClick }: SalaryPlanCardProps) {
  const isLocked = plan.status === 'locked'
  const isSelected = plan.status === 'selected' || plan.status === 'recommended'

  return (
    <button
      onClick={isLocked ? undefined : onClick}
      disabled={isLocked}
      className={`w-full text-left rounded-card-lg p-4 border transition-colors ${
        isLocked
          ? 'bg-surface border-line opacity-60 cursor-default'
          : 'bg-white border-line'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-card font-bold ${isLocked ? 'text-ink-sub' : 'text-ink'}`}>{plan.name}</span>
        {plan.badge && !isLocked && (
          <Badge tone={plan.status === 'recommended' ? 'primary' : 'muted'}>{plan.badge}</Badge>
        )}
        {isLocked && plan.lockedReason && <Badge tone="warning">{plan.lockedReason}</Badge>}
      </div>

      {plan.tagline && <p className="text-sub text-ink-sub mb-3">{plan.tagline}</p>}

      {isLocked ? (
        <p className="text-sub text-ink-hint">
          생활 안정도가 '보완 필요' 단계예요. 생활비 목적 자금은 지키고, 여유자금이 생기면 열어드릴게요.
        </p>
      ) : (
        <div className="flex gap-4 mt-2">
          <div>
            <p className="text-sub text-ink-hint mb-0.5">늘어나는 월급</p>
            {plan.incrementalIncome > 0 ? (
              <p className="font-inter text-md font-bold text-primary">+{plan.incrementalIncome}만원</p>
            ) : (
              <p className="text-md font-bold text-ink-sub">안정·상속형</p>
            )}
          </div>
          <div>
            <p className="text-sub text-ink-hint mb-0.5">충당</p>
            <p className="font-inter text-md font-bold text-ink">
              {plan.coverage === null ? '충분' : `${plan.coverage}%`}
            </p>
          </div>
          <div>
            <p className="text-sub text-ink-hint mb-0.5">위험도</p>
            <RiskDots score={plan.riskScore} />
            {plan.riskDesc && (
              <p className="text-caption text-ink-hint mt-0.5">{plan.riskDesc}</p>
            )}
          </div>
        </div>
      )}
    </button>
  )
}

export default SalaryPlanCard
