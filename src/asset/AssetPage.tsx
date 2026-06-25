import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackArrowIc, NotificationIc } from '../common/assets/icons'
import { formatKrw, formatKrwShort } from '../common/utils/formatKrw'
import { formatMD, formatYM, formatRefDate, calcDday } from '../common/utils/formatDate'

type Period = '1개월' | '3개월' | '1년'

const PERIODS: Period[] = ['1개월', '3개월', '1년']

// ── Mock 데이터 ──────────────────────────────────────────────
const MOCK_REFERENCE_DATE = new Date(2026, 5, 12)   // 6월 12일

const MOCK_TOTAL_ASSET_KRW = 250_000_000
const MOCK_PREV_ASSET_KRW  = 248_800_000
const MOCK_MONTHLY_CHANGE_KRW = 1_200_000

const MOCK_EVAL_GAIN_KRW      = 1_070_000
const MOCK_DIVIDEND_INCOME_KRW = 130_000

type AssetSegment = {
  label: string
  sub: string
  amountKrw: number
  pct: number
  dotClass: string
  barPct: number
}

const MOCK_ASSET_SEGMENTS: AssetSegment[] = [
  {
    label: '연금 재원',
    sub: 'IRP 1억 · 연금저축 5,000만',
    amountKrw: 150_000_000,
    pct: 60,
    dotClass: 'bg-primary',
    barPct: 60,
  },
  {
    label: '월급 만드는 자산',
    sub: '배당 ETF 3,000만 · 주식 2,000만',
    amountKrw: 50_000_000,
    pct: 20,
    dotClass: 'bg-primary-muted',
    barPct: 20,
  },
  {
    label: '대기·묶인 자산',
    sub: '예금 5,000만 · 만기 2026.11',
    amountKrw: 50_000_000,
    pct: 20,
    dotClass: 'bg-disabled',
    barPct: 20,
  },
]

const MOCK_MONTHLY_INCOME_KRW = 130_000

type BarItem = { label: string; height: number; colorClass: string; bold: boolean }

const BAR_DATA: BarItem[] = [
  { label: '1월', height: 42, colorClass: 'bg-primary-faint', bold: false },
  { label: '2월', height: 45, colorClass: 'bg-primary-faint', bold: false },
  { label: '3월', height: 48, colorClass: 'bg-primary-faint', bold: false },
  { label: '4월', height: 55, colorClass: 'bg-primary-dim',   bold: false },
  { label: '5월', height: 60, colorClass: 'bg-primary-dim',   bold: false },
  { label: '6월', height: 65, colorClass: 'bg-primary',       bold: true  },
]

type IncomeItem = { label: string; amountKrw: number; changeRate?: string }

const MOCK_INCOME_ITEMS: IncomeItem[] = [
  { label: '배당 ETF 분배금', amountKrw: 100_000, changeRate: '+12.4%' },
  { label: '예금 이자',        amountKrw:  30_000 },
]

type CashEvent =
  | { type: 'income';   label: string; date: Date; amountKrw: number }
  | { type: 'maturity'; label: string; date: Date; unlockKrw: number }

const MOCK_CASH_EVENTS: CashEvent[] = [
  { type: 'income',   label: '배당금 입금', date: new Date(2026, 5, 25),  amountKrw: 100_000 },
  { type: 'maturity', label: '예금 만기',   date: new Date(2026, 10, 1),  unlockKrw: 50_000_000 },
]

type PensionItem = { label: string; amountKrw: number }

const MOCK_PENSION_ITEMS: PensionItem[] = [
  { label: 'IRP',   amountKrw: 100_000_000 },
  { label: '연금저축', amountKrw:  50_000_000 },
]
// ─────────────────────────────────────────────────────────────

function TrendChart() {
  const pts: [number, number][] = [
    [0, 54], [45, 50], [90, 46], [140, 42], [190, 32], [240, 20], [318, 12],
  ]
  const linePath = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')
  const areaPath = `${linePath} L 318 64 L 0 64 Z`

  return (
    <svg viewBox="0 0 318 64" className="w-full h-16" preserveAspectRatio="none">
      <defs>
        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0046FF" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#0046FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#trendGrad)" />
      <path
        d={linePath}
        stroke="#0046FF"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function AssetPage() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState<Period>('1개월')

  return (
    <div className="flex h-dvh flex-col bg-white">
      {/* 헤더 */}
      <header className="flex h-[52px] shrink-0 items-center gap-2 px-5 w-full">
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
          <div className="bg-white rounded-card-xl border border-line px-5 py-[22px] flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-sub font-semibold text-ink-sub">총자산</span>
              <span className="text-caption text-ink-hint">{formatRefDate(MOCK_REFERENCE_DATE)}</span>
            </div>

            <div className="pt-0.5">
              <p className="font-inter text-[2rem] font-bold text-ink leading-tight tracking-tight">
                {formatKrw(MOCK_TOTAL_ASSET_KRW)}
              </p>
            </div>

            <div className="flex items-center gap-[6px]">
              <span className="bg-success-bg text-success text-sub font-bold rounded-badge px-[9px] py-1">
                이번 달 +{formatKrw(MOCK_MONTHLY_CHANGE_KRW)} ↑
              </span>
              <span className="text-caption text-ink-hint">
                {formatKrwShort(MOCK_PREV_ASSET_KRW)} → {formatKrwShort(MOCK_TOTAL_ASSET_KRW)}
              </span>
            </div>

            <div className="flex items-center pt-[14px]">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-[5px] text-sub rounded-badge font-semibold ${
                    period === p
                      ? 'bg-primary-tint text-primary font-bold'
                      : 'text-ink-hint'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="pt-1">
              <TrendChart />
            </div>

            <div className="border-t border-divider flex items-start pt-[17px]">
              <div className="flex-1 flex flex-col gap-1">
                <p className="text-caption text-ink-hint">평가손익</p>
                <p className="text-md font-bold text-success">+{formatKrw(MOCK_EVAL_GAIN_KRW)}</p>
              </div>
              <div className="border-l border-divider flex-1 flex flex-col gap-1 pl-[17px]">
                <p className="text-caption text-ink-hint">배당·이자 수입</p>
                <p className="text-md font-bold text-success">+{formatKrw(MOCK_DIVIDEND_INCOME_KRW)}</p>
              </div>
            </div>
          </div>

          {/* ── 내 자산 구성 카드 ── */}
          <div className="bg-white rounded-card-xl border border-line p-5 flex flex-col gap-[6px]">
            <p className="text-sub font-semibold text-ink-sub">내 자산 구성</p>

            <div className="flex overflow-hidden rounded-badge pt-[6px]">
              {MOCK_ASSET_SEGMENTS.map((seg) => (
                <div
                  key={seg.label}
                  className={`h-4 ${seg.dotClass}`}
                  style={{ width: `${seg.barPct}%` }}
                />
              ))}
            </div>

            <div className="flex flex-col gap-0.5 pt-2">
              {MOCK_ASSET_SEGMENTS.map((seg, i) => (
                <div
                  key={seg.label}
                  className={`flex items-center gap-3 py-[11px] ${
                    i < MOCK_ASSET_SEGMENTS.length - 1 ? 'border-b border-divider' : ''
                  }`}
                >
                  <span className={`size-[9px] shrink-0 rounded-[4.5px] ${seg.dotClass}`} />
                  <div className="flex-1 min-w-0 flex flex-col gap-0.5 pl-0.5">
                    <p className="text-body font-semibold text-ink">{seg.label}</p>
                    <p className="text-sub text-ink-sub">{seg.sub}</p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 shrink-0">
                    <p className="font-inter text-md font-bold text-ink">
                      {formatKrwShort(seg.amountKrw)}
                    </p>
                    <p className="text-body text-ink-sub">{seg.pct}%</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-surface rounded-card p-4 flex flex-col gap-2">
              <p className="text-caption font-bold text-primary">✦ 한 줄 요약</p>
              <p className="text-body text-ink-sub leading-relaxed">
                지금은 자산의{' '}
                <span className="font-bold text-ink">32%만 매달 현금을 만들고</span> 있어요.
                <br />
                묶인 예금이 11월 만기되면 더 늘릴 수 있어요.
              </p>
            </div>

            <button
              className="flex w-full items-center gap-3 pt-[13px] px-0.5 text-left"
              aria-label="투자 건강검진 보기 — 어떤 자산이 월급이 되는지 자세히 확인"
            >
              <div className="bg-primary-tint rounded-icon size-10 shrink-0 flex items-center justify-center">
                <span className="text-primary font-bold text-body">↑</span>
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <p className="text-body font-semibold text-ink">투자 건강검진 보기</p>
                <p className="text-sub text-ink-sub">어떤 자산이 월급이 되는지 자세히</p>
              </div>
              <span className="text-card text-disabled shrink-0" aria-hidden="true">›</span>
            </button>
          </div>

          {/* ── 섹션 레이블 ── */}
          <div className="px-1 pt-1.5">
            <p className="text-sub font-semibold text-ink-hint">내 자산이 만드는 월 수입</p>
          </div>

          {/* ── 월 수입 차트 카드 ── */}
          <div className="bg-white rounded-card-xl border border-line p-5 flex flex-col gap-4">
            <div className="flex items-baseline justify-between">
              <p className="text-sub font-semibold text-ink-sub">월 평균 들어오는 돈</p>
              <p className="font-inter text-md font-bold text-primary">
                {formatKrw(MOCK_MONTHLY_INCOME_KRW)}
              </p>
            </div>

            <div className="flex items-end justify-center gap-[9px] h-[70px]">
              {BAR_DATA.map(({ label, height, colorClass, bold }) => (
                <div key={label} className="flex flex-1 flex-col items-center gap-[6px]">
                  <div className={`w-full rounded-t-[5px] ${colorClass}`} style={{ height }} />
                  <span className={`text-caption ${bold ? 'font-bold text-ink' : 'text-ink-hint'}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-divider pt-[15px] flex flex-col">
              {MOCK_INCOME_ITEMS.map(({ label, amountKrw, changeRate }) => (
                <div key={label} className="flex items-center justify-between py-[7px]">
                  <p className="text-body text-ink-sub">{label}</p>
                  <div className="flex items-center gap-1">
                    <p className="font-inter text-md font-semibold text-ink">
                      월 {formatKrw(amountKrw)}
                    </p>
                    {changeRate && (
                      <p className="text-sub text-success font-semibold">{changeRate}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 다가오는 현금 일정 카드 ── */}
          <div className="bg-white rounded-card-xl border border-line p-5 flex flex-col">
            <p className="text-sub font-semibold text-ink-sub">다가오는 현금 일정</p>

            {MOCK_CASH_EVENTS.map((event, i) => (
              <div
                key={event.label}
                className={`flex items-center gap-3 py-4 ${
                  i < MOCK_CASH_EVENTS.length - 1 ? 'border-b border-divider' : ''
                }`}
                style={i === 0 ? { paddingTop: '22px', paddingBottom: '17px' } : undefined}
              >
                <div
                  className={`rounded-icon size-10 shrink-0 flex items-center justify-center ${
                    event.type === 'income' ? 'bg-primary-tint' : 'bg-surface-muted'
                  }`}
                >
                  <span className={`font-bold text-body ${event.type === 'income' ? 'text-primary' : 'text-ink-sub'}`}>
                    {event.type === 'income' ? '↑' : '↓'}
                  </span>
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <p className="text-md font-semibold text-ink">{event.label}</p>
                  <p className="text-sub text-ink-sub">
                    {event.type === 'income'
                      ? `${formatMD(event.date)} · ${calcDday(event.date)}`
                      : `${formatYM(event.date)} · ${formatKrw(event.unlockKrw)} 풀림`}
                  </p>
                </div>
                {event.type === 'income' ? (
                  <p className="font-inter text-md font-bold text-primary shrink-0">
                    +{formatKrw(event.amountKrw)}
                  </p>
                ) : (
                  <span className="bg-warning-bg text-warning-text text-sub font-bold rounded-badge px-[9px] py-1 shrink-0">
                    묶임 해제
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* ── 연금으로 받을 재원 카드 ── */}
          <div className="bg-white rounded-card-xl border border-line p-5 flex flex-col">
            <p className="text-sub font-semibold text-ink-sub">연금으로 받을 재원</p>

            {MOCK_PENSION_ITEMS.map((item, i) => (
              <div
                key={item.label}
                className={`flex items-baseline justify-between py-[15px] ${
                  i < MOCK_PENSION_ITEMS.length - 1 ? 'border-b border-divider' : 'pb-5'
                }`}
              >
                <p className="text-md text-ink-sub">{item.label}</p>
                <p className="font-inter text-md font-semibold text-ink">
                  {formatKrw(item.amountKrw)}
                </p>
              </div>
            ))}

            <div className="bg-surface rounded-card px-4 py-[14px]">
              <p className="text-sub text-ink-sub leading-relaxed">
                <span className="font-bold text-ink">55세 이후</span> 연금으로 수령 가능 · 연금 수령 시 세율
                <br />
                3.3~5.5%로 낮아져요.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default AssetPage
