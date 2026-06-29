import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'
import InfoBox from '../common/components/InfoBox'
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
      <p className="text-card font-bold text-ink text-center">
        {LOADING_MESSAGES[msgIdx]}
      </p>
      <p className="mt-2 text-sub text-ink-hint text-center">잠시만 기다려주세요</p>
    </div>
  )
}

function PaycheckDiagnosisPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showPlanLoading, setShowPlanLoading] = useState(false)
  const fetchedRef = useRef(false)
  const { data, isLoading, isError } = useGetCashFlowDiagnosis()

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

  if (showPlanLoading) {
    return <PlanLoadingScreen />
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-dvh">
        <AppBar title="월급 만들기" onBack={() => navigate(-1)} />
        <StepProgress current={2} total={2} />
        <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-4">
          <div className="mb-2 h-5 w-28 animate-pulse rounded bg-surface-muted" />
          <div className="mb-6 h-10 w-36 animate-pulse rounded bg-surface-muted" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[52px] animate-pulse border-b border-divider bg-surface-muted" />
          ))}
          <div className="mt-6 h-[80px] animate-pulse rounded-btn bg-surface-muted" />
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col h-dvh">
        <AppBar title="월급 만들기" onBack={() => navigate(-1)} />
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
      <AppBar title="월급 만들기" onBack={() => navigate(-1)} />
      <StepProgress current={2} total={2} />

      <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-4">
        <p className="text-body text-ink-sub mb-1">지금의 월 현금흐름</p>
        <p className="font-inter text-display font-bold text-ink mb-6">
          {monthlyCashFlowMan}만원
          <span className="text-body font-normal text-ink-hint ml-1">/ 월</span>
        </p>

        <div className="flex flex-col gap-0 mb-6">
          <div className="flex items-center justify-between py-3.5 border-b border-divider">
            <span className="text-body text-ink-sub">국민연금</span>
            <span className="font-inter text-body font-medium text-ink">{nationalPensionMan}만원</span>
          </div>
          <div className="flex items-center justify-between py-3.5 border-b border-divider">
            <span className="text-body text-ink-sub">배당 ETF 분배금</span>
            <span className="font-inter text-body font-medium text-ink">{dividendIncomeMan}만원</span>
          </div>
          <div className="flex items-center justify-between py-3.5 border-b border-divider">
            <span className="text-body text-ink-sub">목표 생활비</span>
            <span className="font-inter text-body font-medium text-ink">{targetMan}만원</span>
          </div>
        </div>

        {data.shortfallExists ? (
          <InfoBox tone="primary" className="mb-6">
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
          <InfoBox tone="primary" className="mb-6">
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
      </div>

      <StickyFooter>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/stability')}>
            안정도 먼저
          </Button>
          <Button onClick={handleGoToPlans}>
            설계안 보기
          </Button>
        </div>
      </StickyFooter>
    </div>
  )
}

export default PaycheckDiagnosisPage
