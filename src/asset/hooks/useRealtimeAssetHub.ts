import { useMemo } from 'react'
import useGetAssetHub from './useGetAssetHub'
import useEtfPriceMap from '@/common/hooks/useEtfPriceMap'
import useStockPriceMap from '@/common/hooks/useStockPriceMap'
import type { AssetHubAllocationItem } from '../types/assetHub'

/**
 * useGetAssetHub + 실시간 가격(ETF WebSocket·주식 REST 폴링)을 합산해
 * 총자산·allocation 비율을 실시간으로 계산한다.
 *
 * - ETF는 WS push, 개별주식은 by-ticker 배치 폴링으로 가격을 받는다.
 * - 두 출처의 가격을 ticker 기준 단일 priceMap으로 합쳐 자산분석 화면 종목별 평가액에도 그대로 쓴다.
 * - etf/stock 보유 ticker 가격이 모두 수신되면 실시간 총자산으로 전환, 그 전까지는 hub 스냅샷 유지.
 */
const useRealtimeAssetHub = () => {
  const { data: hub, isLoading, isError, refetch } = useGetAssetHub()

  const etfTickers = hub?.etfHoldings?.map((h) => h.ticker) ?? []
  const stockTickers = hub?.stockHoldings?.map((h) => h.ticker) ?? []
  const { priceMap: etfPriceMap, isLive } = useEtfPriceMap(etfTickers)
  const { priceMap: stockPriceMap } = useStockPriceMap(stockTickers)

  // ETF·주식 가격을 ticker 단일 맵으로 병합 (자산분석 화면이 종목별로 참조)
  const priceMap = useMemo(
    () => ({ ...etfPriceMap, ...stockPriceMap }),
    [etfPriceMap, stockPriceMap],
  )

  const etfReceived = etfTickers.every((t) => t in etfPriceMap)
  const stockReceived = stockTickers.every((t) => t in stockPriceMap)
  const hasInvested = etfTickers.length + stockTickers.length > 0
  const allPricesReceived = hasInvested && etfReceived && stockReceived

  let realtimeTotalAsset = hub?.totalAsset
  let realtimeAllocation: AssetHubAllocationItem[] | undefined = hub?.allocation

  if (hub && allPricesReceived) {
    const realtimeEtfAmount = hub.etfHoldings.reduce(
      (sum, h) => sum + h.quantity * etfPriceMap[h.ticker],
      0,
    )
    const realtimeStockAmount = hub.stockHoldings.reduce(
      (sum, h) => sum + h.quantity * stockPriceMap[h.ticker],
      0,
    )
    const snapshotInvested = hub.etfSnapshotAmount + hub.stockSnapshotAmount
    const nonInvestedAmount = hub.totalAsset - snapshotInvested
    const newTotal = nonInvestedAmount + realtimeEtfAmount + realtimeStockAmount

    if (newTotal > 0) {
      realtimeTotalAsset = newTotal

      const updated: AssetHubAllocationItem[] = hub.allocation.map((item) => {
        if (item.category === 'ETF') {
          return { ...item, ratio: Math.round((realtimeEtfAmount / newTotal) * 100) }
        }
        if (item.category === '주식') {
          return { ...item, ratio: Math.round((realtimeStockAmount / newTotal) * 100) }
        }
        const originalAmount = (item.ratio / 100) * hub.totalAsset
        return { ...item, ratio: Math.round((originalAmount / newTotal) * 100) }
      })

      // 반올림 오차 보정: 비율 합이 100이 되도록 가장 큰 항목에 흡수 (음수 방지)
      const ratioSum = updated.reduce((s, a) => s + a.ratio, 0)
      const diff = 100 - ratioSum
      if (diff !== 0 && updated.length > 0) {
        const targetIdx = updated.reduce(
          (maxIdx, item, idx) => (item.ratio > updated[maxIdx].ratio ? idx : maxIdx),
          0,
        )
        updated[targetIdx] = { ...updated[targetIdx], ratio: updated[targetIdx].ratio + diff }
      }

      realtimeAllocation = updated
    }
  }

  return {
    hub,
    realtimeTotalAsset,
    realtimeAllocation,
    priceMap,
    isLive,
    isLoading,
    isError,
    refetch,
  }
}

export default useRealtimeAssetHub
