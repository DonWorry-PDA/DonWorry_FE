import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'

type ReportData = {
  month: string
  summaryLines: string[]
  assetChangeKrw: number
  assetFromKrw: number
  assetToKrw: number
  trend: number[]
  incomes: { label: string; value: string; delta?: string }[]
  spendingKrw: number
  spendingStatus: string
  spendingRatioPct: number
  nextIncome: string
  nextExpense: string
}

const MOCK: ReportData = {
  month: '2026년 6월',
  summaryLines: [
    '배당금이 지난달보다 12.4% 늘었어요.',
    '27일 카드값 결제 전 잔액 확인이 필요했어요.',
    '소비는 목표 안에서 잘 관리되고 있어요.',
  ],
  assetChangeKrw: 1_200_000,
  assetFromKrw: 248_800_000,
  assetToKrw: 250_000_000,
  trend: [38, 40, 36, 42, 44, 41, 48, 52, 50, 58, 62, 66],
  incomes: [
    { label: '배당 ETF 분배금', value: '100,000원', delta: '+12.4%' },
    { label: '예금 이자', value: '32,450원' },
  ],
  spendingKrw: 2_180_000,
  spendingStatus: '수입 대비 적정',
  spendingRatioPct: 62,
  nextIncome: '130만원 (연금 120 · 배당 10)',
  nextExpense: '215만원 · 잔액 부족일 없음',
}

function toMan(krw: number) {
  return Math.round(krw / 10_000).toLocaleString('ko-KR')
}

function TrendChart({ points }: { points: number[] }) {
  const W = 300
  const H = 70
  if (points.length < 2) return null
  const max = Math.max(...points)
  const min = Math.min(...points)
  const span = max - min || 1
  const step = W / (points.length - 1)
  const d = points
    .map((p, i) => {
      const x = i * step
      const y = H - ((p - min) / span) * (H - 8) - 4
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} fill="none" preserveAspectRatio="none">
      <path d={d} stroke="var(--color-success)" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function MonthlyReportPage() {
  const navigate = useNavigate()

  return (
    <div className="flex h-dvh flex-col bg-white">
      <AppBar title="월간 리포트" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto px-6 pb-8">
        {/* 월 선택 (월 이동 기능은 API 연동 시 구현 예정) */}
        <div className="flex items-center justify-center gap-6 py-2">
          <button aria-label="이전 달" disabled className="text-disabled text-md">
            ‹
          </button>
          <span className="text-md text-ink font-bold">{MOCK.month}</span>
          <button aria-label="다음 달" disabled className="text-disabled text-md">
            ›
          </button>
        </div>

        {/* 세 줄 요약 */}
        <div className="rounded-card-lg bg-primary-tint mt-2 p-4">
          <p className="text-body text-primary mb-2 font-bold">✦ 이번 달 세 줄 요약</p>
          <ul className="flex flex-col gap-1.5">
            {MOCK.summaryLines.map((line) => (
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
          <div className="mt-1 flex items-end gap-2">
            <span className="text-success text-card font-bold">+{toMan(MOCK.assetChangeKrw)}만원</span>
            <span className="text-caption text-ink-hint pb-0.5">
              {toMan(MOCK.assetFromKrw)}만 → {toMan(MOCK.assetToKrw)}만
            </span>
          </div>
          <div className="mt-3">
            <TrendChart points={MOCK.trend} />
          </div>
        </section>

        {/* 연금·배당 들어온 돈 */}
        <section className="mt-6">
          <p className="text-body text-ink-hint mb-2">연금·배당 들어온 돈</p>
          <div className="rounded-card-lg border border-line flex flex-col bg-white">
            {MOCK.incomes.map(({ label, value, delta }, i) => (
              <div
                key={label}
                className={`flex items-center justify-between px-4 py-3.5 ${
                  i > 0 ? 'border-divider border-t' : ''
                }`}
              >
                <span className="text-body text-ink-sub">{label}</span>
                <span className="text-md text-ink font-bold">
                  {value}
                  {delta && <span className="text-success text-sub ml-1.5 font-bold">{delta}</span>}
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
                {toMan(MOCK.spendingKrw)}만원 · {MOCK.spendingStatus}
              </span>
            </div>
            <div className="bg-track mt-3 h-2 overflow-hidden rounded-full">
              <div
                className="bg-success h-full rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, MOCK.spendingRatioPct))}%` }}
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
              <span className="text-md text-ink font-bold">{MOCK.nextIncome}</span>
            </div>
            <div className="border-divider flex items-center justify-between border-t px-4 py-3.5">
              <span className="text-body text-ink-sub">나갈 돈</span>
              <span className="text-md text-ink font-bold">{MOCK.nextExpense}</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default MonthlyReportPage
