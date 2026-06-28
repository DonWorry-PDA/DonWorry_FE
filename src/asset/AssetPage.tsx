import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { NotificationIc, BackArrowIc } from '../common/assets/icons'
import BottomNav from '../common/components/BottomNav'
import { formatKrw, formatKrwShort } from '../common/utils/formatKrw'
import { formatMD, formatYM, calcDday } from '../common/utils/formatDate'
import pxr from '../common/utils/pxr'
import useGetAssetHub from './hooks/useGetAssetHub'
import useGetAssetComposition from './hooks/useGetAssetComposition'
import useGetAssetIncome from './hooks/useGetAssetIncome'
import useGetAssetSchedule from './hooks/useGetAssetSchedule'
import useGetAssetPension from './hooks/useGetAssetPension'
import useGetInvestmentCheck from './hooks/useGetInvestmentCheck'
import useGetProfile from '../mypage/hooks/useGetProfile'

const INCOME_EVENT_TYPES = new Set(['ETF_DIVIDEND', 'DEPOSIT_INTEREST'])

const ALLOCATION_COLORS = [
  'bg-primary',
  'bg-primary-muted',
  'bg-primary-faint',
  'bg-disabled',
  'bg-track',
] as const

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  DEPOSIT: '정기예금',
  CMA: 'CMA',
  BROKERAGE: '위탁계좌',
  IRP: 'IRP',
  PENSION_SAVING: '연금저축',
}
function accountTypeLabel(type: string): string {
  return ACCOUNT_TYPE_LABELS[type] ?? type
}

// 'YYYY-MM-DD' 문자열을 로컬 자정 기준 Date로 파싱
// new Date('YYYY-MM-DD')는 UTC 기준이라 타임존에 따라 하루가 밀릴 수 있음
function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function AssetPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const fromHome = state?.from === 'home'

  const { data: hub, isLoading: hubLoading, isError: hubError, refetch: refetchHub } = useGetAssetHub()
  const { data: composition, isLoading: compositionLoading, isError: compositionError, refetch: refetchComposition } = useGetAssetComposition()
  const { data: income, isLoading: incomeLoading, isError: incomeError, refetch: refetchIncome } = useGetAssetIncome()
  const { data: schedule, isLoading: scheduleLoading, isError: scheduleError, refetch: refetchSchedule } = useGetAssetSchedule()
  const { data: pension, isLoading: pensionLoading, isError: pensionError, refetch: refetchPension } = useGetAssetPension()
  const { data: investmentCheck } = useGetInvestmentCheck()
  const { data: profile, isLoading: profileLoading } = useGetProfile()

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const toggleGroup = (category: string) =>
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })

  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const sortedGroups = [...(composition?.groups ?? [])].sort((a, b) => b.totalAmount - a.totalAmount)

  const allocationBase =
    composition && composition.totalAsset > 0
      ? composition.totalAsset
      : sortedGroups.reduce((sum, g) => sum + Math.max(g.totalAmount, 0), 0)
  // 레이아웃 폭 계산은 소수 그대로, 라벨 표시만 반올림
  const toAllocationRatio = (amount: number) =>
    allocationBase > 0 ? (amount / allocationBase) * 100 : 0
  const toAllocationPercent = (amount: number) =>
    Math.round(toAllocationRatio(amount))

  const getSegmentMidpoint = (idx: number): number => {
    let start = 0
    for (let i = 0; i < idx; i++) {
      start += toAllocationRatio(sortedGroups[i].totalAmount)
    }
    const width = toAllocationRatio(sortedGroups[idx].totalAmount)
    return Math.min(Math.max(start + width / 2, 8), 92)
  }

  const today = new Date()
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
  const nextMonthPrefix = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-`
  const nextMonthLabel = `${nextMonth.getMonth() + 1}월`
  const nextMonthEvents = (schedule?.events ?? [])
    .filter((e) => e.date.startsWith(nextMonthPrefix))
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="flex h-dvh flex-col bg-white">
      <header className="flex h-[52px] items-center pl-6 pr-[14px]">
        {fromHome && (
          <button
            className="flex size-11 shrink-0 -ml-2 items-center justify-center"
            aria-label="뒤로 가기"
            onClick={() => navigate(-1)}
          >
            <BackArrowIc className="text-ink" width={22} height={22} />
          </button>
        )}
        <h1 className="flex-1 text-heading font-bold text-ink">자산분석</h1>
        <button
          className="flex size-11 items-center justify-center"
          aria-label="알림"
          onClick={() => navigate('/notification')}
        >
          <NotificationIc className="text-ink" width={24} height={24} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3.5 px-4 pt-1 pb-6">

          {/* ── 총자산 카드 ── */}
          {hubLoading ? (
            <div className="bg-white rounded-card-xl border border-line p-5 h-36 animate-pulse" aria-busy="true" aria-label="총자산 로딩 중" />
          ) : hubError ? (
            <div className="bg-white rounded-card-xl border border-line p-5 flex flex-col items-center gap-3 py-10" role="alert">
              <p className="text-body text-ink-sub">총자산 정보를 불러오지 못했어요</p>
              <button onClick={() => refetchHub()} className="text-sub text-primary font-semibold min-h-[44px] px-4">다시 시도</button>
            </div>
          ) : hub ? (
            <div className="bg-white rounded-card-xl border border-line px-5 py-[22px] flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-sub font-semibold text-ink-sub">총자산</span>
                <span className="text-caption text-ink-hint">오늘 기준</span>
              </div>
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
            </div>
          ) : null}

          {/* ── 내 자산 구성 카드 ── */}
          {compositionLoading ? (
            <div className="bg-white rounded-card-xl border border-line p-5 h-48 animate-pulse" aria-busy="true" aria-label="자산 구성 로딩 중" />
          ) : compositionError ? (
            <div className="bg-white rounded-card-xl border border-line p-5 flex flex-col items-center gap-3 py-10" role="alert">
              <p className="text-body text-ink-sub">자산 구성을 불러오지 못했어요</p>
              <button onClick={() => refetchComposition()} className="text-sub text-primary font-semibold min-h-[44px] px-4">다시 시도</button>
            </div>
          ) : composition ? (
            <div className="bg-white rounded-card-xl border border-line p-5 flex flex-col gap-1.5">
              <p className="text-sub font-semibold text-ink-sub">내 자산 구성</p>

              {sortedGroups.length === 0 ? (
                <p className="text-body text-ink-hint py-6 text-center">자산 정보가 없습니다</p>
              ) : (
                <>
                  {/* 비율 바 — 좌→우 스윕 채움 후 shimmer, 탭/hover 시 세그먼트 칩 표시 */}
                  <div className="pt-1.5">
                    <div
                      className="relative"
                      role="img"
                      aria-label={`자산 구성: ${sortedGroups.map((seg) => `${seg.label} ${toAllocationPercent(seg.totalAmount)}%`).join(', ')}`}
                    >
                      {activeCategory !== null && (() => {
                        const idx = sortedGroups.findIndex((s) => s.category === activeCategory)
                        if (idx === -1) return null
                        const seg = sortedGroups[idx]
                        return (
                          <div
                            key={activeCategory}
                            className="absolute top-0 z-10 pointer-events-none animate-chip-in"
                            style={{ left: `${getSegmentMidpoint(idx)}%` }}
                            aria-hidden="true"
                          >
                            <div className="relative bg-ink text-white text-caption font-semibold rounded-btn px-2.5 py-1 whitespace-nowrap select-none">
                              {seg.label} · {toAllocationPercent(seg.totalAmount)}%
                              <div
                                className="absolute left-1/2 top-full w-0 h-0"
                                style={{
                                  transform: 'translateX(-50%)',
                                  borderLeft: `${pxr(4)} solid transparent`,
                                  borderRight: `${pxr(4)} solid transparent`,
                                  borderTop: `${pxr(4)} solid var(--color-ink)`,
                                }}
                              />
                            </div>
                          </div>
                        )
                      })()}

                      <div className="animate-bar-reveal relative flex overflow-hidden rounded-badge">
                        {sortedGroups.map((seg, i) => (
                          <div
                            key={seg.category}
                            className={`h-4 cursor-pointer transition-opacity duration-150 ${
                              activeCategory !== null && activeCategory !== seg.category ? 'opacity-40' : 'opacity-100'
                            } ${ALLOCATION_COLORS[i % ALLOCATION_COLORS.length]}`}
                            style={{ width: `${toAllocationRatio(seg.totalAmount)}%` }}
                            aria-hidden="true"
                            onMouseEnter={() => setActiveCategory(seg.category)}
                            onMouseLeave={() => setActiveCategory(null)}
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveCategory((prev) => (prev === seg.category ? null : seg.category))
                            }}
                          />
                        ))}
                        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                          <div
                            className="animate-bar-shimmer absolute inset-y-0 w-[30%]"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 그룹 목록 — 비율 높은 순, 탭 토글로 계좌·보유종목 상세 표시 */}
                  <div className="flex flex-col pt-2">
                    {sortedGroups.map((seg, i) => {
                      const isExpanded = expandedGroups.has(seg.category)
                      return (
                        <div
                          key={seg.category}
                          className={`flex flex-col ${i < sortedGroups.length - 1 ? 'border-b border-divider' : ''}`}
                        >
                          {/* 그룹 헤더 — 버튼으로 토글 */}
                          <button
                            type="button"
                            className="flex items-center gap-3 py-[11px] w-full text-left"
                            onClick={() => toggleGroup(seg.category)}
                            aria-expanded={isExpanded}
                            aria-controls={`group-detail-${seg.category}`}
                          >
                            <span className={`size-[9px] shrink-0 rounded-[4.5px] ${ALLOCATION_COLORS[i % ALLOCATION_COLORS.length]}`} />
                            <p className="flex-1 text-body font-semibold text-ink">{seg.label}</p>
                            <div className="flex items-center gap-2 shrink-0">
                              <div className="flex flex-col items-end gap-0.5">
                                <p className="font-inter text-md font-bold text-ink">{formatKrwShort(seg.totalAmount)}</p>
                                <p className="text-sub text-ink-sub">{toAllocationPercent(seg.totalAmount)}%</p>
                              </div>
                              <svg
                                width="16" height="16" viewBox="0 0 16 16" fill="none"
                                aria-hidden="true"
                                className={`text-ink-hint transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                              >
                                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                          </button>

                          {/* 계좌별 상세 — 토글 시 표시 */}
                          {isExpanded && (
                            <div id={`group-detail-${seg.category}`} className="flex flex-col gap-1 pb-3 ml-[21px]">
                              {seg.accounts.map((account) => (
                                <div key={account.accountId} className="flex flex-col gap-1">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <p className="text-sub font-semibold text-ink-sub">{account.institutionName}</p>
                                      <span className="text-caption text-ink-hint bg-surface rounded-badge px-[6px] py-0.5">
                                        {accountTypeLabel(account.accountType)}
                                      </span>
                                    </div>
                                    {account.balance > 0 && account.holdings.length === 0 && (
                                      <p className="font-inter text-sub font-semibold text-ink">{formatKrwShort(account.balance)}</p>
                                    )}
                                  </div>

                                  {/* 보유 종목/상품 */}
                                  {account.holdings.map((holding) => (
                                    <div key={holding.productName} className="flex items-center justify-between pl-1 py-0.5">
                                      <p className="text-sub text-ink-hint truncate mr-3">{holding.productName}</p>
                                      <p className="font-inter text-sub text-ink-sub shrink-0">{formatKrwShort(holding.evaluationAmount)}</p>
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {investmentCheck != null && (
                    <div className="bg-surface rounded-card p-4 flex flex-col gap-2">
                      <p className="text-caption font-bold text-primary">한 줄 요약</p>
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
                className="flex w-full min-h-[44px] items-center gap-3 pt-3 px-0.5 text-left rounded-card hover:bg-surface active:bg-surface-muted transition-colors"
                aria-label="투자 건강검진 보기 — 어떤 자산이 월급이 되는지 자세히 확인"
                onClick={() => navigate('/asset/investment-checkup')}
              >
                <div className="bg-primary-tint rounded-icon size-10 shrink-0 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-primary" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="6" />
                    <path d="M20 20l-4.5-4.5" />
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
          <div className="px-1">
            <p className="text-sub font-semibold text-ink-sub">내 자산이 만드는 월 수입</p>
          </div>

          {/* ── 월 수입 카드 ── */}
          {incomeLoading ? (
            <div className="bg-white rounded-card-xl border border-line p-5 h-40 animate-pulse" aria-busy="true" aria-label="월 수입 로딩 중" />
          ) : incomeError ? (
            <div className="bg-white rounded-card-xl border border-line p-5 flex flex-col items-center gap-3 py-10" role="alert">
              <p className="text-body text-ink-sub">수입 정보를 불러오지 못했어요</p>
              <button onClick={() => refetchIncome()} className="text-sub text-primary font-semibold min-h-[44px] px-4">다시 시도</button>
            </div>
          ) : income ? (
            <div className="bg-white rounded-card-xl border border-line p-5 flex flex-col gap-4">
              <div className="flex items-baseline justify-between">
                <p className="text-sub font-semibold text-ink-sub">월 평균 들어오는 돈</p>
                <div className="flex flex-col items-end gap-0.5">
                  <p className="font-inter text-md font-bold text-primary">{formatKrw(income.accessibleIncome)}</p>
                  {income.lockedIncome > 0 && (
                    <p className="text-caption text-ink-hint">+{formatKrw(income.lockedIncome)} 비유동</p>
                  )}
                </div>
              </div>
              {income.totalUnrealizedGainLoss !== 0 && (
                <div className="flex items-baseline justify-between -mt-1">
                  <p className="text-sub text-ink-sub">평가손익</p>
                  <p className={`font-inter text-sub font-bold ${income.totalUnrealizedGainLoss > 0 ? 'text-success' : 'text-danger'}`}>
                    {income.totalUnrealizedGainLoss > 0 ? '+' : '-'}{formatKrw(Math.abs(income.totalUnrealizedGainLoss))}
                  </p>
                </div>
              )}

              <div className="border-t border-divider pt-[15px] flex flex-col">
                {income.sources.length === 0 ? (
                  <p className="text-body text-ink-hint text-center py-4">수입 출처가 없습니다</p>
                ) : (
                  income.sources.map((source) => (
                    <div key={source.label} className="flex items-center justify-between py-[7px]">
                      <div className="flex items-center gap-2">
                        <p className="text-body text-ink-sub">{source.label}</p>
                        {source.locked && (
                          <span className="text-caption text-ink-hint bg-surface rounded-badge px-[6px] py-0.5" title="연금·장기 상품으로 현재 인출이 제한된 자산이에요">비유동</span>
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
            <div className="bg-white rounded-card-xl border border-line p-5 h-36 animate-pulse" aria-busy="true" aria-label="현금 일정 로딩 중" />
          ) : scheduleError ? (
            <div className="bg-white rounded-card-xl border border-line p-5 flex flex-col items-center gap-3 py-10" role="alert">
              <p className="text-body text-ink-sub">현금 일정을 불러오지 못했어요</p>
              <button onClick={() => refetchSchedule()} className="text-sub text-primary font-semibold min-h-[44px] px-4">다시 시도</button>
            </div>
          ) : schedule ? (
            <div className="bg-white rounded-card-xl border border-line p-5 flex flex-col">
              <p className="text-sub font-semibold text-ink-sub">{nextMonthLabel} 들어올 돈</p>

              {nextMonthEvents.length === 0 ? (
                <p className="text-body text-ink-hint text-center py-8">{nextMonthLabel}에 예정된 수입이 없어요</p>
              ) : (
                nextMonthEvents.map((event, i) => (
                  <div
                    key={`${event.date}-${event.label}`}
                    className={`flex items-center gap-3 py-4 ${i < nextMonthEvents.length - 1 ? 'border-b border-divider' : ''}`}
                  >
                    <div className={`rounded-icon size-10 shrink-0 flex items-center justify-center ${INCOME_EVENT_TYPES.has(event.type) ? 'bg-primary-tint' : 'bg-surface-muted'}`}>
                      <span
                        aria-hidden="true"
                        className={`font-inter text-card font-bold leading-none ${INCOME_EVENT_TYPES.has(event.type) ? 'text-primary' : 'text-ink-sub'}`}
                      >
                        ₩
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-md font-semibold text-ink">{event.label}</p>
                        {event.estimated && (
                          <span className="text-caption text-ink-hint bg-surface rounded-badge px-[6px] py-0.5">예정</span>
                        )}
                      </div>
                      <p className="text-sub text-ink-sub">
                        {INCOME_EVENT_TYPES.has(event.type)
                          ? `${formatMD(parseLocalDate(event.date))} · ${calcDday(parseLocalDate(event.date))}`
                          : `${formatYM(parseLocalDate(event.date))} · 만기`}
                      </p>
                    </div>
                    {INCOME_EVENT_TYPES.has(event.type) ? (
                      <p className="font-inter text-md font-bold text-primary shrink-0">+{formatKrw(event.amount ?? 0)}</p>
                    ) : event.amount != null ? (
                      <span className="bg-warning-bg text-warning-text text-sub font-bold rounded-badge px-[9px] py-1 shrink-0">{formatKrw(event.amount)} 인출 가능</span>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          ) : null}

          {/* ── 만기 예정 예금 카드 ── */}
          {(() => {
            if (!schedule) return null
            const todayStart = new Date(today)
            todayStart.setHours(0, 0, 0, 0)
            const oneYearLater = new Date(todayStart)
            oneYearLater.setFullYear(todayStart.getFullYear() + 1)
            const maturities = schedule.events
              .filter((e) => e.type === 'DEPOSIT_MATURITY')
              .map((e) => ({ ...e, _date: parseLocalDate(e.date) }))
              .filter((e) => e._date >= todayStart && e._date <= oneYearLater)
              .sort((a, b) => a._date.getTime() - b._date.getTime())
            if (maturities.length === 0) return null
            return (
              <div className="bg-white rounded-card-xl border border-line p-5 flex flex-col">
                <p className="text-sub font-semibold text-ink-sub">만기 예정 예금</p>
                {maturities.map((event, i) => (
                  <div
                    key={`${event.date}-${event.label}`}
                    className={`flex items-center gap-3 py-4 ${i < maturities.length - 1 ? 'border-b border-divider' : ''}`}
                  >
                    <div className="bg-warning-bg rounded-icon size-10 shrink-0 flex items-center justify-center">
                      <span className="font-inter text-card font-bold leading-none text-warning" aria-hidden="true">D</span>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <p className="text-md font-semibold text-ink">{event.label}</p>
                      <p className="text-sub text-ink-sub">{formatYM(event._date)} · {calcDday(event._date)}</p>
                    </div>
                    {event.amount != null && (
                      <span className="bg-warning-bg text-warning-text text-sub font-bold rounded-badge px-[9px] py-1 shrink-0">
                        {formatKrwShort(event.amount)} 인출 가능
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )
          })()}

          {/* ── 연금으로 받을 재원 카드 ── */}
          {pensionLoading ? (
            <div className="bg-white rounded-card-xl border border-line p-5 h-36 animate-pulse" aria-busy="true" aria-label="연금 재원 로딩 중" />
          ) : pensionError ? (
            <div className="bg-white rounded-card-xl border border-line p-5 flex flex-col items-center gap-3 py-10" role="alert">
              <p className="text-body text-ink-sub">연금 재원을 불러오지 못했어요</p>
              <button onClick={() => refetchPension()} className="text-sub text-primary font-semibold min-h-[44px] px-4">다시 시도</button>
            </div>
          ) : pension ? (
            <div className="bg-white rounded-card-xl border border-line p-5 flex flex-col">
              <div className="flex items-baseline justify-between">
                <p className="text-sub font-semibold text-ink-sub">연금으로 받을 재원</p>
                <p className="text-caption text-ink-hint">세후 실수령액 기준</p>
              </div>

              {pension.pensions.length === 0 ? (
                <p className="text-body text-ink-hint text-center py-8">연금 재원 정보가 없습니다</p>
              ) : (
                pension.pensions.map((item, i) => (
                  <div
                    key={`${item.type}-${item.institutionName}`}
                    className={`flex items-start justify-between py-[15px] ${
                      i < pension.pensions.length - 1 ? 'border-b border-divider' : 'pb-5'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <p className="text-md text-ink-sub">{item.label}</p>
                      <p className="text-sub text-ink-hint">
                        {item.institutionName ?? `${item.startAge}세부터 수령`}
                      </p>
                      {item.currentBalance != null && (
                        <p className="font-inter text-sub text-ink-hint">
                          잔액 {formatKrwShort(item.currentBalance)}
                        </p>
                      )}
                    </div>
                    <p className="font-inter text-md font-semibold text-ink shrink-0">
                      월 {formatKrwShort(item.expectedMonthlyNet)}{item.estimated ? <span className="text-ink-hint font-normal"> *</span> : null}
                    </p>
                  </div>
                ))
              )}

              {pension.pensions.length > 0 && !profileLoading && (() => {
                const currentAge = profile?.age ?? null
                const byAge = [...pension.pensions].sort((a, b) => a.startAge - b.startAge)
                const receiving = currentAge != null ? byAge.filter((p) => p.startAge <= currentAge) : []
                const upcoming = currentAge != null ? byAge.filter((p) => p.startAge > currentAge) : byAge

                // 전부 수령 중이면 타임라인 없이 요약만
                if (currentAge != null && upcoming.length === 0) {
                  return (
                    <div className="border-t border-divider mt-1 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="size-5 rounded-full bg-success-bg flex items-center justify-center shrink-0">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                              <path d="M2 5l2 2 4-4" stroke="#069A53" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <p className="text-sub text-ink-sub">모든 연금 수령 중</p>
                        </div>
                        <p className="font-inter text-sub font-bold text-primary">
                          월 {formatKrwShort(pension.totalMonthlyPensionNet)}
                        </p>
                      </div>
                    </div>
                  )
                }

                return (
                  <div className="border-t border-divider mt-1 pt-4 flex flex-col gap-[14px]">
                    <p className="text-caption text-ink-hint">연금 개시 타임라인</p>

                    {receiving.map((item) => (
                      <div key={`${item.type}-${item.startAge}`} className="flex items-center gap-3">
                        <div className="bg-success-bg rounded-btn px-2.5 py-1 shrink-0 flex items-center gap-1">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                            <path d="M2 5l2 2 4-4" stroke="#069A53" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="font-inter text-caption font-bold text-success">수령 중</p>
                        </div>
                        <p className="flex-1 text-sub text-ink-sub min-w-0 truncate">{item.label}</p>
                        <p className="font-inter text-sub font-semibold text-success shrink-0">
                          +{formatKrwShort(item.expectedMonthlyNet)}/월{item.estimated ? <span className="text-success/60 font-normal"> *</span> : null}
                        </p>
                      </div>
                    ))}

                    {upcoming.map((item) => (
                      <div key={`${item.type}-${item.startAge}`} className="flex items-center gap-3">
                        <div className="bg-primary-tint rounded-btn px-2.5 py-1 shrink-0">
                          <p className="font-inter text-caption font-bold text-primary">{item.startAge}세</p>
                        </div>
                        <p className="flex-1 text-sub text-ink-sub min-w-0 truncate">{item.label}</p>
                        <p className="font-inter text-sub font-semibold text-ink shrink-0">
                          +{formatKrwShort(item.expectedMonthlyNet)}/월{item.estimated ? <span className="text-ink-hint font-normal"> *</span> : null}
                        </p>
                      </div>
                    ))}

                    <div className="flex items-center justify-between pt-3 border-t border-divider">
                      <p className="text-sub text-ink-hint">
                        {receiving.length > 0 ? '모든 연금 개시 후' : '전체 개시 후'}
                      </p>
                      <p className="font-inter text-sub font-bold text-primary">
                        월 {formatKrwShort(pension.totalMonthlyPensionNet)}
                      </p>
                    </div>
                  </div>
                )
              })()}

              {pension.pensions.length > 0 && (
                <div className="bg-surface rounded-card px-4 py-[14px] mt-2 flex flex-col gap-1">
                  {pension.pensions.some((p) => p.estimated) && (
                    <p className="text-sub text-ink-hint">
                      * IRP·연금저축 예상액은 연 3% 수익률, 83세까지 수령 기준 추정치
                    </p>
                  )}
                  <p className="text-sub text-ink-sub">
                    <span className="font-semibold text-ink">55세 이후</span> 수령 가능 · 세율 3.3–5.5% 우대
                  </p>
                </div>
              )}
            </div>
          ) : null}

        </div>
      </main>

      <BottomNav />
    </div>
  )
}

export default AssetPage