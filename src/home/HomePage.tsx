import { useNavigate } from 'react-router-dom'
import BottomNav from '../common/components/BottomNav'
import { NotificationIc } from '../common/assets/icons'
import AssetCard from './components/AssetCard'
import StabilityCard from './components/StabilityCard'
import useGetAssetHub from '@/asset/hooks/useGetAssetHub'
import useGetProfile from '@/mypage/hooks/useGetProfile'
import useGetMonthlyReport from '@/asset/hooks/useGetMonthlyReport'
import type { AssetHubResponse, LifeStabilityGrade } from '@/asset/types/assetHub'
import type { AssetData, HomeStabilityData, ReportItem } from './types/home'
import type { StabilityStatus } from '../stability/types/stability'

function currentYearMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

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

function toMan(val: number) {
  return Math.round(val / 10_000).toLocaleString('ko-KR')
}

function HomePage() {
  const navigate = useNavigate()
  const { data: hub, isLoading, refetch } = useGetAssetHub()
  const { data: profile } = useGetProfile()
  const thisMonth = currentYearMonth()
  const { data: report } = useGetMonthlyReport(thisMonth)

  const asset = hub ? toAssetData(hub) : null
  const stability = hub ? toStabilityData(hub) : null

  const reportMonth = report
    ? `${parseInt(report.month.split('-')[1])}월`
    : `${new Date().getMonth() + 1}월`

  const reportItems: ReportItem[] = report
    ? [
        {
          label: '자산 변화',
          value:
            report.assetChange.changeAmount !== null
              ? `${report.assetChange.changeAmount >= 0 ? '+' : ''}${toMan(report.assetChange.changeAmount)}만원`
              : '-',
          valueClass:
            report.assetChange.changeAmount !== null
              ? report.assetChange.changeAmount >= 0
                ? 'text-success'
                : 'text-danger'
              : undefined,
        },
        {
          label: '이번 달 지출',
          value: `${toMan(report.spending.expenseAmount)}만원`,
        },
        {
          label: '다음 달 수입',
          value: `${toMan(report.nextMonthPreview.incomingTotal)}만원`,
        },
      ]
    : []

  return (
    <div className="flex h-dvh flex-col bg-white">
      {/* User header */}
      <header className="flex h-[52px] items-center pl-6 pr-[14px]">
        <img src="/logos/sol-mark.svg" alt="SOL" width={36} height={36} className="mr-3 shrink-0" />
        <div className="flex-1 min-w-0">
          {profile ? (
            <p className="text-heading font-bold text-ink">{profile.name}님</p>
          ) : (
            <div className="h-5 w-20 animate-pulse rounded bg-surface-muted" />
          )}
        </div>
        <button
          aria-label="알림"
          className="flex size-11 items-center justify-center"
          onClick={() => navigate('/notification')}
        >
          <NotificationIc className="text-ink" width={22} height={22} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pt-4 pb-6">
        {isLoading ? (
          <div role="status" aria-live="polite" className="flex flex-col gap-5 px-5 pt-1">
            <span className="sr-only">홈 화면 정보를 불러오는 중입니다.</span>
            <div className="h-[168px] animate-pulse rounded-card-xl border border-line bg-surface-muted" />
            <div className="h-[108px] animate-pulse rounded-card-xl border border-line bg-surface-muted" />
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-[72px] flex-1 animate-pulse rounded-card border border-line bg-surface-muted" />
              ))}
            </div>
          </div>
        ) : !hub || !asset ? (
          // 캐시된 데이터가 없을 때만 에러 화면. 백그라운드 재요청 실패 시엔 기존 데이터를 그대로 보여준다.
          <StatusMessage text="자산 정보를 불러오지 못했어요." onRetry={() => refetch()} />
        ) : (
          <div className="flex flex-col gap-5 px-6">
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
                className="w-full bg-white rounded-card-xl border border-line p-5 text-left flex flex-col gap-[7px]"
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
                <button
                  className="text-body text-ink font-bold min-h-11 -ml-2 px-2"
                  onClick={() => navigate('/asset-management/monthly-report')}
                >
                  {reportMonth} 리포트 ›
                </button>
                <button
                  className="text-sub text-ink-hint min-h-11 -mr-2 px-2"
                  onClick={() => navigate('/asset-management/monthly-report')}
                >
                  전체보기
                </button>
              </div>
              <div className="rounded-card-lg border border-line bg-white px-3 py-[9px]">
                {reportItems.length > 0 ? (
                  <div className="flex gap-2">
                    {reportItems.map(({ label, value, valueClass }) => (
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
                ) : (
                  <div className="flex gap-2">
                    {['자산 변화', '이번 달 지출', '다음 달 수입'].map((label) => (
                      <div
                        key={label}
                        className="border-line rounded-card flex flex-1 flex-col gap-[3px] border px-3 py-[13px]"
                      >
                        <p className="text-caption text-ink-hint">{label}</p>
                        <div className="mt-1 h-4 w-10 animate-pulse rounded bg-surface-muted" />
                      </div>
                    ))}
                  </div>
                )}
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
