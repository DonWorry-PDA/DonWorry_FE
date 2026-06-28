import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'
import { formatKrw, formatWon } from '../common/utils/formatKrw'
import useGetInvestmentCheck from './hooks/useGetInvestmentCheck'
import type { AssetRole, RoleContribution } from './types/investmentCheck'

// 역할별 색상. 점·구성막대·범례에서 공유한다. (기존 cashflowType 토큰 재활용)
// GROWTH는 dot-off(#dde2e9)가 막대·점에서 거의 안 보여 disabled(#c4cad4) 중간 회색으로 올림.
const ROLE_DOT: Record<AssetRole, string> = {
  CASHFLOW: 'bg-success',
  GROWTH: 'bg-disabled',
  IDLE: 'bg-event-interest',
  PENSION: 'bg-event-maturity',
}

// 역할 note FE 오버라이드. 연금은 BE가 "55세까지" 같은 나이 기준 문구를 내려줄 수 있어
// 이미 55세를 지난 사용자에게 틀린 말이 된다(#170). 나이 비의존 문구로 고정한다.
const NOTE_OVERRIDE: Partial<Record<AssetRole, string>> = {
  PENSION: '노후를 위해 묶인 돈',
}

// roles에서 "세 줄 요약"을 규칙 생성한다. CASHFLOW 우선, 그 외는 금액 큰 순으로 최대 3줄.
function buildSummaryLines(roles: RoleContribution[]): string[] {
  const lines: string[] = []

  const cashflow = roles.find((r) => r.role === 'CASHFLOW')
  if (cashflow && cashflow.monthlyCashflow > 0) {
    lines.push(`현금흐름 자산에서 매달 ${formatWon(cashflow.monthlyCashflow)}이 들어와요.`)
  }

  const rest = roles
    .filter((r) => r.role !== 'CASHFLOW')
    .sort((a, b) => b.amount - a.amount)

  for (const role of rest) {
    if (role.role === 'IDLE') {
      lines.push(`잠자는 돈 ${formatKrw(role.amount)}은 아직 일하지 않고 쉬고 있어요.`)
    } else if (role.role === 'GROWTH') {
      // 개별주에서도 실배당이 나오면 함께 보여준다(0이면 자본차익 직무만).
      lines.push(
        role.monthlyCashflow > 0
          ? `개별주 ${formatKrw(role.amount)}에서도 매달 ${formatWon(role.monthlyCashflow)} 배당이 나와요.`
          : `개별주 ${formatKrw(role.amount)}은 자본차익을 노리는 돈이에요.`,
      )
    } else if (role.role === 'PENSION') {
      // 나이 비의존 문구. 55세를 이미 지난 사용자에게도 틀리지 않게 한다(#170).
      lines.push(`연금 ${formatKrw(role.amount)}은 노후를 위해 따로 묶여 있어요.`)
    }
  }

  return lines.slice(0, 3)
}

function InvestmentCheckupPage() {
  const navigate = useNavigate()
  const { data, isLoading, isFetching, refetch } = useGetInvestmentCheck()
  // "지금 월 배당" 계산 기준(보유 개별주 평가액 × 시가배당률, 세후) 펼침 여부.
  const [showDividendBasis, setShowDividendBasis] = useState(false)

  return (
    <div className="flex h-dvh flex-col bg-white">
      <AppBar title="투자 건강검진" onBack={() => navigate(-1)} />

      {isLoading ? (
        <main className="flex-1 overflow-y-auto px-6 pb-6" role="status" aria-live="polite">
          <span className="sr-only">투자 건강검진 결과를 불러오는 중입니다.</span>
          <div className="mt-2 h-16 animate-pulse rounded-card-lg bg-surface-muted" />
          <div className="mt-4 h-24 animate-pulse rounded-card-lg bg-surface-muted" />
          <div className="mt-6 h-60 animate-pulse rounded-card-lg bg-surface-muted" />
        </main>
      ) : !data ? (
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-[22px]">
          <p className="text-body text-ink-sub text-center leading-[1.6]">
            투자 건강검진 결과를 불러오지 못했어요.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-btn border border-line px-5 py-2.5 text-body font-semibold text-ink disabled:opacity-50"
          >
            {isFetching ? '불러오는 중…' : '다시 시도'}
          </button>
        </main>
      ) : (
        <>
          <main className="flex-1 overflow-y-auto px-6 pb-6">
            <h2 className="text-card text-ink mt-2 font-bold leading-snug whitespace-pre-line">
              갖고 계신 자산 중{'\n'}
              <span className="text-primary">{data.cashflowAssetRatio}%만 월급을 만들고 있어요</span>
            </h2>

            {/* 자산 구성 막대 — 헤드라인 %를 한눈에 보이게 시각화. 역할 점·범례와 색 공유 */}
            {data.roles.length > 0 && (
              <>
                <div className="mt-4 flex h-3 overflow-hidden rounded-full">
                  {data.roles.map((role) => (
                    <span
                      key={role.role}
                      className={ROLE_DOT[role.role]}
                      style={{ width: `${role.ratio}%` }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  {data.roles.map((role) => (
                    <span key={role.role} className="text-caption text-ink-sub flex items-center gap-1">
                      <span className={`size-1.5 rounded-full ${ROLE_DOT[role.role]}`} />
                      {role.label}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* 세 줄 요약 (roles 규칙 생성) */}
            {(() => {
              const summaryLines = buildSummaryLines(data.roles)
              if (summaryLines.length === 0) return null
              return (
                <div className="rounded-card-lg bg-primary-tint mt-6 p-4">
                  <p className="text-body text-primary mb-2 font-bold">✦ 세 줄 요약</p>
                  <ul className="flex flex-col gap-1.5">
                    {summaryLines.map((line) => (
                      <li key={line} className="text-body text-ink-sub flex gap-1.5">
                        <span className="text-ink-hint">·</span>
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })()}

            {/* 자산 역할별 현금흐름 기여 */}
            <p className="text-body text-ink-hint mt-6 mb-2">자산 역할별 현금흐름 기여</p>
            <div className="rounded-card-lg border-line flex flex-col border bg-white">
              {data.roles.map((role, i) => (
                <div
                  key={role.role}
                  className={`flex items-center gap-3 px-4 py-3.5 ${i > 0 ? 'border-divider border-t' : ''}`}
                >
                  <span className={`size-2 shrink-0 rounded-full ${ROLE_DOT[role.role]}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-md text-ink font-bold">
                      {role.label}
                      <span className="text-caption text-ink-hint ml-1.5 font-normal">{role.ratio}%</span>
                    </p>
                    <p className="text-caption text-ink-hint mt-0.5">
                      {role.monthlyCashflow > 0
                        ? `월 ${formatWon(role.monthlyCashflow)} 유입`
                        : (NOTE_OVERRIDE[role.role] ?? role.note)}
                    </p>
                  </div>
                  <span className="text-md text-ink shrink-0 font-bold">{formatKrw(role.amount)}</span>
                </div>
              ))}
            </div>

            {/* 성장 자산 블록 (개별주 보유 시에만) */}
            {data.growthAsset &&
              (() => {
                const g = data.growthAsset
                // 델타 ≤ 0 = 이미 고배당 종목 → 옮기면 손해. 권유 톤이 아니라 유지 톤으로 분기.
                const isLoss = g.deltaMonthlyDividend <= 0
                return (
                  <div className="rounded-card-lg border-line mt-6 border bg-white p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-body text-ink font-bold">내가 담은 개별주</span>
                      <span className="text-md text-ink font-bold">{formatKrw(g.amount)}</span>
                    </div>

                    {/* 한 종목 쏠림 */}
                    <div className="border-line mt-3 flex items-center justify-between border-t pt-3">
                      <span className="text-body text-ink-hint">한 종목 쏠림</span>
                      <span className="text-body text-ink font-bold">
                        {g.topStockName} · {g.concentrationLevel}
                      </span>
                    </div>

                    {/* 섹터 쏠림 — 단일종목이 낮아도 같은 섹터면 위험은 집중(별개 항목) */}
                    {g.topSector && (
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-body text-ink-hint">섹터 쏠림</span>
                        <span className="text-body text-ink font-bold">
                          {g.topSector} · {g.sectorConcentrationLevel}
                        </span>
                      </div>
                    )}

                    {/* 현재 배당 → 배당ETF 전환 시 배당 (before/after, 실배당 기반) */}
                    <div className="bg-surface-muted rounded-card mt-3 px-3 py-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-caption text-ink-hint flex items-center">
                          지금 월 배당
                          <button
                            type="button"
                            onClick={() => setShowDividendBasis((v) => !v)}
                            aria-expanded={showDividendBasis}
                            aria-controls="dividend-basis-note"
                            className="border-line text-ink-hint ml-1.5 rounded-full border px-2 py-0.5 text-[11px] leading-none"
                          >
                            자세히
                          </button>
                        </span>
                        <span className="text-md text-ink font-bold">
                          {formatWon(g.currentMonthlyDividend)}
                        </span>
                      </div>
                      {showDividendBasis && (
                        <p
                          id="dividend-basis-note"
                          className="text-caption text-ink-hint mt-1.5 leading-[1.5]"
                        >
                          보유 개별주의 평가액 × 시가배당률로 계산한 월 배당이에요. 세금(15.4%)을 뗀 실수령
                          기준이에요.
                        </p>
                      )}
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-caption text-ink-hint">배당ETF로 옮기면</span>
                        <span className="text-md text-ink font-bold">
                          {formatWon(g.convertedMonthlyDividend)}
                          <span
                            className={`text-caption ml-1.5 font-bold ${isLoss ? 'text-ink-sub' : 'text-success'}`}
                          >
                            ({g.deltaMonthlyDividend > 0 ? '+' : ''}
                            {formatWon(g.deltaMonthlyDividend)})
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* suggestion 문구는 BE가 델타 부호로 분기해 내려줌. 아이콘·색만 자체 분기. */}
                    <p
                      className={`text-caption mt-3 leading-[1.6] ${isLoss ? 'text-ink-sub' : 'text-primary'}`}
                    >
                      {isLoss ? '⚠️' : '💡'} {g.suggestion}
                    </p>
                  </div>
                )
              })()}

            {/* 분배 데이터 공백 안내 — 현금흐름 역할 금액엔 잡혔지만 월 분배 데이터가 없어
                monthlyCashflow에 반영되지 않은 보유. 비난·추정 없이 현황만 차분히 안내한다. */}
            {data.uncoveredCashflow &&
              data.uncoveredCashflow.productNames.length > 0 && (
                <div className="rounded-card-lg bg-surface-muted mt-6 p-4">
                  <p className="text-body text-ink-sub font-bold">분배 데이터 공백 안내</p>
                  <p className="text-caption text-ink-hint mt-1.5 leading-[1.6]">
                    아래 자산 {formatKrw(data.uncoveredCashflow.amount)}은 분배 데이터가 없어 현금흐름에
                    반영되지 않았어요.
                  </p>
                  <ul className="mt-2.5 flex flex-col gap-1">
                    {data.uncoveredCashflow.productNames.map((name, i) => (
                      <li key={`${name}-${i}`} className="text-caption text-ink-sub flex gap-1.5">
                        <span className="text-ink-hint">·</span>
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </main>

          <StickyFooter>
            <Button onClick={() => navigate('/paycheck-plan/assets')}>이 자산으로 월급 만들어보기</Button>
          </StickyFooter>
        </>
      )}
    </div>
  )
}

export default InvestmentCheckupPage
