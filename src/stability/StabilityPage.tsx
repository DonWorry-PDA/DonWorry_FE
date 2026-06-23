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
          <StatusMessage text="생활 안정도를 불러오는 중이에요…" />
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

            {/* TIP 박스 */}
            {data.tip && (
              <div className="px-[22px] pt-4 pb-6">
                <div className="bg-primary-tint flex items-center gap-3 rounded-btn px-4 py-[15px]">
                  <div className="bg-white rounded-badge px-2 py-[3px] shrink-0">
                    <span className="font-inter text-caption font-extrabold text-primary">TIP</span>
                  </div>
                  <p className="text-caption text-primary-dark flex-1 min-w-0 leading-[1.6] whitespace-pre-line">
                    {data.tip}
                  </p>
                </div>
              </div>
            )}
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
    <div className="bg-surface flex items-center gap-3 rounded-btn px-4 py-[15px]">
      <div className="bg-white flex items-center justify-center rounded-icon size-[30px] shrink-0">
        <ListIcon />
      </div>
      <p className="text-sub font-semibold text-ink flex-1 min-w-0">{item.label}</p>
      <p className={`text-sub font-bold shrink-0 ${ITEM_STATUS_CLASS[item.status]}`}>
        {ITEM_STATUS_LABEL[item.status]} ›
      </p>
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
