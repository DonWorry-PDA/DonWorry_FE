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
      className="w-full bg-white rounded-card-xl shadow-card p-5 text-left flex flex-col gap-[7px]"
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-card font-bold text-ink">생활 안정도</span>
        <span className={`text-sub font-bold px-3 py-[5px] rounded-badge ${BADGE_CLASS[status]}`}>
          {BADGE_LABEL[status]}
        </span>
      </div>

      {/* Face + description */}
      <div className="flex items-center gap-[14px] pt-[7px] pb-[9px]">
        <StabilityFace status={status} size={48} />
        <div className="text-sub text-ink-sub leading-[1.62] flex-1 min-w-0">
          {status === 'stable' ? (
            <>
              <p>
                지금 수입만으로{' '}
                <span className="font-bold text-ink">생활비를 충당</span>
                할 수 있어요.
              </p>
              <p>여유자금은 더 키워볼 수 있어요.</p>
            </>
          ) : status === 'warning' ? (
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
          ) : (
            <>
              <p>
                목표 생활비의{' '}
                <span className="font-bold text-ink">{percentage}%</span>만 충당돼요.
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

      {/* Progress bar */}
      <div className="h-[9px] rounded-full bg-track overflow-hidden">
        <div
          className={`h-full rounded-full ${BAR_CLASS[status]}`}
          style={{ width: `${barPct}%` }}
        />
      </div>

      {/* Income labels */}
      <div className="flex items-center justify-between">
        <span className="text-caption text-ink-hint">
          현재 수입 {currentMan.toLocaleString('ko-KR')}만원
        </span>
        <span className="text-caption text-ink-hint">
          목표 {targetMan.toLocaleString('ko-KR')}만원
        </span>
      </div>
    </button>
  )
}

export default StabilityCard
