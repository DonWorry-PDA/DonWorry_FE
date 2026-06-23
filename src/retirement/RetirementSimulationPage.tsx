import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '@/common/components/AppBar'
import SimParamsBar from './components/SimParamsBar'
import SimSliders from './components/SimSliders'
import SimResultCards from './components/SimResultCards'
import SimActionItems from './components/SimActionItems'
import useSimActionItems from './hooks/useSimActionItems'
import EditParamsSheet from './components/EditParamsSheet'
import useSimulation from './hooks/useSimulation'
import type { SimParams } from './types/simulation'

const MOCK_PARAMS: SimParams = {
  ageYears: 63,
  totalAssetsKrw: 250_000_000,
  monthlyLivingKrw: 2_200_000,
  monthlyPensionKrw: 1_200_000,
}

function RetirementSimulationPage() {
  const navigate = useNavigate()
  const [params, setParams] = useState<SimParams>(MOCK_PARAMS)
  const [returnRate, setReturnRate] = useState(3.5)
  const [inflationRate, setInflationRate] = useState(2.0)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)

  const result = useSimulation(params, returnRate, inflationRate)
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

        {/* 파라미터 바 */}
        <SimParamsBar params={params} onEditClick={() => setIsEditSheetOpen(true)} />

        <div className="border-t border-divider" />

        {/* 슬라이더 */}
        <SimSliders
          returnRate={returnRate}
          inflationRate={inflationRate}
          onReturnRateChange={setReturnRate}
          onInflationRateChange={setInflationRate}
        />

        <div className="border-t border-divider" />

        {/* 결과 */}
        <div className="py-6">
          <SimResultCards result={result} />
        </div>

        <div className="border-t border-divider" />

        {/* 액션 */}
        <div className="py-5">
          <SimActionItems items={actionItems} />
        </div>

        <div className="h-6" />
      </main>

      <EditParamsSheet
        open={isEditSheetOpen}
        params={params}
        onClose={() => setIsEditSheetOpen(false)}
        onConfirm={setParams}
      />
    </div>
  )
}

export default RetirementSimulationPage
