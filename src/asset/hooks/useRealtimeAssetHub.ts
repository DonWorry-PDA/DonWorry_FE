import { useMemo } from 'react'
import useGetAssetHub from './useGetAssetHub'
import useEtfPriceMap from '@/common/hooks/useEtfPriceMap'
import useStockPriceMap from '@/common/hooks/useStockPriceMap'

/**
 * Combines the asset hub query with ETF/stock WebSocket prices.
 *
 * The hub response is the source of truth for summary totals and allocation.
 * WebSocket prices are exposed as priceMap for per-holding display updates, but
 * should not replace hub.totalAsset because prices can arrive late or partially.
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

  const realtimeTotalAsset = hub?.totalAsset
  const realtimeAllocation = hub?.allocation

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
