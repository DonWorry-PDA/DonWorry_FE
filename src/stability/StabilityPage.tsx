import { useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import AppBar from '../common/components/AppBar'
import { NotificationIc } from '../common/assets/icons'
import GaugeChart from './components/GaugeChart'
import useGetLifeStability from './hooks/useGetLifeStability'
import type { StabilityItem, StabilityStatus } from './types/stability'

const STATUS_LABEL: Record<StabilityStatus, string> = {
  stable: '안정적이에요',
  warning: '보완이 필요해요',
  danger: '개선이 필요해요',
}

const STATUS_CLASS: Record<StabilityStatus, string> = {
  stable: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
}

const ITEM_STATUS_LABEL: Record<StabilityStatus, string> = {
  stable: '안정',
  warning: '보완 필요',
  danger: '개선 필요',
}

const ITEM_STATUS_CLASS: Record<StabilityStatus, string> = {
  stable: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
}

function StabilityPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError, error, refetch } = useGetLifeStability()
  const isEmptyResult = isAxiosError(error) && error.response?.status === 404

  return (
    <div className="flex flex-col bg-white h-dvh">
      <AppBar
        title="생활 안정도"
        onBack={() => navigate(-1)}
        rightAction={
          <button
            type="button"
            aria-label="알림"
            className="flex size-11 items-center justify-center"
            onClick={() => navigate('/notification')}
          >
            <NotificationIc className="text-ink" width={22} height={22} />
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div role="status" aria-live="polite" className="flex flex-col items-center px-[22px] pt-6">
            <span className="sr-only">생활 안정도를 불러오는 중입니다.</span>
            <div className="mb-2 h-7 w-36 animate-pulse rounded bg-surface-muted" />
            <div className="mb-8 h-5 w-52 animate-pulse rounded bg-surface-muted" />
            <div className="mb-8 h-[120px] w-[220px] animate-pulse rounded-full bg-surface-muted" />
            <div className="flex w-full flex-col gap-[9px]">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-[58px] animate-pulse rounded-btn bg-surface-muted" />
              ))}
            </div>
          </div>
        ) : isError || !data ? (
          <StatusMessage
            text={
              isEmptyResult
                ? '아직 생활 안정도 결과가 없어요.\n자산을 연결하면 분석해 드려요.'
                : '생활 안정도를 불러오지 못했어요.'
            }
            onRetry={isEmptyResult ? undefined : () => refetch()}
          />
        ) : (
          <>
            {/* 결과 헤딩 */}
            <div className="flex flex-col items-center gap-[6px] px-[22px] pt-[6px]">
              <p className={`text-heading font-extrabold ${STATUS_CLASS[data.status]}`}>
                {STATUS_LABEL[data.status]}
              </p>
              <p className="text-sub text-ink-sub text-center leading-[1.62] whitespace-pre-line">
                {data.summaryMessage}
              </p>
            </div>

            {/* 게이지 차트 */}
            <div className="flex flex-col items-center px-[22px] pt-[6px]">
              <GaugeChart percentage={data.percentage} status={data.status} />
            </div>

            {/* 항목별 현황 */}
            <div className="px-[22px] pt-[22px] pb-[12px]">
              <p className="text-md font-bold text-ink">항목별 현황</p>
            </div>

            <div className="flex flex-col gap-[9px] px-[22px]">
              {data.items.map((item) => (
                <StabilityItemRow key={item.id} item={item} />
              ))}
            </div>

            {/* 개선 제안 (전체 메시지) */}
            {data.improvementMessages.length > 0 && (
              <>
                <div className="px-[22px] pt-[22px] pb-[12px]">
                  <p className="text-md font-bold text-ink">개선 제안</p>
                </div>
                <div className="flex flex-col gap-[9px] px-[22px]">
                  {data.improvementMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className="bg-primary-tint flex items-start gap-3 rounded-btn px-4 py-[13px]"
                    >
                      <div className="bg-white rounded-badge px-2 py-[3px] shrink-0 mt-[1px]">
                        <span className="font-inter text-caption font-extrabold text-primary">
                          TIP
                        </span>
                      </div>
                      <p className="text-caption text-primary-dark flex-1 min-w-0 leading-[1.6] whitespace-pre-line">
                        {msg}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* 추천 플랜 가드레일 */}
            {data.guardrail && (
              <>
                <div className="px-[22px] pt-[22px] pb-[12px]">
                  <p className="text-md font-bold text-ink">추천 플랜</p>
                </div>
                <div className="px-[22px]">
                  <div className="bg-surface rounded-btn px-4 py-[15px]">
                    <div className="flex items-center gap-2 pb-[6px]">
                      <p className="text-sub font-bold text-ink flex-1 min-w-0">
                        {data.guardrail.recommendedPlanLabel}
                      </p>
                      <span
                        className={`rounded-badge px-2 py-[3px] text-caption font-bold shrink-0 ${
                          data.guardrail.growthPlanAllowed
                            ? 'bg-success-bg text-success'
                            : 'bg-surface-muted text-ink-sub'
                        }`}
                      >
                        {data.guardrail.growthPlanAllowed ? '성장형 가능' : '안정 우선'}
                      </span>
                    </div>
                    <p className="text-caption text-ink-sub leading-[1.6] whitespace-pre-line">
                      {data.guardrail.reason}
                    </p>
                  </div>
                </div>
              </>
            )}

            <div className="h-6" />
          </>
        )}
      </main>
    </div>
  )
}

function StatusMessage({ text, onRetry }: { text: string; onRetry?: () => void }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-4 px-[22px] pt-[120px]"
    >
      <p className="text-body text-ink-sub text-center leading-[1.6] whitespace-pre-line">{text}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-btn border border-line px-5 py-2.5 text-body font-semibold text-ink"
        >
          다시 시도
        </button>
      )}
    </div>
  )
}

function StabilityItemRow({ item }: { item: StabilityItem }) {
  return (
    <div className="bg-surface flex items-start gap-3 rounded-btn px-4 py-[15px]">
      <div className="bg-white flex items-center justify-center rounded-icon size-[30px] shrink-0 mt-[1px]">
        <ListIcon />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sub font-semibold text-ink flex-1 min-w-0">{item.label}</p>
          <p className="text-sub font-bold text-ink shrink-0">{item.value}</p>
          <p className={`text-caption font-bold shrink-0 ${ITEM_STATUS_CLASS[item.status]}`}>
            {ITEM_STATUS_LABEL[item.status]}
          </p>
        </div>
        <p className="text-caption text-ink-hint leading-[1.5] mt-[3px]">{item.description}</p>
      </div>
    </div>
  )
}

function ListIcon() {
  return (
    <svg width="15" height="12" viewBox="0 0 15 12" fill="none" aria-hidden>
      <rect x="4" y="0.5" width="11" height="1.5" rx="0.75" fill="#8B95A1" />
      <rect x="4" y="5.25" width="11" height="1.5" rx="0.75" fill="#8B95A1" />
      <rect x="4" y="10" width="11" height="1.5" rx="0.75" fill="#8B95A1" />
      <rect x="0" y="0.5" width="2.5" height="1.5" rx="0.75" fill="#8B95A1" />
      <rect x="0" y="5.25" width="2.5" height="1.5" rx="0.75" fill="#8B95A1" />
      <rect x="0" y="10" width="2.5" height="1.5" rx="0.75" fill="#8B95A1" />
    </svg>
  )
}

export default StabilityPage
