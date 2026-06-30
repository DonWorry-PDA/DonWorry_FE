import { Navigate, useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'
import CenterMessage from './components/CenterMessage'
import useGetSalaryPlanStatus from './hooks/useGetSalaryPlanStatus'
import { toManwon } from './utils/planMapper'
import type { ReentryGuidance, SalaryPlanBucketRole, SalaryPlanHolding } from './types/paycheckPlan'

// 월급명세서형(F안): "매달 받는 월급"이 메인. 달성률(평가액÷목표)은 시세 하락 시
// 매수 완료자에게도 100% 미만으로 보여 오해를 줘서 화면에서 빼고, 생활비 충당률만 보조로 둔다.

const BUCKET_LABEL: Record<SalaryPlanBucketRole, string> = {
  SAFE: '안전',
  RISK: '성장',
  SHORT_TERM: '단기',
}

const won = (v: number) => `${toManwon(v).toLocaleString('ko-KR')}만원`

function PaycheckPlanStatusPage() {
  const navigate = useNavigate()
  const { data, isLoading, refetch } = useGetSalaryPlanStatus()

  if (isLoading) {
    return (
      <div className="flex flex-col h-dvh">
        <AppBar title="내 월급 현황" onBack={() => navigate(-1)} />
        <div role="status" aria-live="polite" className="flex-1 min-h-0 overflow-y-auto px-6 pt-4">
          <span className="sr-only">월급 현황을 불러오는 중입니다.</span>
          <div className="mb-4 h-[120px] animate-pulse rounded-card-xl bg-surface-muted" />
          <div className="flex flex-col gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-[64px] animate-pulse rounded-card bg-surface-muted" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // 캐시도 없고 응답도 없을 때만 에러. (백그라운드 재요청 실패는 캐시로 버틴다)
  if (!data) {
    return (
      <div className="flex flex-col h-dvh">
        <AppBar title="내 월급 현황" onBack={() => navigate(-1)} />
        <CenterMessage variant="alert">
          <div className="flex flex-col items-center gap-3">
            <p>현황을 불러오지 못했어요</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-btn border border-line px-5 py-2.5 text-body font-semibold text-ink"
            >
              다시 시도
            </button>
          </div>
        </CenterMessage>
      </div>
    )
  }

  // ACTIVE 확정안이 없으면 기이용자가 아님 → 최초 진입(자산 선택)으로.
  if (!data.hasPlan) {
    return <Navigate to="/paycheck-plan/assets" replace />
  }

  const holdings = data.holdings ?? []
  const totalContribution = holdings.reduce((sum, h) => sum + h.productContribution, 0)
  const totalRemaining = holdings.reduce((sum, h) => sum + h.remainingToBuy, 0)
  const coverage = data.livingCostCoverageRate != null ? Math.round(data.livingCostCoverageRate) : null

  return (
    <div className="flex flex-col h-dvh">
      <AppBar title="내 월급 현황" onBack={() => navigate(-1)} />

      <div className="flex-1 min-h-0 overflow-y-auto pb-6">
        {/* 헤드라인 — 매달 받는 월급 */}
        <div className="bg-primary px-5 pt-5 pb-6 mx-6 mt-4 rounded-card-xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sub text-white/70">지금 매달 받는 월급</p>
            {data.displayName && (
              <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-caption text-white/90">
                {data.displayName}
              </span>
            )}
          </div>
          <p className="font-inter text-display font-bold text-white">
            {data.expectedMonthlySalary != null ? won(data.expectedMonthlySalary) : '-'}
            <span className="text-body font-normal text-white/70 ml-1">/ 월</span>
          </p>
          {coverage != null && (
            <p className="text-sub text-white/80 mt-2">
              생활비의 {coverage}%를 이 월급으로 채우고 있어요
            </p>
          )}
        </div>

        {/* 월급 명세서 — 종목별 월 기여 */}
        <div className="px-6 pt-6">
          <p className="text-body font-semibold text-ink mb-1">이 종목들이 월급을 만들어요</p>
          <p className="text-sub text-ink-hint mb-3">종목마다 매달 보태는 금액이에요</p>

          <div className="rounded-card border border-line overflow-hidden">
            {holdings.map((h, i) => (
              <HoldingRow key={h.productId} holding={h} divider={i > 0} />
            ))}

            {/* 합계 */}
            <div className="flex items-center justify-between bg-surface-muted px-4 py-3 border-t border-line">
              <p className="text-body font-semibold text-ink">합계</p>
              <p className="font-inter text-card font-bold text-primary">매달 {won(totalContribution)}</p>
            </div>
          </div>
        </div>

        {/* 재진입 안내 — 다시 설계(생활비 상향/재설문) 유도. 일회용 탈피. */}
        {data.reentryGuidance && (
          <ReentryGuidanceSection
            guidance={data.reentryGuidance}
            onNavigate={(to) => navigate(to)}
          />
        )}
      </div>

      {totalRemaining > 0 && (
        <StickyFooter>
          <p className="text-sub text-ink-hint text-center mb-2">
            {won(totalRemaining)} 더 채우면 월급이 더 늘어요
          </p>
          <Button onClick={() => navigate('/paycheck-plan/assets')}>더 채워서 월급 늘리기</Button>
        </StickyFooter>
      )}
    </div>
  )
}

function HoldingRow({ holding, divider }: { holding: SalaryPlanHolding; divider: boolean }) {
  return (
    <div className={`px-4 py-3 ${divider ? 'border-t border-divider' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="rounded bg-surface-muted px-1.5 py-0.5 text-caption text-ink-sub shrink-0">
              {BUCKET_LABEL[holding.bucketRole] ?? holding.bucketRole}
            </span>
            <p className="text-body text-ink truncate">{holding.productName}</p>
          </div>
          {holding.remainingToBuy > 0 && (
            <p className="text-caption text-ink-hint">
              {won(holding.remainingToBuy)} 더 채우면 월급 ↑
            </p>
          )}
        </div>
        <p className="font-inter text-body font-bold text-ink shrink-0">
          매달 {won(holding.productContribution)}
        </p>
      </div>
    </div>
  )
}

function ReentryGuidanceSection({
  guidance,
  onNavigate,
}: {
  guidance: ReentryGuidance
  onNavigate: (to: string) => void
}) {
  const coverageFull = guidance.emphasis === 'INCREASE_LIVING_COST'
  return (
    <div className="px-6 pt-6">
      <p className="text-body font-semibold text-ink mb-1">월급을 다시 설계해볼까요?</p>
      <p className="text-sub text-ink-hint mb-3">
        {coverageFull
          ? '이미 목표 생활비를 채우고 있어요. 목표를 올리면 더 많은 월급을 만들 수 있어요.'
          : '설문을 다시 하거나 목표 생활비를 바꾸면 새로운 설계를 받을 수 있어요.'}
      </p>
      <div className="flex flex-col gap-2">
        {guidance.options.map((opt) => (
          <Button
            key={opt.action}
            variant={opt.action === guidance.emphasis ? 'primary' : 'outline'}
            onClick={() => onNavigate(opt.route)}
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default PaycheckPlanStatusPage
