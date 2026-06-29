import { useNavigate } from 'react-router-dom'
import { formatWon, formatKrw } from '@/common/utils/formatKrw'
import pxr from '@/common/utils/pxr'
import BottomNav from '../common/components/BottomNav'
import { NotificationIc, RetirementSimIc, InvestmentCheckIc, PensionDeferIc } from '../common/assets/icons'
import AssetCard from './components/AssetCard'
import useRealtimeAssetHub from '@/asset/hooks/useRealtimeAssetHub'
import useGetNotificationUnreadCount from '@/notification/hooks/useGetNotificationUnreadCount'
import type { AssetHubResponse, LifeStabilityGrade } from '@/asset/types/assetHub'
import type { AssetData, HomeStabilityData } from './types/home'
import type { StabilityStatus } from '../stability/types/stability'
import type { ManageMenu } from '@/asset/types/asset'


// 생활 안정도 상태 배지 (StabilityCard와 동일 기준)
const STABILITY_BADGE_LABEL: Record<StabilityStatus, string> = {
  stable: '안정',
  warning: '보완 필요',
  danger: '개선 필요',
}
const STABILITY_BADGE_CLASS: Record<StabilityStatus, string> = {
  stable: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  danger: 'bg-danger-bg text-danger',
}

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
    // 기이용자(ACTIVE plan)면 운용현황, 아니면 status 페이지가 /assets로 자체 리다이렉트.
    path: '/paycheck-plan/status',
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

const toAssetData = (
  hub: AssetHubResponse,
  totalAsset: number,
  allocation: AssetHubResponse['allocation'],
): AssetData => ({
  totalAmountKrw: totalAsset,
  changeAmount: hub.changeAmount,
  changeDirection: hub.changeDirection,
  segments: allocation.map((item) => ({ label: item.category, pct: item.ratio })),
})

const toStabilityData = (hub: AssetHubResponse): HomeStabilityData | null => {
  const lifeStability = hub.menus.lifeStability
  const salaryMaking = hub.menus.salaryMaking
  if (!lifeStability || lifeStability.grade == null) return null

  if (!salaryMaking || salaryMaking.currentAmount == null || salaryMaking.targetAmount == null) {
    return null
  }
  const current = salaryMaking.currentAmount
  const target = salaryMaking.targetAmount
  const shortfall = target - current
  const activePlanCoverageRate = salaryMaking.hasActivePlan ? salaryMaking.achievementRate : null
  const coverageRate = activePlanCoverageRate ?? lifeStability.coverageRate ?? 0

  return {
    status: gradeToStatus(lifeStability.grade),
    percentage: Math.round(coverageRate),
    currentIncomeKrw: current,
    targetIncomeKrw: target,
    shortfallKrw: shortfall > 0 ? shortfall : null,
    hasActivePlan: salaryMaking.hasActivePlan,
  }
}

function HomePage() {
  const navigate = useNavigate()
  const { hub, realtimeTotalAsset, realtimeAllocation, isLoading, refetch } = useRealtimeAssetHub()
  const { data: unreadCount = 0 } = useGetNotificationUnreadCount()

  const asset =
    hub && realtimeTotalAsset != null && realtimeAllocation != null
      ? toAssetData(hub, realtimeTotalAsset, realtimeAllocation)
      : null
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
          aria-label={unreadCount > 0 ? `읽지 않은 알림 ${unreadCount}개, 알림 페이지로 이동` : '알림 페이지로 이동'}
          className="relative flex size-11 items-center justify-center"
          onClick={() => navigate('/notification')}
        >
          <NotificationIc className="text-ink" width={24} height={24} />
          {unreadCount > 0 && (
            <span className="absolute top-[9px] right-[9px] flex min-w-[14px] h-[14px] items-center justify-center rounded-full bg-danger px-[3px]">
              <span className="text-white font-bold leading-none" style={{ fontSize: pxr(9) }}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            </span>
          )}
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
          <StatusMessage text="자산 정보를 불러오지 못했어요." onRetry={() => refetch()} />
        ) : (
          <div className="flex flex-col gap-5 px-6">
            {/* 총 자산 */}
            <section>
              <div
                className="w-full cursor-pointer"
                onClick={() => navigate('/asset', { state: { from: 'home' } })}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/asset', { state: { from: 'home' } }) }}
                role="link"
                aria-label="자산분석 페이지로 이동"
                tabIndex={0}
              >
                <AssetCard
                  totalAmountKrw={asset.totalAmountKrw}
                  changeAmount={asset.changeAmount}
                  changeDirection={asset.changeDirection}
                  segments={asset.segments}
                  onAnalysisClick={() => navigate('/asset', { state: { from: 'home' } })}
                />
              </div>
            </section>

            {/* 월간 리포트 요약 */}
            {(() => {
              const month = hub.menus.monthlyReport?.month ?? `${new Date().getMonth() + 1}월`
              return (
                <div className="rounded-card-lg border border-line bg-white px-5 py-[14px] flex items-center gap-3">
                  <div className="min-w-0 flex-1 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-[9px] items-baseline">
                    <span className="text-sub text-ink-hint shrink-0">{month} 지출</span>
                    <span className="font-inter text-md font-bold text-ink text-right tabular-nums whitespace-nowrap">
                      {formatWon(hub.monthlyExpense)}
                    </span>
                    <span className="text-sub text-ink-hint shrink-0">{month} 수입</span>
                    <span className="font-inter text-md font-bold text-primary text-right tabular-nums whitespace-nowrap">
                      {formatWon(hub.monthlyIncome)}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate('/asset/monthly-report')}
                    className="shrink-0 text-sub font-bold text-ink-sub px-[14px] py-[7px] rounded-badge bg-surface whitespace-nowrap"
                  >
                    리포트 보기
                  </button>
                </div>
              )
            })()}

            {/* 생활 안정도 + 월급 만들기 */}
            {stability ? (
              <div className="bg-white rounded-card-xl border border-line px-5 pt-5 pb-4 flex flex-col gap-4">
                {/* 생활 안정도 제목 + 상태배지 + 이동 */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-card font-bold text-ink">생활 안정도</span>
                    <span
                      className={`shrink-0 text-caption font-bold px-2 py-[3px] rounded-badge ${STABILITY_BADGE_CLASS[stability.status]}`}
                    >
                      {STABILITY_BADGE_LABEL[stability.status]}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate('/stability')}
                    aria-label="생활 안정도 자세히 보기"
                    className="shrink-0 text-sub font-bold text-ink-sub px-4 py-[7px] rounded-badge bg-surface whitespace-nowrap"
                  >
                    자세히 보기
                  </button>
                </div>

                <p className="text-btn text-ink-sub leading-snug">
                  {stability.status === 'stable' ? (
                    <>목표 생활비가 <span className="text-primary">채워졌어요</span></>
                  ) : (
                    <>
                      목표 생활비의{' '}
                      <span className="text-primary font-bold">{stability.percentage}%</span>가 채워졌어요
                    </>
                  )}
                </p>

                <div className="flex flex-col gap-[7px]">
                  <div className="h-[9px] rounded-full bg-track overflow-hidden">
                    {/* 채움 reveal + shimmer (자산 비율 바와 동일 효과) */}
                    <div
                      className="animate-bar-reveal relative h-full overflow-hidden rounded-full bg-primary"
                      style={{ width: `${Math.min(Math.max(stability.percentage, 0), 100)}%` }}
                    >
                      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                        <div
                          className="animate-bar-shimmer absolute inset-y-0 w-[30%]"
                          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)' }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-caption text-ink-hint">
                      현재 {formatKrw(stability.currentIncomeKrw)}
                    </span>
                    <span className="text-caption text-ink-hint">
                      목표 {formatKrw(stability.targetIncomeKrw)}
                    </span>
                  </div>
                </div>

                {(stability.hasActivePlan || (stability.shortfallKrw != null && stability.shortfallKrw > 0)) && (
                  <button
                    onClick={() => navigate('/paycheck-plan/status')}
                    className={`animate-cta-enter relative overflow-hidden w-full bg-primary rounded-btn py-[14px] px-5 flex items-center justify-between ${
                      stability.hasActivePlan ? 'text-transparent' : 'text-white'
                    }`}
                  >
                    <div
                      aria-hidden="true"
                      className="animate-cta-shimmer pointer-events-none absolute inset-y-0 w-1/2"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)' }}
                    />
                    {stability.hasActivePlan && (
                      <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-between px-5 text-white">
                        <span className="text-md font-bold whitespace-nowrap">내 월급 현황 보기</span>
                        <span className="text-body flex items-center gap-[3px] whitespace-nowrap">
                          <span className="opacity-75">운용 현황</span>
                          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="opacity-75">
                            <path d="M9 18 L15 12 L9 6"/>
                          </svg>
                        </span>
                      </span>
                    )}
                    <span className="text-md font-bold whitespace-nowrap">월급 설계하기</span>
                    <span className="text-body flex items-center gap-[3px] whitespace-nowrap">
                      <span className="opacity-75">부족한 금액</span>
                      <span className="font-inter tabular-nums font-semibold">{formatKrw(stability.shortfallKrw ?? 0)}</span>
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="opacity-75">
                        <path d="M9 18 L15 12 L9 6"/>
                      </svg>
                    </span>
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/paycheck-plan/status')}
                className="w-full bg-primary-tint rounded-card-xl border border-primary-dim p-5 text-left flex items-center justify-between gap-3"
              >
                <div className="flex flex-col gap-[6px] flex-1 min-w-0">
                  <span className="text-md font-bold text-primary">월급 만들기</span>
                  <p className="text-sub text-ink-sub leading-[1.62]">
                    자산을 연결하면 생활 안정도를 분석해 드려요.
                  </p>
                </div>
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="text-primary shrink-0">
                  <path d="M9 18 L15 12 L9 6"/>
                </svg>
              </button>
            )}

            {/* 마이 SOL */}
            <section className="mt-1">
              <p className="text-heading font-bold text-ink mb-5">마이 SOL</p>
              <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory min-[475px]:grid min-[475px]:grid-cols-3 min-[475px]:gap-2 min-[475px]:overflow-visible">
                {SOL_CARDS.filter(c => allMenus.some(m => m.key === c.key)).map(card => {
                  const caption = allMenus.find(m => m.key === card.key)?.caption
                  return (
                    <div key={card.key} className="w-36 shrink-0 snap-start relative aspect-square min-[475px]:w-auto">
                      <button
                        onClick={() => navigate(card.path)}
                        className="absolute inset-0 bg-surface rounded-card-lg flex flex-col justify-between p-[14px] text-left"
                      >
                        <div className="flex flex-col gap-1">
                          <p className="text-md font-bold text-ink leading-snug break-keep">
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
                    </div>
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
