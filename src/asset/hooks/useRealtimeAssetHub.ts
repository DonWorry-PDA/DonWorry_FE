import { useMemo } from 'react'
import useGetAssetHub from './useGetAssetHub'
import useEtfPriceMap from '@/common/hooks/useEtfPriceMap'
import useStockPriceMap from '@/common/hooks/useStockPriceMap'
import type { AssetHubAllocationItem } from '../types/assetHub'

/**
 * Combines the asset hub query with ETF/stock WebSocket prices.
 *
 * The hub response is the initial source of truth. WebSocket prices update the
 * summary only after every ticker in a source has a price, so partial price maps
 * never make missing holdings count as zero.
 */
const useRealtimeAssetHub = () => {
  const { data: hub, isLoading, isError, refetch } = useGetAssetHub()

  const etfTickers = hub?.etfHoldings?.map((h) => h.ticker) ?? []
  const stockTickers = hub?.stockHoldings?.map((h) => h.ticker) ?? []
  const { priceMap: etfPriceMap, isLive: etfIsLive } = useEtfPriceMap(etfTickers)
  const { priceMap: stockPriceMap, isLive: stockIsLive } = useStockPriceMap(stockTickers)
  const isLive = etfIsLive || stockIsLive

  const priceMap = useMemo(
    () => ({ ...etfPriceMap, ...stockPriceMap }),
    [etfPriceMap, stockPriceMap],
  )

  const etfReceived =
    etfTickers.length > 0 && etfTickers.every((ticker) => ticker in etfPriceMap)
  const stockReceived =
    stockTickers.length > 0 && stockTickers.every((ticker) => ticker in stockPriceMap)
  const hasRealtimeSource = etfReceived || stockReceived

  let realtimeTotalAsset = hub?.totalAsset
  let realtimeAllocation = hub?.allocation

  if (hub && hasRealtimeSource) {
    const realtimeEtfAmount = etfReceived
      ? hub.etfHoldings.reduce((sum, holding) => {
          return sum + holding.quantity * etfPriceMap[holding.ticker]
        }, 0)
      : hub.etfSnapshotAmount
    const realtimeStockAmount = stockReceived
      ? hub.stockHoldings.reduce((sum, holding) => {
          return sum + holding.quantity * stockPriceMap[holding.ticker]
        }, 0)
      : hub.stockSnapshotAmount

    const snapshotInvestedAmount = hub.etfSnapshotAmount + hub.stockSnapshotAmount
    const nonInvestedAmount = hub.totalAsset - snapshotInvestedAmount
    const nextTotalAsset = nonInvestedAmount + realtimeEtfAmount + realtimeStockAmount

    if (nextTotalAsset > 0) {
      realtimeTotalAsset = nextTotalAsset

      const nextAllocation: AssetHubAllocationItem[] = hub.allocation.map((item) => {
        if (item.category === 'ETF') {
          return { ...item, ratio: Math.round((realtimeEtfAmount / nextTotalAsset) * 100) }
        }
        if (item.category === '주식') {
          return { ...item, ratio: Math.round((realtimeStockAmount / nextTotalAsset) * 100) }
        }

        const originalAmount = (item.ratio / 100) * hub.totalAsset
        return { ...item, ratio: Math.round((originalAmount / nextTotalAsset) * 100) }
      })

      const ratioSum = nextAllocation.reduce((sum, item) => sum + item.ratio, 0)
      const diff = 100 - ratioSum

      if (diff !== 0 && nextAllocation.length > 0) {
        const targetIndex = nextAllocation.reduce(
          (maxIndex, item, index) =>
            item.ratio > nextAllocation[maxIndex].ratio ? index : maxIndex,
          0,
        )
        nextAllocation[targetIndex] = {
          ...nextAllocation[targetIndex],
          ratio: nextAllocation[targetIndex].ratio + diff,
        }
      }

      realtimeAllocation = nextAllocation
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
