import { useNavigate, useLocation } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import InfoBox from '../common/components/InfoBox'
import useGetProductDetail from './hooks/useGetProductDetail'
import useEtfPriceWebSocket from './hooks/useEtfPriceWebSocket'

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 6v3M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.8 2.6a1.4 1.4 0 0 1 2.4 0l4.9 8.4A1.4 1.4 0 0 1 12.9 13H3.1a1.4 1.4 0 0 1-1.2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function DocIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 7h8M6 10h8M6 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

const RISK_LABEL: Record<number, { label: string; tone: string }> = {
  1: { label: '1등급 · 매우높은위험', tone: 'text-danger' },
  2: { label: '2등급 · 높은위험', tone: 'text-danger' },
  3: { label: '3등급 · 다소높은위험', tone: 'text-warning' },
  4: { label: '4등급 · 보통위험', tone: 'text-warning' },
  5: { label: '5등급 · 낮은위험', tone: 'text-ink-sub' },
  6: { label: '6등급 · 매우낮은위험', tone: 'text-ink-sub' },
}

function PriceChangeSign({ sign, changePrice, changeRate }: { sign: string; changePrice: number; changeRate: number }) {
  const isUp = sign === '2'
  const isDown = sign === '5'
  const color = isUp ? 'text-danger' : isDown ? 'text-primary' : 'text-ink-sub'
  const prefix = isUp ? '+' : isDown ? '-' : ''
  return (
    <span className={`font-inter text-body font-medium ${color}`}>
      {prefix}{Math.abs(changePrice).toLocaleString('ko-KR')}원 ({prefix}{Math.abs(changeRate).toFixed(2)}%)
    </span>
  )
}

function OrderProductPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const productId = state?.productId as number | undefined
  const ticker = state?.ticker as string | undefined

  const { data, isLoading } = useGetProductDetail(productId)
  const realtimePrice = useEtfPriceWebSocket(data?.productType === 'ETF' ? ticker : undefined)

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <AppBar title="상품 설명" onBack={() => navigate(-1)} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-body text-ink-hint">불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col h-full">
        <AppBar title="상품 설명" onBack={() => navigate(-1)} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-body text-ink-hint">상품 정보를 불러올 수 없어요.</p>
        </div>
      </div>
    )
  }

  const etf = data.etfDetail
  const deposit = data.depositDetail
  const pension = data.pensionSavingDetail

  const currentPrice = realtimePrice?.currentPrice ?? etf?.closingPrice
  const changePrice = realtimePrice?.changePrice ?? etf?.priceChange
  const changeRate = realtimePrice?.changeRate ?? etf?.changeRate
  const etfSign = etf ? (etf.priceChange > 0 ? '2' : etf.priceChange < 0 ? '5' : '3') : '3'
  const sign = realtimePrice?.sign ?? etfSign

  const riskInfo = etf ? (RISK_LABEL[etf.riskGrade] ?? { label: `${etf.riskGrade}등급`, tone: 'text-ink-sub' }) : null

  return (
    <div className="flex flex-col h-full">
      <AppBar title="상품 설명" onBack={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6">
        <h2 className="text-heading font-bold text-ink mb-1">
          사기 전에
          <br />
          꼭 확인해 주세요
        </h2>

        {/* 기본 정보 */}
        <div className="mt-5 rounded-card border border-line divide-y divide-divider">
          <div className="px-4 py-3">
            <p className="text-sub text-ink-hint mb-0.5">상품명</p>
            <p className="text-body font-semibold text-ink">{data.productName}</p>
          </div>

          {etf && (
            <>
              <div className="px-4 py-3 flex justify-between items-center">
                <p className="text-body text-ink-sub">유형</p>
                <p className="text-body font-medium text-ink">ETF · {etf.brandName}</p>
              </div>
              <div className="px-4 py-3 flex justify-between items-center">
                <p className="text-body text-ink-sub">위험등급</p>
                <p className={`text-body font-semibold ${riskInfo?.tone}`}>{riskInfo?.label}</p>
              </div>
              <div className="px-4 py-3 flex justify-between items-center">
                <p className="text-body text-ink-sub">분배 주기</p>
                <p className="text-body font-medium text-ink">{etf.distributionCycle}</p>
              </div>
              <div className="px-4 py-3 flex justify-between items-center">
                <p className="text-body text-ink-sub">연간 배당률</p>
                <p className="font-inter text-body font-medium text-ink">{etf.annualDividendRate}%</p>
              </div>
              <div className="px-4 py-3 flex justify-between items-center">
                <p className="text-body text-ink-sub">운용사</p>
                <p className="text-body font-medium text-ink">{etf.assetManager}</p>
              </div>
            </>
          )}

          {deposit && (
            <>
              <div className="px-4 py-3 flex justify-between items-center">
                <p className="text-body text-ink-sub">유형</p>
                <p className="text-body font-medium text-ink">정기예금</p>
              </div>
              <div className="px-4 py-3 flex justify-between items-center">
                <p className="text-body text-ink-sub">금리</p>
                <p className="font-inter text-body font-medium text-ink">{deposit.interestRate}%</p>
              </div>
              <div className="px-4 py-3 flex justify-between items-center">
                <p className="text-body text-ink-sub">만기</p>
                <p className="text-body font-medium text-ink">{deposit.maturityMonths}개월</p>
              </div>
              <div className="px-4 py-3 flex justify-between items-center">
                <p className="text-body text-ink-sub">예금자보호</p>
                <p className="text-body font-medium text-ink">{deposit.depositInsurance ? '보호됨' : '비해당'}</p>
              </div>
            </>
          )}

          {pension && (
            <>
              <div className="px-4 py-3 flex justify-between items-center">
                <p className="text-body text-ink-sub">유형</p>
                <p className="text-body font-medium text-ink">{pension.pensionSavingType}</p>
              </div>
              <div className="px-4 py-3 flex justify-between items-center">
                <p className="text-body text-ink-sub">운용사</p>
                <p className="text-body font-medium text-ink">{pension.providerName}</p>
              </div>
              <div className="px-4 py-3 flex justify-between items-center">
                <p className="text-body text-ink-sub">최근 1년 수익률</p>
                <p className="font-inter text-body font-medium text-ink">{pension.returnRate1Year}%</p>
              </div>
              <div className="px-4 py-3 flex justify-between items-center">
                <p className="text-body text-ink-sub">평균 수익률</p>
                <p className="font-inter text-body font-medium text-ink">{pension.avgReturnRate}%</p>
              </div>
            </>
          )}
        </div>

        {/* ETF 실시간 가격 */}
        {etf && currentPrice != null && (
          <div className="mt-4 rounded-card border border-line px-4 py-3">
            <p className="text-sub text-ink-hint mb-1">현재가 {realtimePrice ? '· 실시간' : ''}</p>
            <p className="font-inter text-card font-bold text-ink">
              {currentPrice.toLocaleString('ko-KR')}원
            </p>
            {changePrice != null && changeRate != null && (
              <PriceChangeSign sign={sign} changePrice={changePrice} changeRate={changeRate} />
            )}
            <div className="flex gap-4 mt-2">
              <div>
                <p className="text-sub text-ink-hint">52주 최고</p>
                <p className="font-inter text-body font-medium text-ink">{etf.high52w.toLocaleString('ko-KR')}원</p>
              </div>
              <div>
                <p className="text-sub text-ink-hint">52주 최저</p>
                <p className="font-inter text-body font-medium text-ink">{etf.low52w.toLocaleString('ko-KR')}원</p>
              </div>
            </div>
          </div>
        )}

        {/* 위험 안내 */}
        {(etf || data.productType === 'ETF') && (
          <div className="mt-4 rounded-btn bg-warning-bg border border-warning/20 px-4 py-3 flex gap-3">
            <span className="shrink-0 text-warning mt-0.5">
              <WarningIcon />
            </span>
            <div>
              <p className="text-body font-semibold text-warning-text mb-0.5">원금을 잃을 수 있어요</p>
              <p className="text-sub text-warning-text/80">
                예금과 달리 시세에 따라 평가금이 줄 수 있고, 매달 받는 분배금도 정해진 게 아니라 달라질 수 있어요.
              </p>
            </div>
          </div>
        )}

        {/* 투자 설명서 */}
        {etf && (
          <div className="mt-4 flex flex-col gap-3">
            {([
              { url: etf.prospectus_url, label: '투자설명서', desc: '운용·위험·비용 상세' },
              { url: etf.simplified_url, label: '간이투자설명서', desc: '꼭 알아야 할 핵심만' },
              { url: etf.fund_rules_url, label: '집합투자규약', desc: '펀드 운용 규정 전문' },
            ] as const).map((doc) => (
              <a
                key={doc.label}
                href={doc.url ?? undefined}
                target={doc.url ? '_blank' : undefined}
                rel="noopener noreferrer"
                onClick={!doc.url ? (e) => e.preventDefault() : undefined}
                className={`flex items-center gap-3 rounded-card bg-surface px-4 py-3.5 w-full text-left ${!doc.url ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <span className="shrink-0 text-ink-sub">
                  <DocIcon />
                </span>
                <div className="flex-1">
                  <p className="text-body font-medium text-ink">{doc.label}</p>
                  <p className="text-sub text-ink-hint">{doc.desc}</p>
                </div>
                <span className="text-ink-hint">
                  <ChevronRightIcon />
                </span>
              </a>
            ))}
          </div>
        )}

        {etf && (
          <InfoBox className="mt-4">
            적합성 확인은 앞서 고르신 투자 성향과 이 상품의 위험등급({etf.riskGrade}등급)을 맞춰보는 절차예요.
          </InfoBox>
        )}
      </div>

      <div className="px-5 pb-4 shrink-0">
        <Button onClick={() => navigate(-1)}>이해했어요</Button>
      </div>
    </div>
  )
}

export default OrderProductPage
