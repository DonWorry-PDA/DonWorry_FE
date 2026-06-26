import { useNavigate } from 'react-router-dom'
import BottomNav from '../common/components/BottomNav'
import { NotificationIc } from '../common/assets/icons'
import AssetCard from './components/AssetCard'
import StabilityCard from './components/StabilityCard'
import useGetAssetHub from '@/asset/hooks/useGetAssetHub'
import useGetProfile from '@/mypage/hooks/useGetProfile'
import type { AssetHubResponse, LifeStabilityGrade } from '@/asset/types/assetHub'
import type { AssetData, HomeStabilityData, ReportItem } from './types/home'
import type { StabilityStatus } from '../stability/types/stability'
import ManageMenuCard from '@/asset/components/ManageMenuCard'
import type { ManageMenu } from '@/asset/types/asset'

const gradeToStatus = (grade: LifeStabilityGrade): StabilityStatus => {
  if (grade === 'STABLE') return 'stable'
  if (grade === 'NEED_COMPLEMENT') return 'warning'
  return 'danger'
}

const MENU_BASE: ManageMenu[] = [
  {
    key: 'salaryMaking',
    title: '월급 만들기',
    caption: '목표 대비 현재 현금흐름',
    path: '/paycheck-plan/assets',
    iconTone: 'primary',
    highlighted: true,
  },
  {
    key: 'lifeStability',
    title: '생활 안정도',
    caption: '생활비 충당률',
    path: '/stability',
    iconTone: 'muted',
  },
  {
    key: 'investmentCheck',
    title: '투자 건강검진',
    caption: '월급 만드는 자산\n32%뿐이에요',
    path: '/asset/investment-checkup',
    iconTone: 'muted',
  },
  {
    key: 'pensionDefer',
    title: '국민연금 연기',
    caption: '5년 미루면\n평생 +43만원',
    path: '/pension/defer',
    iconTone: 'muted',
  },
  {
    key: 'retirementSim',
    title: '은퇴 시뮬레이션',
    caption: '조건 바꿔\n미리 보기',
    path: '/retirement-simulation',
    iconTone: 'muted',
  },
  {
    key: 'monthlyReport',
    title: '월간 리포트',
    caption: '6월 리포트가\n도착했어요',
    path: '/asset/monthly-report',
    iconTone: 'muted',
    isNew: true,
  },
]

const STATUS_TEXT: Record<StabilityStatus, string> = {
  stable: '안정',
  warning: '주의',
  danger: '위험',
}

const STATUS_ICON_TONE: Record<StabilityStatus, ManageMenu['iconTone']> = {
  stable: 'muted',
  warning: 'warning',
  danger: 'warning',
}

const toMan = (krw: number) => Math.round(krw / 10_000).toLocaleString('ko-KR')

const buildMenus = (hub: AssetHubResponse): ManageMenu[] =>
  MENU_BASE.map((menu) => {
    if (menu.key === 'salaryMaking') {
      const salaryMaking = hub.menus.salaryMaking
      if (!salaryMaking) return menu
      const caption =
        salaryMaking.targetAmount != null && salaryMaking.currentAmount != null
          ? `목표 ${toMan(salaryMaking.targetAmount)}만 중 ${toMan(salaryMaking.currentAmount)}만`
          : menu.caption
      return { ...menu, caption, progressPct: salaryMaking.achievementRate ?? undefined }
    }

    if (menu.key === 'lifeStability') {
      const lifeStability = hub.menus.lifeStability
      if (!lifeStability || lifeStability.grade == null) {
        return { ...menu, caption: '아직 결과가 없어요' }
      }
      const status = gradeToStatus(lifeStability.grade)
      return {
        ...menu,
        caption:
          lifeStability.coverageRate != null
            ? `충당률 ${Math.round(lifeStability.coverageRate)}%`
            : menu.caption,
        iconTone: STATUS_ICON_TONE[status],
        statusDot: status,
        statusText: STATUS_TEXT[status],
      }
    }

    if (menu.key === 'investmentCheck') {
      const ratio = hub.menus.investmentCheck?.cashflowAssetRatio
      if (ratio == null) return menu
      return { ...menu, caption: `월급 만드는 자산\n${ratio}%뿐이에요` }
    }

    if (menu.key === 'retirementSim') {
      const retirementSim = hub.menus.retirementSim
      if (retirementSim && retirementSim.available === false) {
        return { ...menu, caption: '준비 중', iconTone: 'muted' }
      }
      return menu
    }

    return menu
  })

// 월간 리포트(#6)는 아직 미구현이라 mock 유지
const MOCK_REPORT_MONTH = '6월'
const MOCK_REPORT: ReportItem[] = [
  { label: '배당금 변동', value: '+12.4%', valueClass: 'text-success' },
  { label: '다음 달 수입', value: '130만원' },
  { label: '소비 수준', value: '적정' },
]

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
  const { data: profile } = useGetProfile()

  const asset = hub ? toAssetData(hub) : null
  const stability = hub ? toStabilityData(hub) : null

  return (
    <div className="flex h-dvh flex-col bg-white">
      {/* User header */}
      <header className="flex h-[52px] items-center pl-6 pr-[14px]">
        <button onClick={() => navigate('/home')} className="mr-3 shrink-0" aria-label="홈으로 이동">
          <img src="/logos/sol-mark.svg" alt="SOL" width={36} height={36} />
        </button>
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
            <div className="grid grid-cols-2 gap-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-[120px] animate-pulse rounded-card-lg border border-line bg-surface-muted" />
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

            {/* 관리 메뉴 */}
            <section>
              <h2 className="text-body text-ink mb-3 font-bold">관리 메뉴</h2>
              <div className="grid grid-cols-2 gap-3 [grid-auto-rows:1fr]">
                {buildMenus(hub).map((menu) => (
                  <ManageMenuCard key={menu.key} menu={menu} onClick={() => navigate(menu.path)} />
                ))}
              </div>
            </section>

            {/* 리포트 */}
            <section className="pb-2">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-body text-ink font-bold">{MOCK_REPORT_MONTH} 리포트 ›</span>
                <span className="text-sub text-ink-hint">전체보기</span>
              </div>
              <div className="rounded-card-lg border border-line bg-white px-3 py-[9px]">
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
