import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import AppBar from '../common/components/AppBar'
import BottomSheet from '../common/components/BottomSheet'
import { BackArrowIc, NotificationIc } from '../common/assets/icons'
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

  // 지표 행 탭 → 세부 정보 시트. 닫힘 애니메이션(약 300ms) 동안 내용이 먼저
  // 사라지지 않도록 열림 여부(sheetOpen)와 표시 항목(selectedItem)을 분리한다.
  const [selectedItem, setSelectedItem] = useState<StabilityItem | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const openItemDetail = (item: StabilityItem) => {
    setSelectedItem(item)
    setSheetOpen(true)
  }

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
            <NotificationIc className="text-ink" width={24} height={24} />
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
                <StabilityItemRow key={item.id} item={item} onSelect={openItemDetail} />
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

            <div className="h-6" />
          </>
        )}
      </main>

      {/* 지표 세부 정보 시트 */}
      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        {selectedItem && <StabilityItemDetail item={selectedItem} />}
      </BottomSheet>
    </div>
  )
}

function StabilityItemDetail({ item }: { item: StabilityItem }) {
  return (
    <div className="px-6 pb-9 pt-1">
      <div className="flex items-center gap-2 pb-[14px]">
        <h2 className="text-card font-bold text-ink flex-1 min-w-0">{item.label}</h2>
        <span className={`text-md font-bold shrink-0 ${ITEM_STATUS_CLASS[item.status]}`}>
          {ITEM_STATUS_LABEL[item.status]}
        </span>
      </div>

      <div className="bg-surface rounded-btn flex items-baseline justify-between px-4 py-[14px]">
        <span className="text-sub text-ink-sub">현재 값</span>
        <span className="text-heading font-extrabold text-ink">{item.value}</span>
      </div>

      <div className="pt-[18px]">
        <p className="text-sub font-bold text-ink pb-[6px]">어떤 지표예요?</p>
        <p className="text-sub text-ink-sub leading-[1.62]">{item.meaning}</p>
      </div>

      <div className="pt-[16px]">
        <p className="text-sub font-bold text-ink pb-[6px]">권장 기준</p>
        <p className="text-sub text-ink-sub leading-[1.62]">{item.criteria}</p>
      </div>

      {item.status !== 'stable' && (
        <div className="bg-primary-tint rounded-btn flex items-start gap-3 px-4 py-[14px] mt-[18px]">
          <div className="bg-white rounded-badge px-2 py-[3px] shrink-0 mt-[1px]">
            <span className="font-inter text-caption font-extrabold text-primary">TIP</span>
          </div>
          <p className="text-caption text-primary-dark flex-1 min-w-0 leading-[1.6]">
            {item.improve}
          </p>
        </div>
      )}
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

function StabilityItemRow({
  item,
  onSelect,
}: {
  item: StabilityItem
  onSelect: (item: StabilityItem) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      aria-label={`${item.label} 세부 정보 보기`}
      className="bg-surface flex w-full items-center gap-3 rounded-btn px-4 py-[15px] text-left"
    >
      <div className="bg-white flex items-center justify-center rounded-icon size-[30px] shrink-0">
        <ListIcon />
      </div>
      <p className="text-sub font-semibold text-ink flex-1 min-w-0">{item.label}</p>
      <p className="text-sub font-bold text-ink shrink-0">{item.value}</p>
      <p className={`text-caption font-bold shrink-0 ${ITEM_STATUS_CLASS[item.status]}`}>
        {ITEM_STATUS_LABEL[item.status]}
      </p>
      <BackArrowIc width={13} height={13} className="rotate-180 text-disabled shrink-0" />
    </button>
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
