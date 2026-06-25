import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '@/common/components/AppBar'
import Button from '@/common/components/Button'
import StickyFooter from '@/common/components/StickyFooter'
import RateChips from './components/RateChips'
import YearChips from './components/YearChips'
import DeferDetailCard from './components/DeferDetailCard'
import ComparisonTable from './components/ComparisonTable'
import useGetPensionDefer from './hooks/useGetPensionDefer'
import { buildMockResponse } from './mock/pensionDefer'

function PensionDeferPage() {
  const navigate = useNavigate()
  const [selectedRate, setSelectedRate] = useState(70)
  const [selectedYears, setSelectedYears] = useState(5)

  const { data: apiData, isLoading } = useGetPensionDefer(selectedRate, selectedYears)
  if (import.meta.env.DEV && !apiData && !isLoading) {
    console.warn('[PensionDeferPage] API 데이터 없음 — 목 데이터로 폴백')
  }
  const data = apiData ?? buildMockResponse(selectedRate, selectedYears)

  return (
    <div className="flex flex-col bg-white h-dvh">
      <AppBar title="국민연금 연기 비교" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto">
        {/* 소개 텍스트 */}
        <div className="px-6 pt-4 pb-5">
          <p className="text-body text-ink-sub leading-[1.6]">
            얼마나 미룰지 비율로 정할 수 있어요.{' '}
            <br />
            미루는 동안은 자산으로 메워요.
          </p>
        </div>

        {/* 연기율 선택 (우측 페이드로 스크롤 가능 암시) */}
        <div className="relative">
          <RateChips selected={selectedRate} onChange={setSelectedRate} />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent" />
        </div>

        {/* 연수 선택 */}
        <div className="mt-3">
          <YearChips
            selected={selectedYears}
            onChange={setSelectedYears}
            disabled={selectedRate === 0}
          />
        </div>

        {/* 상세 카드 + 비교 테이블 */}
        <div className="mt-5 flex flex-col gap-6">
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <>
              <DeferDetailCard data={data.selected} />

              <div className="flex flex-col gap-3">
                <p className="px-5 text-md font-bold text-ink">연기율별 비교</p>
                <ComparisonTable rows={data.comparisonTable} selectedRate={selectedRate} />
              </div>

              {/* 조언 박스 */}
              <div className="mx-5 rounded-card bg-surface px-4 py-[14px]">
                <p className="text-sub text-ink-sub leading-[1.6]">{data.selected.insight}</p>
              </div>
            </>
          )}
        </div>

        <div className="h-6" />
      </main>

      <StickyFooter>
        <Button onClick={() => navigate('/paycheck-plan/consult')}>
          이 비교 들고 상담 신청
        </Button>
      </StickyFooter>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div role="status" aria-label="연금 정보 불러오는 중" className="flex flex-col gap-6 px-5 animate-pulse">
      <div className="rounded-card-lg border-2 border-line p-5 flex flex-col gap-4">
        <div className="h-5 w-40 rounded bg-surface-muted" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-28 rounded bg-surface-muted" />
            <div className="h-4 w-24 rounded bg-surface-muted" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-[46px] rounded-card bg-surface" />
        ))}
      </div>
    </div>
  )
}

export default PensionDeferPage
