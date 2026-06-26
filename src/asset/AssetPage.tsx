import { useNavigate } from 'react-router-dom'
import { BackArrowIc, NotificationIc } from '../common/assets/icons'
import { formatKrw, formatKrwShort } from '../common/utils/formatKrw'
import { formatMD, formatYM, calcDday } from '../common/utils/formatDate'
import useGetAssetHub from './hooks/useGetAssetHub'
import useGetAssetComposition from './hooks/useGetAssetComposition'
import useGetAssetIncome from './hooks/useGetAssetIncome'
import useGetAssetSchedule from './hooks/useGetAssetSchedule'
import useGetAssetPension from './hooks/useGetAssetPension'
import useGetInvestmentCheck from './hooks/useGetInvestmentCheck'
import type { AssetAccount } from './types/assetAnalysis'

const ALLOCATION_COLORS = [
  'bg-primary',
  'bg-primary-muted',
  'bg-primary-faint',
  'bg-disabled',
  'bg-track',
] as const

function buildSubLabel(accounts: AssetAccount[]): string {
  const names = accounts.map((a) => a.institutionName)
  if (names.length <= 2) return names.join(' · ')
  return `${names.slice(0, 2).join(' · ')} 외 ${names.length - 2}개`
}

function AssetPage() {
  const navigate = useNavigate()

  const { data: hub, isLoading: hubLoading, isError: hubError, refetch: refetchHub } = useGetAssetHub()
  const { data: composition, isLoading: compositionLoading, isError: compositionError, refetch: refetchComposition } = useGetAssetComposition()
  const { data: income, isLoading: incomeLoading, isError: incomeError, refetch: refetchIncome } = useGetAssetIncome()
  const { data: schedule, isLoading: scheduleLoading, isError: scheduleError, refetch: refetchSchedule } = useGetAssetSchedule()
  const { data: pension, isLoading: pensionLoading, isError: pensionError, refetch: refetchPension } = useGetAssetPension()
  const { data: investmentCheck } = useGetInvestmentCheck()

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

          {/* ── 내 자산 구성 카드 ── */}
          {compositionLoading ? (
            <div className="bg-white rounded-card-xl border border-line p-5 h-48 animate-pulse" />
          ) : compositionError ? (
            <div className="bg-white rounded-card-xl border border-line p-5 flex flex-col items-center gap-3 py-10">
              <p className="text-body text-ink-sub">자산 구성을 불러오지 못했어요</p>
              <button onClick={() => refetchComposition()} className="text-sub text-primary font-semibold">다시 시도</button>
            </div>
          ) : composition ? (
            <div className="bg-white rounded-card-xl border border-line p-5 flex flex-col gap-[6px]">
              <p className="text-sub font-semibold text-ink-sub">내 자산 구성</p>

              {composition.allocation.length === 0 ? (
                <p className="text-body text-ink-hint py-6 text-center">자산 정보가 없습니다</p>
              ) : (
                <>
                  <div className="flex overflow-hidden rounded-badge pt-[6px]">
                    {composition.allocation.map((seg, i) => (
                      <div
                        key={seg.category}
                        className={`h-4 ${ALLOCATION_COLORS[i % ALLOCATION_COLORS.length]}`}
                        style={{ width: `${Math.round((seg.totalAmount / composition.totalAsset) * 100)}%` }}
                      />
                    ))}
                  </div>

                  <div className="flex flex-col gap-0.5 pt-2">
                    {composition.allocation.map((seg, i) => (
                      <div
                        key={seg.category}
                        className={`flex items-center gap-3 py-[11px] ${i < composition.allocation.length - 1 ? 'border-b border-divider' : ''}`}
                      >
                        <span className={`size-[9px] shrink-0 rounded-[4.5px] ${ALLOCATION_COLORS[i % ALLOCATION_COLORS.length]}`} />
                        <div className="flex-1 min-w-0 flex flex-col gap-0.5 pl-0.5">
                          <p className="text-body font-semibold text-ink">{seg.label}</p>
                          <p className="text-sub text-ink-sub">{buildSubLabel(seg.accounts)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-0.5 shrink-0">
                          <p className="font-inter text-md font-bold text-ink">{formatKrwShort(seg.totalAmount)}</p>
                          <p className="text-body text-ink-sub">{Math.round((seg.totalAmount / composition.totalAsset) * 100)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {investmentCheck != null && (
                    <div className="bg-surface rounded-card p-4 flex flex-col gap-2">
                      <p className="text-caption font-bold text-primary">✦ 한 줄 요약</p>
                      <p className="text-body text-ink-sub leading-relaxed">
                        지금은 자산의{' '}
                        <span className="font-bold text-ink">{Math.round(investmentCheck.cashflowAssetRatio)}%만 매달 현금을 만들고</span>{' '}
                        있어요.
                      </p>
                    </div>
                  )}
                </>
              )}

              <button
                className="flex w-full items-center gap-3 pt-[13px] px-0.5 text-left"
                aria-label="투자 건강검진 보기 — 어떤 자산이 월급이 되는지 자세히 확인"
                onClick={() => navigate('/investment-checkup')}
              >
                <div className="bg-primary-tint rounded-icon size-10 shrink-0 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="text-primary">
                    <path d="M9 14V4M9 4L4 9M9 4L14 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <p className="text-body font-semibold text-ink">투자 건강검진 보기</p>
                  <p className="text-sub text-ink-sub">어떤 자산이 월급이 되는지 자세히</p>
                </div>
                <span className="text-card text-disabled shrink-0" aria-hidden="true">›</span>
              </button>
            </div>
          ) : null}

          {/* ── 섹션 레이블 ── */}
          <div className="px-1 pt-1.5">
            <p className="text-sub font-semibold text-ink-sub">내 자산이 만드는 월 수입</p>
          </div>

          {/* ── 월 수입 카드 ── */}
          {incomeLoading ? (
            <div className="bg-white rounded-card-xl border border-line p-5 h-40 animate-pulse" />
          ) : incomeError ? (
            <div className="bg-white rounded-card-xl border border-line p-5 flex flex-col items-center gap-3 py-10">
              <p className="text-body text-ink-sub">수입 정보를 불러오지 못했어요</p>
              <button onClick={() => refetchIncome()} className="text-sub text-primary font-semibold">다시 시도</button>
            </div>
          ) : income ? (
            <div className="bg-white rounded-card-xl border border-line p-5 flex flex-col gap-4">
              <div className="flex items-baseline justify-between">
                <p className="text-sub font-semibold text-ink-sub">월 평균 들어오는 돈</p>
                <p className="font-inter text-md font-bold text-primary">{formatKrw(income.totalMonthlyIncome)}</p>
              </div>

              <div className="border-t border-divider pt-[15px] flex flex-col">
                {income.sources.length === 0 ? (
                  <p className="text-body text-ink-hint text-center py-4">수입 출처가 없습니다</p>
                ) : (
                  income.sources.map((source) => (
                    <div key={source.label} className="flex items-center justify-between py-[7px]">
                      <div className="flex items-center gap-2">
                        <p className="text-body text-ink-sub">{source.label}</p>
                        {source.locked && (
                          <span className="text-caption text-ink-hint bg-surface rounded-badge px-[6px] py-0.5">잠김</span>
                        )}
                      </div>
                      <p className="font-inter text-md font-semibold text-ink">월 {formatKrw(source.amount)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : null}

          {/* ── 다가오는 현금 일정 카드 ── */}
          {scheduleLoading ? (
            <div className="bg-white rounded-card-xl border border-line p-5 h-36 animate-pulse" />
          ) : scheduleError ? (
            <div className="bg-white rounded-card-xl border border-line p-5 flex flex-col items-center gap-3 py-10">
              <p className="text-body text-ink-sub">현금 일정을 불러오지 못했어요</p>
              <button onClick={() => refetchSchedule()} className="text-sub text-primary font-semibold">다시 시도</button>
            </div>
          ) : schedule ? (
            <div className="bg-white rounded-card-xl border border-line p-5 flex flex-col">
              <p className="text-sub font-semibold text-ink-sub">다가오는 현금 일정</p>

              {schedule.events.length === 0 ? (
                <p className="text-body text-ink-hint text-center py-8">다가오는 현금 일정이 없어요</p>
              ) : (
                schedule.events.map((event, i) => (
                  <div
                    key={`${event.date}-${event.label}`}
                    className={`flex items-center gap-3 py-4 ${i < schedule.events.length - 1 ? 'border-b border-divider' : ''}`}
                  >
                    <div className={`rounded-icon size-10 shrink-0 flex items-center justify-center ${event.type === 'income' ? 'bg-primary-tint' : 'bg-surface-muted'}`}>
                      {event.type === 'income' ? (
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="text-primary">
                          <path d="M9 14V4M9 4L4 9M9 4L14 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="text-ink-sub">
                          <path d="M9 4V14M9 14L4 9M9 14L14 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-md font-semibold text-ink">{event.label}</p>
                        {event.estimated && (
                          <span className="text-caption text-ink-hint bg-surface rounded-badge px-[6px] py-0.5">예정</span>
                        )}
                      </div>
                      <p className="text-sub text-ink-sub">
                        {event.type === 'income'
                          ? `${formatMD(new Date(event.date))} · ${calcDday(new Date(event.date))}`
                          : `${formatYM(new Date(event.date))} · ${formatKrw(event.amount)} 풀림`}
                      </p>
                    </div>
                    {event.type === 'income' ? (
                      <p className="font-inter text-md font-bold text-primary shrink-0">+{formatKrw(event.amount)}</p>
                    ) : (
                      <span className="bg-warning-bg text-warning-text text-sub font-bold rounded-badge px-[9px] py-1 shrink-0">묶임 해제</span>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : null}

          {/* ── 연금으로 받을 재원 카드 ── */}
          {pensionLoading ? (
            <div className="bg-white rounded-card-xl border border-line p-5 h-36 animate-pulse" />
          ) : pensionError ? (
            <div className="bg-white rounded-card-xl border border-line p-5 flex flex-col items-center gap-3 py-10">
              <p className="text-body text-ink-sub">연금 재원을 불러오지 못했어요</p>
              <button onClick={() => refetchPension()} className="text-sub text-primary font-semibold">다시 시도</button>
            </div>
          ) : pension ? (
            <div className="bg-white rounded-card-xl border border-line p-5 flex flex-col">
              <p className="text-sub font-semibold text-ink-sub">연금으로 받을 재원</p>

              {pension.pensions.length === 0 ? (
                <p className="text-body text-ink-hint text-center py-8">연금 재원 정보가 없습니다</p>
              ) : (
                pension.pensions.map((item, i) => (
                  <div
                    key={`${item.type}-${item.institutionName}`}
                    className={`flex items-baseline justify-between py-[15px] ${
                      i < pension.pensions.length - 1 ? 'border-b border-divider' : 'pb-5'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <p className="text-md text-ink-sub">{item.label}</p>
                      <p className="text-sub text-ink-hint">{item.institutionName}</p>
                    </div>
                    <p className="font-inter text-md font-semibold text-ink">{formatKrw(item.currentBalance)}</p>
                  </div>
                ))
              )}

              <div className="bg-surface rounded-card px-4 py-[14px]">
                <p className="text-sub text-ink-sub leading-relaxed">
                  <span className="font-bold text-ink">55세 이후</span> 연금으로 수령 가능 · 연금 수령 시 세율
                  <br />
                  3.3~5.5%로 낮아져요.
                </p>
              </div>
            </div>
          ) : null}

        </div>
      </main>
    </div>
  )
}

export default AssetPage
