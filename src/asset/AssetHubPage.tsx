import { useNavigate } from 'react-router-dom'
import BottomNav from '../common/components/BottomNav'
import { NotificationIc } from '../common/assets/icons'
import useGetAssetHub from './hooks/useGetAssetHub'
import type { AssetHubResponse, LifeStabilityGrade } from './types/assetHub'
import AssetSummaryCard from './components/AssetSummaryCard'
import ManageMenuCard from './components/ManageMenuCard'
import type { AssetHubSummary, ManageMenu } from './types/asset'
import type { StabilityStatus } from '../stability/types/stability'

// API로 채우지 않는 메뉴 메타데이터(제목/경로/아이콘/기본 캡션).
// salaryMaking·lifeStability·retirementSim은 asset/hub 응답으로 덮어쓰고,
// investmentCheck(#2)·pensionDefer(#5)·monthlyReport(#6)은 BE 미구현이라 정적 캡션을 유지한다.
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
    path: '/asset-management/investment-checkup',
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
    path: '/asset-management/monthly-report',
    iconTone: 'muted',
    isNew: true,
  },
]

const STATUS_TEXT: Record<StabilityStatus, string> = {
  stable: '안정',
  warning: '주의',
  danger: '위험',
}

// MenuIconTone에 danger 전용 톤이 없어 danger도 warning 톤으로 표시(상태 점은 빨강으로 구분됨)
const STATUS_ICON_TONE: Record<StabilityStatus, ManageMenu['iconTone']> = {
  stable: 'muted',
  warning: 'warning',
  danger: 'warning',
}

const gradeToStatus = (grade: LifeStabilityGrade): StabilityStatus => {
  if (grade === 'STABLE') return 'stable'
  if (grade === 'NEED_COMPLEMENT') return 'warning'
  return 'danger'
}

const toMan = (krw: number) => Math.round(krw / 10_000).toLocaleString('ko-KR')

const toSummary = (hub: AssetHubResponse): AssetHubSummary => ({
  totalAmountKrw: hub.totalAsset,
  changeAmountKrw: hub.changeAmount,
  changeDirection: hub.changeDirection,
  allocation: hub.allocation.map((item) => ({ label: item.category, pct: item.ratio })),
  monthlyIncomeKrw: hub.monthlyIncome,
  monthlyExpenseKrw: hub.monthlyExpense,
})

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

    if (menu.key === 'retirementSim') {
      const retirementSim = hub.menus.retirementSim
      if (retirementSim && retirementSim.available === false) {
        return { ...menu, caption: '준비 중', iconTone: 'muted' }
      }
      return menu
    }

    // investmentCheck(#2) / pensionDefer(#5) / monthlyReport(#6): BE 미구현 → 정적 캡션 유지
    return menu
  })

function AssetHubPage() {
  const navigate = useNavigate()
  const { data: hub, isLoading, refetch } = useGetAssetHub()

  return (
    <div className="flex h-dvh flex-col bg-white">
      <header className="flex h-[52px] items-center pl-6 pr-[14px]">
        <img src="/logos/sol-mark.svg" alt="SOL" width={36} height={36} className="mr-3 shrink-0" />
        <h1 className="flex-1 text-heading font-bold text-ink">자산관리</h1>
        <button
          aria-label="알림"
          onClick={() => navigate('/notification')}
          className="flex size-11 items-center justify-center"
        >
          <NotificationIc className="text-ink" width={22} height={22} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pt-4 pb-6">
        {isLoading ? (
          <div role="status" aria-live="polite" className="flex flex-col gap-5 px-6">
            <span className="sr-only">자산 정보를 불러오는 중입니다.</span>
            <div className="h-[220px] animate-pulse rounded-card-xl border border-line bg-surface-muted" />
            <div className="grid grid-cols-2 gap-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-[120px] animate-pulse rounded-card-lg border border-line bg-surface-muted" />
              ))}
            </div>
          </div>
        ) : !hub ? (
          // 캐시된 데이터가 없을 때만 에러 화면. 백그라운드 재요청 실패 시엔 기존 데이터를 그대로 보여준다.
          <StatusMessage text="자산 정보를 불러오지 못했어요." onRetry={() => refetch()} />
        ) : (
          <div className="flex flex-col gap-5 px-6">
            <AssetSummaryCard {...toSummary(hub)} />

            <section>
              <h2 className="text-body text-ink mb-3 font-bold">관리 메뉴</h2>
              <div className="grid grid-cols-2 gap-3 [grid-auto-rows:1fr]">
                {buildMenus(hub).map((menu) => (
                  <ManageMenuCard key={menu.key} menu={menu} onClick={() => navigate(menu.path)} />
                ))}
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

export default AssetHubPage
