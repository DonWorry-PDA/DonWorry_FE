import { useNavigate } from 'react-router-dom'
import BottomNav from '../common/components/BottomNav'
import { NotificationIc } from '../common/assets/icons'
import AssetCard from './components/AssetCard'
import StabilityCard from './components/StabilityCard'
import useGetAssetHub from '@/asset/hooks/useGetAssetHub'
import type { AssetHubResponse, LifeStabilityGrade } from '@/asset/types/assetHub'
import type { AssetData, HomeStabilityData, ReportItem } from './types/home'
import type { StabilityStatus } from '../stability/types/stability'

// 사용자 헤더는 아직 mock(사용자 API 연동 전). 날짜만 오늘 기준으로 표시해 고정 오정보를 방지한다.
const TODAY_LABEL = new Intl.DateTimeFormat('ko-KR', { dateStyle: 'full' }).format(new Date())

const MOCK_USER = {
  name: '김영수',
  initial: '김',
  date: TODAY_LABEL,
}

// 월간 리포트(#6)는 아직 미구현이라 mock 유지
const MOCK_REPORT_MONTH = '6월'
const MOCK_REPORT: ReportItem[] = [
  { label: '배당금 변동', value: '+12.4%', valueClass: 'text-success' },
  { label: '다음 달 수입', value: '130만원' },
  { label: '소비 수준', value: '적정' },
]

const gradeToStatus = (grade: LifeStabilityGrade): StabilityStatus => {
  if (grade === 'STABLE') return 'stable'
  if (grade === 'NEED_COMPLEMENT') return 'warning'
  return 'danger'
}

const toAssetData = (hub: AssetHubResponse): AssetData => ({
  totalAmountKrw: hub.totalAsset,
  segments: hub.allocation.map((item) => ({ label: item.category, pct: item.ratio })),
  monthlyIncomeKrw: hub.monthlyIncome,
})

// 생활 안정도가 아직 산출되지 않은 사용자는 null → 카드 대신 대체 표시
const toStabilityData = (hub: AssetHubResponse): HomeStabilityData | null => {
  const lifeStability = hub.menus.lifeStability
  const salaryMaking = hub.menus.salaryMaking
  if (!lifeStability || lifeStability.grade == null) return null

  // 급여 데이터가 없으면 0원으로 위장하지 않고 카드를 표시하지 않는다(대체 표시로 폴백).
  if (!salaryMaking || salaryMaking.currentAmount == null || salaryMaking.targetAmount == null) {
    return null
  }
  const current = salaryMaking.currentAmount
  const target = salaryMaking.targetAmount
  const shortfall = target - current

  return {
    status: gradeToStatus(lifeStability.grade),
    percentage: Math.round(lifeStability.coverageRate ?? 0),
    currentIncomeKrw: current,
    targetIncomeKrw: target,
    shortfallKrw: shortfall > 0 ? shortfall : null,
  }
}

function HomePage() {
  const navigate = useNavigate()
  const { data: hub, isLoading, refetch } = useGetAssetHub()

  const asset = hub ? toAssetData(hub) : null
  const stability = hub ? toStabilityData(hub) : null

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
          onClick={() => navigate('/notification')}
        >
          <NotificationIc className="text-ink" width={22} height={22} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-6">
        {isLoading ? (
          <div className="flex flex-col gap-5 px-5 pt-1">
            <div className="h-[168px] animate-pulse rounded-card-xl bg-white shadow-card" />
            <div className="h-[108px] animate-pulse rounded-card-xl bg-white shadow-card" />
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-[72px] flex-1 animate-pulse rounded-card bg-white shadow-card" />
              ))}
            </div>
          </div>
        ) : !hub || !asset ? (
          // 캐시된 데이터가 없을 때만 에러 화면. 백그라운드 재요청 실패 시엔 기존 데이터를 그대로 보여준다.
          <StatusMessage text="자산 정보를 불러오지 못했어요." onRetry={() => refetch()} />
        ) : (
          <div className="flex flex-col gap-5 px-5">
            {/* 총 자산 */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <button className="text-body text-ink font-bold min-h-11 px-2 -ml-2" onClick={() => navigate('/asset')}>총 자산 ›</button>
                <button className="text-sub text-ink-hint min-h-11 px-2 -mr-2" onClick={() => navigate('/asset')}>분석 보기</button>
              </div>
              <button
                className="w-full text-left"
                onClick={() => navigate('/asset')}
                aria-label="자산분석 페이지로 이동"
              >
                <AssetCard
                  totalAmountKrw={asset.totalAmountKrw}
                  segments={asset.segments}
                  monthlyIncomeKrw={asset.monthlyIncomeKrw}
                />
              </button>
            </section>

            {/* 생활 안정도 */}
            {stability ? (
              <StabilityCard data={stability} />
            ) : (
              <button
                onClick={() => navigate('/stability')}
                className="w-full bg-white rounded-card-xl shadow-card p-5 text-left flex flex-col gap-[7px]"
              >
                <span className="text-card font-bold text-ink">생활 안정도</span>
                <p className="text-sub text-ink-sub leading-[1.62]">
                  아직 생활 안정도 결과가 없어요. 자산을 연결하면 분석해 드려요.
                </p>
              </button>
            )}

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
        )}
      </main>

      <BottomNav />
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

export default HomePage
