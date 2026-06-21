import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import { NotificationIc } from '../common/assets/icons'
import GaugeChart from './components/GaugeChart'
import type { StabilityData, StabilityItem, StabilityStatus } from './types/stability'

const MOCK_DATA: StabilityData = {
  percentage: 59,
  status: 'warning',
  monthlyShortfallKrw: 900_000,
  items: [
    { id: 1, label: '생활비 충당률', status: 'warning' },
    { id: 2, label: '의료비 대비력', status: 'warning' },
    { id: 3, label: '유동성·비상금', status: 'stable' },
    { id: 4, label: '부채 부담률', status: 'stable' },
    { id: 5, label: '위험자산 의존도', status: 'stable' },
  ],
}

const STATUS_LABEL: Record<StabilityStatus, string> = {
  stable: '안정이에요',
  warning: '보완이 필요해요',
  danger: '위험해요',
}

const STATUS_CLASS: Record<StabilityStatus, string> = {
  stable: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
}

const ITEM_STATUS_LABEL: Record<StabilityStatus, string> = {
  stable: '안정',
  warning: '주의',
  danger: '위험',
}

const ITEM_STATUS_CLASS: Record<StabilityStatus, string> = {
  stable: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
}

function StabilityPage() {
  const navigate = useNavigate()
  const { percentage, status, monthlyShortfallKrw, items } = MOCK_DATA

  const shortfallMan = monthlyShortfallKrw
    ? Math.round(monthlyShortfallKrw / 10_000)
    : null

  return (
    <div className="flex flex-col bg-white h-dvh">
      <AppBar
        title="생활 안정도"
        onBack={() => navigate(-1)}
        rightAction={
          <button aria-label="알림">
            <NotificationIc className="text-ink" width={22} height={22} />
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto">
        {/* 결과 헤딩 */}
        <div className="flex flex-col items-center gap-[6px] px-[22px] pt-[6px]">
          <p className={`text-heading font-extrabold ${STATUS_CLASS[status]}`}>
            {STATUS_LABEL[status]}
          </p>
          <div className="text-sub text-ink-sub text-center leading-[1.62]">
            <p>
              목표 생활비의{' '}
              <span className="font-bold text-ink">{percentage}%</span>를 충당하고 있어요.
            </p>
            {shortfallMan !== null && status !== 'stable' && (
              <p>
                매달{' '}
                <span className={`font-bold ${STATUS_CLASS[status]}`}>
                  {shortfallMan.toLocaleString('ko-KR')}만원이 부족
                </span>
                해요.
              </p>
            )}
          </div>
        </div>

        {/* 게이지 차트 */}
        <div className="flex flex-col items-center px-[22px] pt-[6px]">
          <GaugeChart percentage={percentage} status={status} />
        </div>

        {/* 항목별 현황 */}
        <div className="px-[22px] pt-[22px] pb-[12px]">
          <p className="text-md font-bold text-ink">항목별 현황</p>
        </div>

        <div className="flex flex-col gap-[9px] px-[22px]">
          {items.map((item) => (
            <StabilityItemRow key={item.id} item={item} />
          ))}
        </div>

        {/* TIP 박스 */}
        {shortfallMan !== null && status !== 'stable' && (
          <div className="px-[22px] pt-4 pb-6">
            <div className="bg-primary-tint flex items-center gap-3 rounded-btn px-4 py-[15px]">
              <div className="bg-white rounded-badge px-2 py-[3px] shrink-0">
                <span className="font-inter text-caption font-extrabold text-primary">TIP</span>
              </div>
              <p className="text-caption text-primary flex-1 min-w-0 leading-[1.6]">
                월급 만들기로 부족한 {shortfallMan.toLocaleString('ko-KR')}만원을 채우면
                <br />
                '안정' 단계로 올라갈 수 있어요.
              </p>
              <span className="text-primary text-md shrink-0">›</span>
            </div>
          </div>
        )}
      </main>
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
