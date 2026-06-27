import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import useGetMonthlyReport from './hooks/useGetMonthlyReport'

function toYearMonth(ym: string) {
  const [y, m] = ym.split('-')
  return `${y}년 ${parseInt(m)}월`
}

function toMan(val: number) {
  return Math.round(val / 10_000).toLocaleString('ko-KR')
}

function prevMonth(ym: string) {
  const [y, m] = ym.split('-').map(Number)
  const d = new Date(y, m - 2)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function nextMonth(ym: string) {
  const [y, m] = ym.split('-').map(Number)
  const d = new Date(y, m)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function currentYearMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}


function MonthlyReportPage() {
  const navigate = useNavigate()
  const [month, setMonth] = useState(currentYearMonth)
  const { data, isLoading, isError } = useGetMonthlyReport(month)

  const isCurrentMonth = month === currentYearMonth()

  return (
    <div className="flex h-dvh flex-col bg-white">
      <AppBar title="월간 리포트" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto px-6 pb-8">
        {/* 월 선택 */}
        <div className="flex items-center justify-center gap-6 py-2">
          <button
            aria-label="이전 달"
            onClick={() => setMonth(prevMonth(month))}
            className="text-ink-sub text-md px-2"
          >
            ‹
          </button>
          <span className="text-md text-ink font-bold">{toYearMonth(month)}</span>
          <button
            aria-label="다음 달"
            onClick={() => setMonth(nextMonth(month))}
            disabled={isCurrentMonth}
            className="text-md px-2 disabled:text-disabled"
          >
            ›
          </button>
        </div>

        {isLoading && (
          <div className="flex flex-col gap-4 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-surface rounded-card-lg h-24 animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <div className="mt-8 text-center text-body text-ink-hint">
            데이터를 불러오지 못했어요.
          </div>
        )}

        {data && (
          <>
            {/* 세 줄 요약 */}
            <div className="rounded-card-lg bg-primary-tint mt-2 p-4">
              <p className="text-body text-primary mb-2 font-bold">✦ 이번 달 세 줄 요약</p>
              <ul className="flex flex-col gap-1.5">
                {data.summary.map((line) => (
                  <li key={line} className="text-body text-ink-sub flex gap-1.5">
                    <span className="text-ink-hint">·</span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            {/* 자산 변화 */}
            <section className="mt-6">
              <p className="text-body text-ink-hint">자산 변화</p>
              {data.assetChange.changeAmount !== null && data.assetChange.previousTotal !== null ? (
                <div className="mt-1 flex items-end gap-2">
                  <span
                    className={`text-card font-bold ${
                      data.assetChange.changeAmount >= 0 ? 'text-success' : 'text-danger'
                    }`}
                  >
                    {data.assetChange.changeAmount >= 0 ? '+' : ''}
                    {toMan(data.assetChange.changeAmount)}만원
                  </span>
                  <span className="text-caption text-ink-hint pb-0.5">
                    {toMan(data.assetChange.previousTotal)}만 → {toMan(data.assetChange.currentTotal)}만
                  </span>
                </div>
              ) : (
                <div className="mt-1 flex items-end gap-2">
                  <span className="text-card font-bold text-ink">
                    {toMan(data.assetChange.currentTotal)}만원
                  </span>
                  <span className="text-caption text-ink-hint pb-0.5">전월 데이터 없음</span>
                </div>
              )}
            </section>

            {/* 연금·배당 들어온 돈 */}
            <section className="mt-6">
              <p className="text-body text-ink-hint mb-2">연금·배당 들어온 돈</p>
              <div className="rounded-card-lg border border-line flex flex-col bg-white">
                {[
                  {
                    label: '연금',
                    value: data.income.pensionAmount,
                    delta: null,
                  },
                  {
                    label: '배당 ETF 분배금',
                    value: data.income.dividendAmount,
                    delta: data.income.dividendChangeRate,
                  },
                  {
                    label: '예금 이자',
                    value: data.income.interestAmount,
                    delta: null,
                  },
                ]
                  .filter((item) => item.value > 0)
                  .map(({ label, value, delta }, i) => (
                    <div
                      key={label}
                      className={`flex items-center justify-between px-4 py-3.5 ${
                        i > 0 ? 'border-divider border-t' : ''
                      }`}
                    >
                      <span className="text-body text-ink-sub">{label}</span>
                      <span className="text-md text-ink font-bold">
                        {toMan(value)}만원
                        {delta !== null && (
                          <span
                            className={`text-sub ml-1.5 font-bold ${
                              delta >= 0 ? 'text-success' : 'text-danger'
                            }`}
                          >
                            {delta >= 0 ? '+' : ''}{delta.toFixed(1)}%
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
              </div>
            </section>

            {/* 소비 */}
            <section className="mt-6">
              <p className="text-body text-ink-hint mb-2">소비</p>
              <div className="rounded-card-lg border border-line bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="text-body text-ink-sub">이번 달 소비</span>
                  <span className="text-md text-ink font-bold">
                    {toMan(data.spending.expenseAmount)}만원 · {data.spending.judgment}
                  </span>
                </div>
                <div className="bg-track mt-3 h-2 overflow-hidden rounded-full">
                  <div
                    className={`h-full rounded-full ${
                      data.spending.judgment === '적정'
                        ? 'bg-success'
                        : data.spending.judgment === '주의'
                          ? 'bg-warning'
                          : 'bg-danger'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(0, data.spending.spendingRatio === 999 ? 100 : data.spending.spendingRatio))}%`,
                    }}
                  />
                </div>
              </div>
            </section>

            {/* 다음 달 미리 보기 */}
            <section className="mt-6">
              <p className="text-body text-ink-hint mb-2">다음 달 미리 보기</p>
              <div className="rounded-card-lg border border-line flex flex-col bg-white">
                <div className="flex items-center justify-between px-4 py-3.5">
                  <span className="text-body text-ink-sub">들어올 돈</span>
                  <div className="text-right">
                    <span className="text-md text-ink font-bold">
                      {toMan(data.nextMonthPreview.incomingTotal)}만원
                    </span>
                    <span className="text-sub text-ink-hint ml-1.5">
                      (연금 {toMan(data.nextMonthPreview.pensionAmount)} · 배당 {toMan(data.nextMonthPreview.dividendAmount)})
                    </span>
                  </div>
                </div>
                <div className="border-divider flex items-center justify-between border-t px-4 py-3.5">
                  <span className="text-body text-ink-sub">나갈 돈</span>
                  <div className="text-right">
                    <span className="text-md text-ink font-bold">
                      {toMan(data.nextMonthPreview.outgoingTotal)}만원
                    </span>
                    <span
                      className={`text-sub ml-1.5 font-bold ${
                        data.nextMonthPreview.balanceSufficient ? 'text-success' : 'text-danger'
                      }`}
                    >
                      {data.nextMonthPreview.balanceSufficient ? '잔액 충분' : '잔액 부족 주의'}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default MonthlyReportPage
