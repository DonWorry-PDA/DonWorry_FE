import { useState, useEffect, useRef } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import AppBar from '../common/components/AppBar'
import { NavHomeIc } from '../common/assets/icons'
import Button from '../common/components/Button'
import InfoBox from '../common/components/InfoBox'
import StickyFooter from '../common/components/StickyFooter'
import StepProgress from './components/StepProgress'
import useGetCashFlowDiagnosis from './hooks/useGetCashFlowDiagnosis'
import client from '@/common/api/client'
import type { ApiResponse } from '@/common/types/api'
import type { RecommendationResponse } from './types/recommendation'

const toMan = (won: number) => Math.round(won / 10_000)
const formatShortfall = (won: number) => {
  if (won < 10_000) return '1만원 미만'
  return `${toMan(won)}만원`
}

const LOADING_MESSAGES = [
  '설계안을 만드는 중이에요',
  '자산을 분석하고 있어요',
  '최적의 플랜을 찾고 있어요',
]

function PlanLoadingScreen() {
  const [msgIdx, setMsgIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length)
    }, 1200)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center h-dvh bg-white px-6"
    >
      <div className="relative flex size-24 items-center justify-center mb-8" aria-hidden="true">
        <div className="absolute inset-0 animate-spin">
          {[0, 60, 120, 180, 240, 300].map((deg) => {
            const rad = (deg * Math.PI) / 180
            return (
              <div
                key={deg}
                className="absolute size-2.5 rounded-full bg-primary/30"
                style={{
                  top: `calc(50% + ${-40 * Math.cos(rad) - 5}px)`,
                  left: `calc(50% + ${40 * Math.sin(rad) - 5}px)`,
                }}
              />
            )
          })}
        </div>
        <img src="/logos/sol-mark.svg" alt="" width={56} height={56} className="rounded-full" />
      </div>
      <p className="text-card font-bold text-ink text-center">{LOADING_MESSAGES[msgIdx]}</p>
      <p className="mt-2 text-sub text-ink-hint text-center">잠시만 기다려주세요</p>
    </div>
  )
}

function CoverageBar({
  pension,
  dividend,
  target,
}: {
  pension: number
  dividend: number
  target: number
}) {
  const pensionPct = target > 0 ? Math.min(100, (pension / target) * 100) : 0
  const dividendPct = target > 0 ? Math.min(100 - pensionPct, (dividend / target) * 100) : 0

  return (
    <div className="mb-5">
      <div className="flex justify-between items-baseline mb-2">
        <p className="text-sub text-ink-hint">현재 충당 현황</p>
        <p className="text-sub text-ink-hint">
          <span className="font-inter font-bold text-primary">{pension + dividend}</span>
          <span> / {target}만원</span>
        </p>
      </div>

      <div className="relative h-3 bg-surface-muted rounded-full overflow-hidden mb-2.5">
        <div
          className="absolute left-0 top-0 h-full bg-primary"
          style={{ width: `${pensionPct}%` }}
        />
        <div
          className="absolute top-0 h-full bg-primary/35"
          style={{ left: `${pensionPct}%`, width: `${dividendPct}%` }}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex items-center gap-1.5">
          <span className="block size-2 rounded-full bg-primary shrink-0" />
          <span className="text-caption text-ink-hint">국민연금 {pension}만원</span>
        </div>
        {dividend > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="block size-2 rounded-full bg-primary/35 border border-primary/20 shrink-0" />
            <span className="text-caption text-ink-hint">배당 ETF {dividend}만원</span>
          </div>
        )}
      </div>
    </div>
  )
}

function PaycheckDiagnosisPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showPlanLoading, setShowPlanLoading] = useState(false)
  const fetchedRef = useRef(false)
  const { data, isLoading, isError, error } = useGetCashFlowDiagnosis()

  const handleGoToPlans = () => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    setShowPlanLoading(true)

    const minDelay = new Promise<void>((res) => setTimeout(res, 2000))
    const prefetch = queryClient.prefetchQuery({
      queryKey: ['portfolio', 'recommendation'],
      queryFn: () =>
        client
          .get<ApiResponse<RecommendationResponse>>('/api/user/portfolio/recommendation')
          .then((res) => res.data.data),
    })

    Promise.all([minDelay, prefetch]).then(() => {
      navigate('/paycheck-plan/plans')
    })
  }

  const homeAction = (
    <button
      type="button"
      onClick={() => navigate('/home')}
      aria-label="홈으로"
      className="text-ink-sub"
    >
      <NavHomeIc width={22} height={22} />
    </button>
  )

  if (showPlanLoading) return <PlanLoadingScreen />

  if (isLoading) {
    return (
      <div className="flex flex-col h-dvh">
        <AppBar title="월급 만들기" onBack={() => navigate(-1)} rightAction={homeAction} />
        <StepProgress current={2} total={2} />
        <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-4 flex flex-col gap-4">
          <div className="h-[120px] animate-pulse rounded-card-xl bg-surface-muted" />
          <div className="h-[72px] animate-pulse rounded-card-lg bg-surface-muted" />
          <div className="h-[160px] animate-pulse rounded-card-lg bg-surface-muted" />
        </div>
      </div>
    )
  }

  if (isAxiosError(error) && error.response?.status === 403) {
    return <Navigate to="/paycheck-plan/assets" replace />
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col h-dvh">
        <AppBar title="월급 만들기" onBack={() => navigate(-1)} rightAction={homeAction} />
        <StepProgress current={2} total={2} />
        <p className="text-body text-danger text-center pt-20">데이터를 불러오지 못했어요.</p>
      </div>
    )
  }

  const monthlyCashFlowMan = toMan(data.monthlyCashFlow)
  const nationalPensionMan = toMan(data.nationalPension)
  const dividendIncomeMan = toMan(data.dividendIncome)
  const targetMan = toMan(data.targetMonthlyLivingCost)
  const shortfallLabel = formatShortfall(data.monthlyShortfall)

  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <AppBar title="월급 만들기" onBack={() => navigate(-1)} rightAction={homeAction} />
      <StepProgress current={2} total={2} />

      <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-4">

        {/* 진단 결과 히어로 카드 */}
        {data.shortfallExists ? (
          <InfoBox tone="primary" className="mb-5">
            <p className="text-sub mb-1">매달 부족한 돈</p>
            <p className="font-inter text-display font-bold mb-3">{shortfallLabel}</p>
            <div className="border-t border-current/20 pt-3">
              <p className="text-body font-semibold text-ink mb-0.5">
                부족한 {shortfallLabel}, 월급으로 만들어드릴까요?
              </p>
              <p className="text-sub text-ink-sub">원하실 때 언제든 시작할 수 있어요.</p>
            </div>
          </InfoBox>
        ) : (
          <InfoBox tone="success" className="mb-5">
            <p className="text-sub mb-1">현재 현금흐름으로</p>
            <p className="font-inter text-display font-bold mb-3">생활비가 충당돼요</p>
            <div className="border-t border-current/20 pt-3">
              <p className="text-body font-semibold text-ink mb-0.5">
                더 여유로운 월급 설계안도 볼까요?
              </p>
              <p className="text-sub text-ink-sub">맞춤 플랜을 보여드릴게요.</p>
            </div>
          </InfoBox>
        )}

        {/* 커버리지 바 */}
        <CoverageBar
          pension={nationalPensionMan}
          dividend={dividendIncomeMan}
          target={targetMan}
        />

        {/* 브레이크다운 카드 */}
        <div className="bg-surface rounded-card-lg px-4 py-1 mb-2">
          <div className="flex items-center justify-between py-3 border-b border-divider">
            <span className="text-body text-ink-sub">국민연금</span>
            <span className="font-inter text-body text-ink">+{nationalPensionMan}만원</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-divider">
            <span className="text-body text-ink-sub">배당 ETF 분배금</span>
            <span className="font-inter text-body text-ink">+{dividendIncomeMan}만원</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-divider">
            <span className="text-body text-ink-sub">목표 생활비</span>
            <span className="font-inter text-body text-ink">{targetMan}만원</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-body font-semibold text-ink">월수입 합계</span>
            <span className="font-inter text-body font-semibold text-primary">
              {monthlyCashFlowMan}만원
            </span>
          </div>
        </div>
        {/* 실수령 기준 안내 — 자산분석의 세전 배당과 달라 보이는 이유를 설명 */}
        <p className="text-caption text-ink-hint mb-6 px-1">
          분배금은 세금(15.4%)을 뗀 실수령 기준이에요.
        </p>

      </div>

      <StickyFooter>
        <Button onClick={handleGoToPlans}>설계안 보기</Button>
      </StickyFooter>
    </div>
  )
}

export default PaycheckDiagnosisPage
