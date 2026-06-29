import useGetAssetHub from './useGetAssetHub'
import useEtfPriceMap from '@/common/hooks/useEtfPriceMap'
import type { AssetHubAllocationItem } from '../types/assetHub'

/**
 * useGetAssetHub + WebSocket 실시간 가격을 합산해
 * 총자산·allocation 비율을 실시간으로 계산한다.
 *
 * - WS에서 etfHoldings의 모든 ticker 가격이 수신되면 실시간 값으로 전환
 * - 그 전까지는 hub 스냅샷 값 그대로 노출
 */
const useRealtimeAssetHub = () => {
  const { data: hub, isLoading, isError, refetch } = useGetAssetHub()

  const tickers = hub?.etfHoldings.map((h) => h.ticker) ?? []
  const { priceMap, isLive } = useEtfPriceMap(tickers)

  const allPricesReceived =
    tickers.length > 0 && tickers.every((t) => t in priceMap)

  let realtimeTotalAsset = hub?.totalAsset
  let realtimeAllocation: AssetHubAllocationItem[] | undefined = hub?.allocation

  if (hub && allPricesReceived) {
    const realtimeEtfAmount = hub.etfHoldings.reduce(
      (sum, h) => sum + h.quantity * priceMap[h.ticker],
      0,
    )
    const nonEtfAmount = hub.totalAsset - hub.etfSnapshotAmount
    const newTotal = nonEtfAmount + realtimeEtfAmount

    if (newTotal > 0) {
      realtimeTotalAsset = newTotal

      const updated: AssetHubAllocationItem[] = hub.allocation.map((item) => {
        if (item.category === 'ETF') {
          return { ...item, ratio: Math.round((realtimeEtfAmount / newTotal) * 100) }
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
