import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '@/common/components/AppBar'
import SimParamsBar from './components/SimParamsBar'
import SimParamsBarSkeleton from './components/SimParamsBarSkeleton'
import SimSliders from './components/SimSliders'
import SimResultCards from './components/SimResultCards'
import SimActionItems from './components/SimActionItems'
import useSimActionItems from './hooks/useSimActionItems'
import EditParamsSheet from './components/EditParamsSheet'
import useSimulation from './hooks/useSimulation'
import useGetRetirementSimParams from './hooks/useGetRetirementSimParams'
import type { SimParams } from './types/simulation'

const FALLBACK_PARAMS: SimParams = {
  ageYears: 0,
  totalAssetsKrw: 0,
  monthlyLivingKrw: 0,
  monthlyPensionKrw: 0,
}

function RetirementSimulationPage() {
  const navigate = useNavigate()
  const { data, isPending, isError, refetch } = useGetRetirementSimParams()
  const [localParams, setLocalParams] = useState<SimParams | null>(null)
  const [returnRate, setReturnRate] = useState(3.5)
  const [inflationRate, setInflationRate] = useState(2.0)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)

  // 사용자가 수정한 값 우선, 없으면 API 응답 사용
  const activeParams = localParams ?? data

  const result = useSimulation(activeParams ?? FALLBACK_PARAMS, returnRate, inflationRate)
  const actionItems = useSimActionItems()

  return (
    <div className="flex h-dvh flex-col bg-white">
      <AppBar title="은퇴 시뮬레이션" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto">
        {/* 소개 텍스트 */}
        <div className="px-5 pt-4 pb-3">
          <p className="text-body text-ink-sub leading-[1.6]">
            자산관리 정보로 미리 채워졌어요.{' '}
            <span className="font-semibold text-ink">숫자를 바꾸면 결과가 바로 달라져요.</span>
          </p>
        </div>

        {isPending && <SimParamsBarSkeleton />}

        {isError && (
          <div className="flex flex-col items-center gap-3 px-5 py-4">
            <p className="text-body text-ink-sub">데이터를 불러오지 못했어요.</p>
            <button
              type="button"
              className="text-btn font-semibold text-primary"
              onClick={() => refetch()}
            >
              다시 시도
            </button>
          </div>
        )}

        {activeParams && (
          <>
            <SimParamsBar params={activeParams} onEditClick={() => setIsEditSheetOpen(true)} />
            <div className="border-t border-divider" />
            <SimSliders
              returnRate={returnRate}
              inflationRate={inflationRate}
              onReturnRateChange={setReturnRate}
              onInflationRateChange={setInflationRate}
            />
            <div className="border-t border-divider" />
            <div className="py-6">
              <SimResultCards result={result} />
            </div>
            <div className="border-t border-divider" />
            <div className="py-5">
              <SimActionItems items={actionItems} />
            </div>
            <div className="h-6" />
          </>
        )}
      </main>

      {activeParams && (
        <EditParamsSheet
          open={isEditSheetOpen}
          params={activeParams}
          onClose={() => setIsEditSheetOpen(false)}
          onConfirm={setLocalParams}
        />
      )}
    </div>
  )
}

export default RetirementSimulationPage
