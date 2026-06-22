import BottomNav from '../common/components/BottomNav'
import { NotificationIc } from '../common/assets/icons'
import AssetCard from './components/AssetCard'
import StabilityCard from './components/StabilityCard'
import type { AssetData, HomeStabilityData, ReportItem } from './types/home'

const MOCK_USER = {
  name: '김영수',
  initial: '김',
  date: '2026년 6월 12일 금요일',
}

const MOCK_ASSET: AssetData = {
  totalAmountKrw: 250_000_000,
  segments: [
    { label: '연금', pct: 60 },
    { label: '증권', pct: 20 },
    { label: '예금', pct: 20 },
  ],
  monthlyIncomeKrw: 1_300_000,
}

const MOCK_STABILITY: HomeStabilityData = {
  status: 'stable',
  percentage: 112,
  currentIncomeKrw: 2_470_000,
  targetIncomeKrw: 2_200_000,
  shortfallKrw: null,
}

// const MOCK_STABILITY: HomeStabilityData = {
//   status: 'warning',
//   percentage: 59,
//   currentIncomeKrw: 1_300_000,
//   targetIncomeKrw: 2_200_000,
//   shortfallKrw: 900_000,
// }

// const MOCK_STABILITY: HomeStabilityData = {
//   status: 'danger',
//   percentage: 32,
//   currentIncomeKrw: 700_000,
//   targetIncomeKrw: 2_200_000,
//   shortfallKrw: 1_500_000,
// }

const MOCK_REPORT_MONTH = '6월'

const MOCK_REPORT: ReportItem[] = [
  { label: '배당금 변동', value: '+12.4%', valueClass: 'text-success' },
  { label: '다음 달 수입', value: '130만원' },
  { label: '소비 수준', value: '적정' },
]

function HomePage() {
  return (
    <div className="bg-page flex h-dvh flex-col">
      {/* User header */}
      <header className="flex shrink-0 items-center gap-[11px] px-5 pt-[10px] pb-[14px]">
        <div className="bg-primary flex size-[42px] shrink-0 items-center justify-center rounded-full">
          <span className="text-btn font-bold text-white">{MOCK_USER.initial}</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-md text-ink font-bold">{MOCK_USER.name}님</p>
          <p className="text-caption text-ink-hint">{MOCK_USER.date}</p>
        </div>
        <button
          aria-label="알림"
          className="-mr-[11px] flex size-11 shrink-0 items-center justify-center"
        >
          <NotificationIc className="text-ink" width={22} height={22} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-6">
        <div className="flex flex-col gap-5 px-5">
          {/* 총 자산 */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-body text-ink font-bold">총 자산 ›</span>
              <span className="text-sub text-ink-hint">분석 보기</span>
            </div>
            <AssetCard
              totalAmountKrw={MOCK_ASSET.totalAmountKrw}
              segments={MOCK_ASSET.segments}
              monthlyIncomeKrw={MOCK_ASSET.monthlyIncomeKrw}
            />
          </section>

          {/* 생활 안정도 */}
          <StabilityCard data={MOCK_STABILITY} />

          {/* 리포트 */}
          <section className="pb-2">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-body text-ink font-bold">{MOCK_REPORT_MONTH} 리포트 ›</span>
              <span className="text-sub text-ink-hint">전체보기</span>
            </div>
            <div className="rounded-card-lg shadow-card bg-white px-3 py-[9px]">
              <div className="flex gap-2">
                {MOCK_REPORT.map(({ label, value, valueClass }) => (
                  <div
                    key={label}
                    className="border-line rounded-card flex flex-1 flex-col gap-[3px] border px-3 py-[13px]"
                  >
                    <p className="text-caption text-ink-hint">{label}</p>
                    <p className={`text-md text-ink pt-0.5 font-bold ${valueClass ?? ''}`}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

export default HomePage
