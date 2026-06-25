import Modal from '../../common/components/Modal'
import { ProductType } from '../types/product'
import useEtfPriceWebSocket from '../hooks/useEtfPriceWebSocket'
import useGetProductDetail from '../hooks/useGetProductDetail'

export type BuyItem = {
  name: string
  productType: ProductType
  amount: string
  amountWon?: number
  ticker?: string
  productId?: number
}

type Props = {
  item: BuyItem
  onConfirm: (quantity: number | undefined) => void
}

function EtfInfo({
  item,
  currentPrice,
  estimatedShares,
}: {
  item: BuyItem
  currentPrice: number | undefined
  estimatedShares: number | undefined
}) {
  return (
    <div className="flex flex-col gap-3 w-full px-5 pb-5">
      <div className="flex flex-col gap-2.5 rounded-card bg-surface px-4 py-3.5">
        <div className="flex justify-between items-center">
          <span className="text-sub text-ink-sub">현재가</span>
          <span className="font-inter text-body font-semibold text-ink">
            {currentPrice != null ? `${currentPrice.toLocaleString('ko-KR')}원` : '—'}
          </span>
        </div>
        <div className="h-px bg-divider" />
        <div className="flex justify-between items-center">
          <span className="text-sub text-ink-sub">예상 주수</span>
          <span className="font-inter text-body text-ink">
            {estimatedShares != null ? `약 ${estimatedShares.toLocaleString('ko-KR')}주` : '—'}
          </span>
        </div>
        <div className="h-px bg-divider" />
        <div className="flex justify-between items-center">
          <span className="text-sub text-ink-sub">주문 금액</span>
          <span className="font-inter text-body font-bold text-ink">{item.amount}원</span>
        </div>
      </div>
    </div>
  )
}

function DepositInfo({
  item,
  interestRate,
  maturityMonths,
  depositInsurance,
}: {
  item: BuyItem
  interestRate?: number
  maturityMonths?: number
  depositInsurance?: boolean
}) {
  return (
    <div className="flex flex-col gap-3 w-full px-5 pb-5">
      <div className="flex flex-col gap-2.5 rounded-card bg-surface px-4 py-3.5">
        {interestRate != null && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sub text-ink-sub">금리</span>
              <span className="font-inter text-body font-semibold text-ink">{interestRate}%</span>
            </div>
            <div className="h-px bg-divider" />
          </>
        )}
        {maturityMonths != null && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sub text-ink-sub">만기</span>
              <span className="text-body font-medium text-ink">{maturityMonths}개월</span>
            </div>
            <div className="h-px bg-divider" />
          </>
        )}
        {depositInsurance != null && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sub text-ink-sub">예금자보호</span>
              <span className="text-body font-medium text-ink">
                {depositInsurance ? '보호됨' : '비해당'}
              </span>
            </div>
            <div className="h-px bg-divider" />
          </>
        )}
        <div className="flex justify-between items-center">
          <span className="text-sub text-ink-sub">가입 금액</span>
          <span className="font-inter text-body font-bold text-ink">{item.amount}원</span>
        </div>
      </div>
    </div>
  )
}

function PensionInfo({
  item,
  providerName,
  returnRate1Year,
}: {
  item: BuyItem
  providerName?: string
  returnRate1Year?: number
}) {
  return (
    <div className="flex flex-col gap-3 w-full px-5 pb-5">
      <div className="flex flex-col gap-2.5 rounded-card bg-surface px-4 py-3.5">
        {providerName != null && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sub text-ink-sub">운용사</span>
              <span className="text-body font-medium text-ink">{providerName}</span>
            </div>
            <div className="h-px bg-divider" />
          </>
        )}
        {returnRate1Year != null && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sub text-ink-sub">최근 1년 수익률</span>
              <span className="font-inter text-body font-semibold text-ink">{returnRate1Year}%</span>
            </div>
            <div className="h-px bg-divider" />
          </>
        )}
        <div className="flex justify-between items-center">
          <span className="text-sub text-ink-sub">납입 금액</span>
          <span className="font-inter text-body font-bold text-ink">{item.amount}원</span>
        </div>
      </div>
    </div>
  )
}

function actionLabel(type: ProductType) {
  if (type === 'DEPOSIT') return '가입 진행'
  if (type === 'PENSION_SAVING') return '납입 진행'
  return '매수 진행'
}

function BuyConfirmModal({ item, onConfirm: onConfirmProp }: Props) {
  const realtimePrice = useEtfPriceWebSocket(
    item.productType === 'ETF' ? item.ticker : undefined
  )
  const { data: detail } = useGetProductDetail(item.productId)

  const currentPrice =
    realtimePrice?.currentPrice ?? detail?.etfDetail?.closingPrice ?? undefined
  const estimatedShares =
    currentPrice != null && item.amountWon != null
      ? Math.floor(item.amountWon / currentPrice)
      : undefined

  return (
    <Modal>
      <div className="flex flex-col items-center pt-6 pb-2">
        <p className="text-sub text-ink-hint mb-1">매수 확인</p>
        <p className="text-card font-bold text-ink mb-5 px-5 text-center">{item.name}</p>

        {item.productType === 'ETF' && (
          <EtfInfo item={item} currentPrice={currentPrice} estimatedShares={estimatedShares} />
        )}
        {item.productType === 'DEPOSIT' && (
          <DepositInfo
            item={item}
            interestRate={detail?.depositDetail?.interestRate}
            maturityMonths={detail?.depositDetail?.maturityMonths}
            depositInsurance={detail?.depositDetail?.depositInsurance}
          />
        )}
        {item.productType === 'PENSION_SAVING' && (
          <PensionInfo
            item={item}
            providerName={detail?.pensionSavingDetail?.providerName}
            returnRate1Year={detail?.pensionSavingDetail?.returnRate1Year}
          />
        )}

        <div className="flex w-full border-t border-divider">
          <button
            onClick={() => onConfirmProp(estimatedShares)}
            disabled={item.productType === 'ETF' && estimatedShares == null}
            className="flex-1 h-[52px] text-btn font-bold text-primary disabled:text-disabled"
          >
            {item.productType === 'ETF' && estimatedShares == null
              ? '시세 조회 중...'
              : actionLabel(item.productType)}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default BuyConfirmModal
