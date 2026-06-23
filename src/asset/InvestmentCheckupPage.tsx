import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'
import { formatKrw } from '../common/utils/formatKrw'

type CashflowType = 'MONTHLY' | 'MATURITY' | 'LOCKED' | 'NONE'

type HoldingItem = {
  name: string
  memo: string
  amountKrw: number
  cashflowType: CashflowType
}

const MOCK = {
  cashflowAssetRatio: 32,
  summaryLines: [
    '매달 현금이 들어오는 자산은 배당 ETF뿐이에요.',
    '예금 5,000만원은 만기까지 이자가 묶여 있어요.',
    '국내 주식 2,000만원은 배당이 거의 없어요.',
  ],
  holdings: [
    { name: '배당 ETF', memo: '월 10만원 입금 중', amountKrw: 30_000_000, cashflowType: 'MONTHLY' },
    { name: '예금', memo: '만기 2026.11 · 이자 일시 지급', amountKrw: 50_000_000, cashflowType: 'MATURITY' },
    { name: '국내 주식', memo: '배당수익률 0.4%', amountKrw: 20_000_000, cashflowType: 'NONE' },
    { name: 'IRP', memo: '55세 이후 연금으로 수령 가능', amountKrw: 100_000_000, cashflowType: 'LOCKED' },
    { name: '연금저축', memo: '연금 수령 시 세율 3.3~5.5%', amountKrw: 50_000_000, cashflowType: 'LOCKED' },
  ] satisfies HoldingItem[],
  concentration: '낮음 · 안전',
  missedBenefit: '연금저축 세액공제 한도 남음',
}

const TYPE_DOT: Record<CashflowType, string> = {
  MONTHLY: 'bg-success',
  MATURITY: 'bg-event-interest',
  LOCKED: 'bg-event-maturity',
  NONE: 'bg-dot-off',
}

function InvestmentCheckupPage() {
  const navigate = useNavigate()

  return (
    <div className="bg-page flex h-dvh flex-col">
      <AppBar title="투자 건강검진" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto px-5 pb-6">
        <h2 className="text-card text-ink mt-2 font-bold leading-snug">
          갖고 계신 자산 중{'\n'}
          <span className="text-primary">{MOCK.cashflowAssetRatio}%만 월급을 만들고 있어요</span>
        </h2>

        {/* 세 줄 요약 */}
        <div className="rounded-card-lg bg-primary-tint mt-4 p-4">
          <p className="text-body text-primary mb-2 font-bold">✦ 세 줄 요약</p>
          <ul className="flex flex-col gap-1.5">
            {MOCK.summaryLines.map((line) => (
              <li key={line} className="text-body text-ink-sub flex gap-1.5">
                <span className="text-ink-hint">·</span>
                {line}
              </li>
            ))}
          </ul>
        </div>

        {/* 보유 자산별 현금흐름 기여 */}
        <p className="text-body text-ink-hint mt-6 mb-2">보유 자산별 현금흐름 기여</p>
        <div className="rounded-card-lg shadow-card flex flex-col bg-white">
          {MOCK.holdings.map((h, i) => (
            <div
              key={h.name}
              className={`flex items-center gap-3 px-4 py-3.5 ${i > 0 ? 'border-divider border-t' : ''}`}
            >
              <span className={`size-2 shrink-0 rounded-full ${TYPE_DOT[h.cashflowType]}`} />
              <div className="min-w-0 flex-1">
                <p className="text-md text-ink font-bold">{h.name}</p>
                <p className="text-caption text-ink-hint mt-0.5">{h.memo}</p>
              </div>
              <span className="text-md text-ink shrink-0 font-bold">{formatKrw(h.amountKrw)}</span>
            </div>
          ))}
        </div>

        {/* 요약 푸터 */}
        <div className="border-line mt-5 flex flex-col gap-2 border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-body text-ink-hint">한 종목 쏠림</span>
            <span className="text-body text-success font-bold">{MOCK.concentration}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body text-ink-hint">놓치고 있는 혜택</span>
            <span className="text-body text-ink font-bold">{MOCK.missedBenefit}</span>
          </div>
        </div>
      </main>

      <StickyFooter>
        <Button onClick={() => navigate('/paycheck-plan/assets')}>이 자산으로 월급 만들어보기</Button>
      </StickyFooter>
    </div>
  )
}

export default InvestmentCheckupPage
