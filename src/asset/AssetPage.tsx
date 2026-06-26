import { useNavigate } from 'react-router-dom'
import { BackArrowIc, NotificationIc } from '../common/assets/icons'
import { formatKrw, formatKrwShort } from '../common/utils/formatKrw'
import useGetAssetHub from './hooks/useGetAssetHub'
import useGetAssetComposition from './hooks/useGetAssetComposition'
import useGetAssetIncome from './hooks/useGetAssetIncome'
import useGetAssetSchedule from './hooks/useGetAssetSchedule'
import useGetAssetPension from './hooks/useGetAssetPension'
import useGetInvestmentCheck from './hooks/useGetInvestmentCheck'

const ALLOCATION_COLORS = [
  'bg-primary',
  'bg-primary-muted',
  'bg-primary-faint',
  'bg-disabled',
  'bg-track',
] as const

function AssetPage() {
  const navigate = useNavigate()

  const { data: hub, isLoading: hubLoading, isError: hubError, refetch: refetchHub } = useGetAssetHub()
  const { data: _composition, isLoading: _compositionLoading, isError: _compositionError, refetch: _refetchComposition } = useGetAssetComposition()
  const { data: income, isLoading: incomeLoading, isError: _incomeError, refetch: _refetchIncome } = useGetAssetIncome()
  const { data: _schedule, isLoading: _scheduleLoading, isError: _scheduleError, refetch: _refetchSchedule } = useGetAssetSchedule()
  const { data: _pension, isLoading: _pensionLoading, isError: _pensionError, refetch: _refetchPension } = useGetAssetPension()
  const { data: _investmentCheck } = useGetInvestmentCheck()

  // suppress unused warning — referenced by Tasks 4-7
  void ALLOCATION_COLORS
  void formatKrwShort

  return (
    <div className="flex h-dvh flex-col bg-white">
      <header className="flex h-[52px] shrink-0 items-center gap-2 px-6 w-full">
        <button
          className="flex size-7 shrink-0 items-center justify-center"
          aria-label="뒤로 가기"
          onClick={() => navigate(-1)}
        >
          <BackArrowIc className="text-ink" width={22} height={22} />
        </button>
        <h1 className="text-card font-bold text-ink flex-1">자산분석</h1>
        <button
          className="flex size-7 shrink-0 items-center justify-center"
          aria-label="알림"
          onClick={() => navigate('/notification')}
        >
          <NotificationIc className="text-ink" width={22} height={22} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-[14px] px-4 pt-1 pb-6">

          {/* ── 총자산 카드 ── */}
          {hubLoading ? (
            <div className="bg-white rounded-card-xl border border-line p-5 h-36 animate-pulse" />
          ) : hubError ? (
            <div className="bg-white rounded-card-xl border border-line p-5 flex flex-col items-center gap-3 py-10">
              <p className="text-body text-ink-sub">총자산 정보를 불러오지 못했어요</p>
              <button onClick={() => refetchHub()} className="text-sub text-primary font-semibold">다시 시도</button>
            </div>
          ) : hub ? (
            <div className="bg-white rounded-card-xl border border-line px-5 py-[22px] flex flex-col gap-1">
              <span className="text-sub font-semibold text-ink-sub">총자산</span>
              <div className="pt-0.5">
                <p className="font-inter text-jumbo font-bold text-ink leading-tight tracking-tight">
                  {formatKrw(hub.totalAsset)}
                </p>
              </div>
              {hub.changeAmount != null && hub.changeDirection !== 'FLAT' && (
                <div className="flex items-center gap-[6px]">
                  <span
                    className={`text-sub font-bold rounded-badge px-[9px] py-1 ${
                      hub.changeDirection === 'UP' ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'
                    }`}
                  >
                    이번 달 {hub.changeDirection === 'UP' ? '+' : '-'}{formatKrw(Math.abs(hub.changeAmount))} {hub.changeDirection === 'UP' ? '↑' : '↓'}
                  </span>
                </div>
              )}
              <div className="border-t border-divider flex items-start pt-[17px] mt-2">
                <div className="flex-1 flex flex-col gap-1">
                  <p className="text-caption text-ink-hint">평가손익</p>
                  {incomeLoading ? (
                    <div className="h-5 w-20 bg-track rounded animate-pulse" />
                  ) : income ? (
                    <p className={`text-md font-bold ${income.totalUnrealizedGainLoss >= 0 ? 'text-success' : 'text-danger'}`}>
                      {income.totalUnrealizedGainLoss >= 0 ? '+' : ''}{formatKrw(income.totalUnrealizedGainLoss)}
                    </p>
                  ) : null}
                </div>
                <div className="border-l border-divider flex-1 flex flex-col gap-1 pl-[17px]">
                  <p className="text-caption text-ink-hint">배당·이자 수입</p>
                  {incomeLoading ? (
                    <div className="h-5 w-20 bg-track rounded animate-pulse" />
                  ) : income ? (
                    <p className="text-md font-bold text-success">+{formatKrw(income.totalMonthlyIncome)}</p>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          {/* ── 내 자산 구성 카드 — Task 4에서 구현 ── */}

          {/* ── 섹션 레이블 ── */}
          <div className="px-1 pt-1.5">
            <p className="text-sub font-semibold text-ink-sub">내 자산이 만드는 월 수입</p>
          </div>

          {/* ── 월 수입 카드 — Task 5에서 구현 ── */}

          {/* ── 현금 일정 카드 — Task 6에서 구현 ── */}

          {/* ── 연금 재원 카드 — Task 7에서 구현 ── */}

        </div>
      </main>
    </div>
  )
}

export default AssetPage
