import { useNavigate } from 'react-router-dom'
import pxr from '@/common/utils/pxr'
import BottomNav from '../common/components/BottomNav'
import { NotificationIc, RetirementSimIc, InvestmentCheckIc, PensionDeferIc } from '../common/assets/icons'
import AssetCard from './components/AssetCard'
import useGetAssetHub from '@/asset/hooks/useGetAssetHub'
import type { AssetHubResponse, LifeStabilityGrade } from '@/asset/types/assetHub'
import type { AssetData, HomeStabilityData } from './types/home'
import type { StabilityStatus } from '../stability/types/stability'
import type { ManageMenu } from '@/asset/types/asset'

const SOL_CARDS = [
  {
    key: 'investmentCheck' as const,
    title: '투자 건강검진',
    path: '/asset/investment-checkup',
    icon: <InvestmentCheckIc width={44} height={44} />,
  },
  {
    key: 'pensionDefer' as const,
    title: '국민연금 연기',
    path: '/pension/defer',
    icon: <PensionDeferIc width={44} height={44} />,
  },
  {
    key: 'retirementSim' as const,
    title: '은퇴 시뮬레이션',
    path: '/retirement-simulation',
    icon: <RetirementSimIc width={44} height={44} />,
  },
]

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
    iconTone: 'pink',
  },
  {
    key: 'investmentCheck',
    title: '투자 건강검진',
    caption: '월급 만드는 자산\n32%뿐이에요',
    path: '/asset/investment-checkup',
    iconTone: 'coral',
  },
  {
    key: 'pensionDefer',
    title: '국민연금 연기',
    caption: '5년 미루면\n평생 +43만원이에요',
    path: '/pension/defer',
    iconTone: 'yellow',
  },
  {
    key: 'retirementSim',
    title: '은퇴 시뮬레이션',
    caption: '조건을 바꿔\n미리 볼 수 있어요',
    path: '/retirement-simulation',
    iconTone: 'mint',
  },
]

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

    if (menu.key === 'investmentCheck') {
      const ratio = hub.menus.investmentCheck?.cashflowAssetRatio
      if (ratio == null) return menu
      return { ...menu, caption: `월급 만드는 자산이\n${ratio}%뿐이에요` }
    }

    if (menu.key === 'retirementSim') {
      const retirementSim = hub.menus.retirementSim
      if (retirementSim && retirementSim.available === false) {
        return { ...menu, caption: '곧 이용할 수 있어요', iconTone: 'muted' }
      }
      return menu
    }

    return menu
  })


const toAssetData = (hub: AssetHubResponse): AssetData => ({
  totalAmountKrw: hub.totalAsset,
  changeAmount: hub.changeAmount,
  changeDirection: hub.changeDirection,
  segments: hub.allocation.map((item) => ({ label: item.category, pct: item.ratio })),
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
  const allMenus = hub ? buildMenus(hub) : []

  return (
    <div className="flex h-dvh flex-col bg-white">
      {/* User header */}
      <header className="flex h-[52px] items-center pl-6 pr-[14px]">
        <button onClick={() => navigate('/home')} className="mr-3 shrink-0" aria-label="홈으로 이동">
          <img src="/logos/sol-mark.svg" alt="SOL" width={36} height={36} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-brand font-bold text-ink" style={{ fontSize: pxr(22) }}>
            연금<span className="text-primary">SOL</span>사
          </p>
        </div>
        <button
          aria-label="알림"
          className="flex size-11 items-center justify-center"
          onClick={() => navigate('/notification')}
        >
          <NotificationIc className="text-ink" width={24} height={24} />
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
              {[0, 1, 2, 3].map((i) => (
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
              <div
                className="w-full cursor-pointer"
                onClick={() => navigate('/asset')}
                role="link"
                aria-label="자산분석 페이지로 이동"
              >
                <AssetCard
                  totalAmountKrw={asset.totalAmountKrw}
                  changeAmount={asset.changeAmount}
                  changeDirection={asset.changeDirection}
                  segments={asset.segments}
                  onAnalysisClick={() => navigate('/asset')}
                />
              </div>
            </section>

            {/* 월간 리포트 요약 */}
            {(() => {
              const month = hub.menus.monthlyReport?.month ?? `${new Date().getMonth() + 1}월`
              return (
                <div className="rounded-card-lg border border-line bg-white px-5 py-[14px] flex items-center gap-3">
                  {/* 라벨 + 금액: 화면 중앙선 기준 우측정렬 */}
                  <div className="w-[55%] grid grid-cols-[auto_1fr] gap-x-3 gap-y-[9px] items-baseline">
                    <span className="text-sub text-ink-hint shrink-0">{month} 지출</span>
                    <span className="font-inter text-btn font-bold text-ink text-right tabular-nums">
                      {hub.monthlyExpense.toLocaleString('ko-KR')}원
                    </span>
                    <span className="text-sub text-ink-hint shrink-0">{month} 수입</span>
                    <span className="font-inter text-btn font-bold text-primary text-right tabular-nums">
                      {hub.monthlyIncome.toLocaleString('ko-KR')}원
                    </span>
                  </div>
                  <div className="flex-1 flex justify-end">
                    <button
                      onClick={() => navigate('/asset/monthly-report')}
                      className="text-sub font-bold text-ink-sub px-[14px] py-[7px] rounded-badge bg-surface whitespace-nowrap"
                    >
                      {month} 월간리포트 보기
                    </button>
                  </div>
                </div>
              )
            })()}

            {/* 생활 안정도 + 월급 만들기 */}
            {stability ? (
              <div className="bg-white rounded-card-xl border border-line px-5 pt-5 pb-4 flex flex-col gap-4">
                {/* 설명 문장 + 분석 버튼 */}
                <div className="flex items-center justify-between gap-3">
                  <p className="text-btn text-ink-sub leading-snug flex-1">
                    {stability.status === 'stable' ? (
                      <>목표 생활비가 <span className="text-primary">채워졌어요</span></>
                    ) : (
                      <>목표 생활비의 <span className="text-primary font-bold">{stability.percentage}%</span>가 채워졌어요</>

                    )}
                  </p>
                  <button
                    onClick={() => navigate('/stability')}
                    className="shrink-0 text-sub font-bold text-ink-sub px-[14px] py-[7px] rounded-badge bg-surface whitespace-nowrap"
                  >
                    분석
                  </button>
                </div>

                {/* 달성률 그래프 */}
                <div className="flex flex-col gap-[7px]">
                  <div className="h-[9px] rounded-full bg-track overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.min(Math.max(stability.percentage, 0), 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-caption text-ink-hint">
                      현재 {Math.round(stability.currentIncomeKrw / 10_000).toLocaleString('ko-KR')}만원
                    </span>
                    <span className="text-caption text-ink-hint">
                      목표 {Math.round(stability.targetIncomeKrw / 10_000).toLocaleString('ko-KR')}만원
                    </span>
                  </div>
                </div>

                {/* 현금 흐름 설계하기 CTA */}
                {stability.shortfallKrw != null && stability.shortfallKrw > 0 && (
                  <button
                    onClick={() => navigate('/paycheck-plan/assets')}
                    className="w-full bg-surface text-ink rounded-btn py-[14px] px-5 flex items-center justify-between"
                  >
                    <span className="text-btn font-bold">월급 설계하기</span>
                    <span className="text-body flex items-center gap-[3px]">
                      <span className="text-ink-sub">부족한 금액</span>
                      <span className="text-ink tabular-nums">{stability.shortfallKrw.toLocaleString('ko-KR')}원</span>
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="text-ink-sub">
                        <path d="M9 18 L15 12 L9 6"/>
                      </svg>
                    </span>
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/paycheck-plan/assets')}
                className="w-full bg-white rounded-card-xl border border-line p-5 text-left flex flex-col gap-2"
              >
                <span className="text-md font-bold text-ink">월급 만들기</span>
                <p className="text-sub text-ink-sub leading-[1.62]">
                  아직 생활 안정도 결과가 없어요. 자산을 연결하면 분석해 드려요.
                </p>
              </button>
            )}

            {/* 마이 SOL */}
            <section className="mt-1">
              <p className="text-heading font-bold text-ink mb-5">마이 SOL</p>
              <div className="grid grid-cols-3 gap-2">
                {SOL_CARDS.filter(c => allMenus.some(m => m.key === c.key)).map(card => {
                  const caption = allMenus.find(m => m.key === card.key)?.caption
                  return (
                    <button
                      key={card.key}
                      onClick={() => navigate(card.path)}
                      className="bg-surface rounded-card-lg aspect-square flex flex-col justify-between p-[14px] text-left"
                    >
                      <div className="flex flex-col gap-1">
                        <p className="text-md font-bold text-ink leading-snug">
                          {card.title}
                        </p>
                        {caption && (
                          <p className="text-caption text-ink-hint leading-snug whitespace-pre-line">
                            {caption}
                          </p>
                        )}
                      </div>
                      <div className="self-end">
                        {card.icon}
                      </div>
                    </button>
                  )
                })}
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
