import { useNavigate } from 'react-router-dom'
import type { HomeStabilityData } from '../types/home'
import StabilityFace from './StabilityFace'
import type { StabilityStatus } from '../../stability/types/stability'

const BADGE_CLASS: Record<StabilityStatus, string> = {
  stable: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  danger: 'bg-danger-bg text-danger',
}

const BADGE_LABEL: Record<StabilityStatus, string> = {
  stable: '안정',
  warning: '보완 필요',
  danger: '개선 필요',
}

const STATUS_CLASS: Record<StabilityStatus, string> = {
  stable: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
}

const BAR_CLASS: Record<StabilityStatus, string> = {
  stable: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
}

function StabilityCard({ data }: { data: HomeStabilityData }) {
  const navigate = useNavigate()
  const { status, percentage, currentIncomeKrw, targetIncomeKrw, shortfallKrw } = data

  const currentMan = Math.round(currentIncomeKrw / 10_000)
  const targetMan = Math.round(targetIncomeKrw / 10_000)
  const shortfallMan = shortfallKrw ? Math.round(shortfallKrw / 10_000) : null
  const barPct = Math.min(percentage, 100)

  return (
    <button
      onClick={() => navigate('/stability')}
      className="w-full bg-white rounded-card-xl shadow-card px-5 py-[22px] text-left flex flex-col gap-[18px]"
    >
      {/* Top: face + description */}
      <div className="flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <span className="text-card font-semibold text-ink">생활 안정도</span>
          <span className={`text-sub font-bold px-[11px] py-1 rounded-badge ${BADGE_CLASS[status]}`}>
            {BADGE_LABEL[status]}
          </span>
        </div>
        {/* Face + description */}
        <div className="flex items-center gap-[14px]">
          <StabilityFace status={status} size={40} />
          <div className="text-sub text-ink-sub leading-[1.62] flex-1 min-w-0">
            {status === 'stable' ? (
              <p>목표 생활비를 넘겼어요</p>
            ) : (
              <>
                <p>
                  목표 생활비의{' '}
                  <span className="font-bold text-ink">{percentage}%</span>를 충당하고 있어요.
                </p>
                {shortfallMan !== null && (
                  <p>
                    매달{' '}
                    <span className={`font-bold ${STATUS_CLASS[status]}`}>
                      {shortfallMan.toLocaleString('ko-KR')}만원이 부족
                    </span>
                    해요.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom: progress */}
      <div className="border-t border-divider pt-[19px] flex flex-col gap-[7px]">
        <div className="flex items-baseline justify-between">
          <span className="text-sub font-semibold text-ink">목표 월급 달성률</span>
          <span className={`font-inter text-display font-bold ${STATUS_CLASS[status]}`}>
            {percentage}%
          </span>
        </div>
        <div className="h-3 rounded-full bg-track overflow-hidden">
          <div
            className={`h-full rounded-full ${BAR_CLASS[status]}`}
            style={{ width: `${barPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-caption text-ink-hint">
            현재 수입 {currentMan.toLocaleString('ko-KR')}만원
          </span>
          <span className="text-caption text-ink-hint">
            목표 {targetMan.toLocaleString('ko-KR')}만원
          </span>
        </div>
      </div>
    </button>
  )
}

export default StabilityCard
