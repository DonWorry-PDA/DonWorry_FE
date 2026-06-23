import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackArrowIc, NotificationIc } from '../common/assets/icons'

type Period = '1개월' | '3개월' | '1년'

const PERIODS: Period[] = ['1개월', '3개월', '1년']

const ASSET_SEGMENTS = [
  {
    label: '연금 재원',
    sub: 'IRP 1억 · 연금저축 5,000만',
    amount: '1억 5,000만',
    pct: '60%',
    dotClass: 'bg-primary',
    barPct: 60,
  },
  {
    label: '월급 만드는 자산',
    sub: '배당 ETF 3,000만 · 주식 2,000만',
    amount: '5,000만',
    pct: '20%',
    dotClass: 'bg-primary-muted',
    barPct: 20,
  },
  {
    label: '대기·묶인 자산',
    sub: '예금 5,000만 · 만기 2026.11',
    amount: '5,000만',
    pct: '20%',
    dotClass: 'bg-disabled',
    barPct: 20,
  },
]

const BAR_DATA = [
  { label: '1월', height: 42, colorClass: 'bg-primary-faint', bold: false },
  { label: '2월', height: 45, colorClass: 'bg-primary-faint', bold: false },
  { label: '3월', height: 48, colorClass: 'bg-primary-faint', bold: false },
  { label: '4월', height: 55, colorClass: 'bg-primary-dim', bold: false },
  { label: '5월', height: 60, colorClass: 'bg-primary-dim', bold: false },
  { label: '6월', height: 65, colorClass: 'bg-primary', bold: true },
]

function TrendChart() {
  const pts: [number, number][] = [
    [0, 54], [45, 50], [90, 46], [140, 42], [190, 32], [240, 20], [318, 12],
  ]
  const linePath = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')
  const areaPath = `${linePath} L 318 64 L 0 64 Z`

  return (
    <svg
      viewBox="0 0 318 64"
      className="w-full h-16"
      preserveAspectRatio="none"
    >
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
    <div className="bg-page flex h-dvh flex-col">
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
          <div className="bg-white rounded-card-xl shadow-card px-5 py-[22px] flex flex-col gap-1">
            {/* 상단 레이블 */}
            <div className="flex items-center justify-between">
              <span className="text-sub font-semibold text-ink-sub">총자산</span>
              <span className="text-caption text-ink-hint">6월 12일 기준</span>
            </div>

            {/* 금액 */}
            <div className="pt-0.5">
              <p className="font-inter text-[2rem] font-bold text-ink leading-tight tracking-tight">
                2억 5,000만원
              </p>
            </div>

            {/* 변동 뱃지 */}
            <div className="flex items-center gap-[6px]">
              <span className="bg-success-bg text-success text-sub font-bold rounded-badge px-[9px] py-1">
                이번 달 +120만원 ↑
              </span>
              <span className="text-caption text-ink-hint">2억 4,880만 → 2억 5,000만</span>
            </div>

            {/* 기간 탭 */}
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

            {/* 추이 차트 */}
            <div className="pt-1">
              <TrendChart />
            </div>

            {/* 하단 지표 */}
            <div className="border-t border-divider flex items-start pt-[17px]">
              <div className="flex-1 flex flex-col gap-1">
                <p className="text-caption text-ink-hint">평가손익</p>
                <p className="text-md font-bold text-success">+107만원</p>
              </div>
              <div className="border-l border-divider flex-1 flex flex-col gap-1 pl-[17px]">
                <p className="text-caption text-ink-hint">배당·이자 수입</p>
                <p className="text-md font-bold text-success">+13만원</p>
              </div>
            </div>
          </div>

          {/* ── 내 자산 구성 카드 ── */}
          <div className="bg-white rounded-card-xl shadow-card p-5 flex flex-col gap-[6px]">
            <p className="text-sub font-semibold text-ink-sub">내 자산 구성</p>

            {/* 스택 바 */}
            <div className="flex overflow-hidden rounded-badge pt-[6px]">
              {ASSET_SEGMENTS.map((seg) => (
                <div
                  key={seg.label}
                  className={`h-4 ${seg.dotClass}`}
                  style={{ width: `${seg.barPct}%` }}
                />
              ))}
            </div>

            {/* 자산 항목 */}
            <div className="flex flex-col gap-0.5 pt-2">
              {ASSET_SEGMENTS.map((seg, i) => (
                <div
                  key={seg.label}
                  className={`flex items-center gap-3 py-[11px] ${
                    i < ASSET_SEGMENTS.length - 1 ? 'border-b border-divider' : ''
                  }`}
                >
                  <span className={`size-[9px] shrink-0 rounded-[4.5px] ${seg.dotClass}`} />
                  <div className="flex-1 min-w-0 flex flex-col gap-0.5 pl-0.5">
                    <p className="text-body font-semibold text-ink">{seg.label}</p>
                    <p className="text-sub text-ink-sub">{seg.sub}</p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 shrink-0">
                    <p className="font-inter text-md font-bold text-ink">{seg.amount}</p>
                    <p className="text-body text-ink-sub">{seg.pct}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* AI 한 줄 요약 */}
            <div className="bg-surface rounded-card p-4 flex flex-col gap-2">
              <p className="text-caption font-bold text-primary">✦ 한 줄 요약</p>
              <p className="text-body text-ink-sub leading-relaxed">
                지금은 자산의{' '}
                <span className="font-bold text-ink">32%만 매달 현금을 만들고</span> 있어요.
                <br />
                묶인 예금이 11월 만기되면 더 늘릴 수 있어요.
              </p>
            </div>

            {/* 건강검진 CTA */}
            <div className="flex items-center gap-3 pt-[13px] px-0.5">
              <div className="bg-primary-tint rounded-icon size-10 shrink-0 flex items-center justify-center">
                <span className="text-primary font-bold text-body">↑</span>
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <p className="text-body font-semibold text-ink">투자 건강검진 보기</p>
                <p className="text-sub text-ink-sub">어떤 자산이 월급이 되는지 자세히</p>
              </div>
              <span className="text-card text-disabled shrink-0">›</span>
            </div>
          </div>

          {/* ── 섹션 레이블 ── */}
          <div className="px-1 pt-1.5">
            <p className="text-sub font-semibold text-ink-hint">내 자산이 만드는 월 수입</p>
          </div>

          {/* ── 월 수입 차트 카드 ── */}
          <div className="bg-white rounded-card-xl shadow-card p-5 flex flex-col gap-4">
            {/* 헤더 */}
            <div className="flex items-baseline justify-between">
              <p className="text-sub font-semibold text-ink-sub">월 평균 들어오는 돈</p>
              <p className="font-inter text-md font-bold text-primary">13만원</p>
            </div>

            {/* 막대 차트 */}
            <div className="flex items-end justify-center gap-[9px] h-[70px]">
              {BAR_DATA.map(({ label, height, colorClass, bold }) => (
                <div key={label} className="flex flex-1 flex-col items-center gap-[6px]">
                  <div
                    className={`w-full rounded-t-[5px] ${colorClass}`}
                    style={{ height }}
                  />
                  <span
                    className={`text-caption ${bold ? 'font-bold text-ink' : 'text-ink-hint'}`}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* 수입 상세 */}
            <div className="border-t border-divider pt-[15px] flex flex-col">
              <div className="flex items-center justify-between py-[7px]">
                <p className="text-body text-ink-sub">배당 ETF 분배금</p>
                <div className="flex items-center gap-1">
                  <p className="font-inter text-md font-semibold text-ink">월 10만원</p>
                  <p className="text-sub text-success font-semibold">+12.4%</p>
                </div>
              </div>
              <div className="flex items-baseline justify-between py-[7px]">
                <p className="text-body text-ink-sub">예금 이자</p>
                <p className="font-inter text-md font-semibold text-ink">월 3만원</p>
              </div>
            </div>
          </div>

          {/* ── 다가오는 현금 일정 카드 ── */}
          <div className="bg-white rounded-card-xl shadow-card p-5 flex flex-col">
            <p className="text-sub font-semibold text-ink-sub">다가오는 현금 일정</p>

            {/* 배당금 입금 */}
            <div className="flex items-center gap-3 pt-[22px] pb-[17px] border-b border-divider">
              <div className="bg-primary-tint rounded-icon size-10 shrink-0 flex items-center justify-center">
                <span className="text-primary font-bold text-body">↑</span>
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <p className="text-md font-semibold text-ink">배당금 입금</p>
                <p className="text-sub text-ink-sub">6월 25일 · D-13</p>
              </div>
              <p className="font-inter text-md font-bold text-primary shrink-0">+10만원</p>
            </div>

            {/* 예금 만기 */}
            <div className="flex items-center gap-3 py-4">
              <div className="bg-surface-muted rounded-icon size-10 shrink-0 flex items-center justify-center">
                <span className="text-ink-sub font-bold text-body">↓</span>
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <p className="text-md font-semibold text-ink">예금 만기</p>
                <p className="text-sub text-ink-sub">2026년 11월 · 5,000만원 풀림</p>
              </div>
              <span className="bg-warning-bg text-warning-text text-sub font-bold rounded-badge px-[9px] py-1 shrink-0">
                묶임 해제
              </span>
            </div>
          </div>

          {/* ── 연금으로 받을 재원 카드 ── */}
          <div className="bg-white rounded-card-xl shadow-card p-5 flex flex-col">
            <p className="text-sub font-semibold text-ink-sub">연금으로 받을 재원</p>

            <div className="flex items-baseline justify-between py-[15px] border-b border-divider">
              <p className="text-md text-ink-sub">IRP</p>
              <p className="font-inter text-md font-semibold text-ink">1억원</p>
            </div>
            <div className="flex items-baseline justify-between py-[15px] pb-5">
              <p className="text-md text-ink-sub">연금저축</p>
              <p className="font-inter text-md font-semibold text-ink">5,000만원</p>
            </div>

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
