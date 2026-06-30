import { createContext, useContext, useMemo } from 'react'
import useGetAssetHub from '@/asset/hooks/useGetAssetHub'
import useEtfPriceMap from '@/common/hooks/useEtfPriceMap'
import useStockPriceMap from '@/common/hooks/useStockPriceMap'

type RealtimePriceContextValue = {
  priceMap: Record<string, number>
  isLive: boolean
}

const RealtimePriceContext = createContext<RealtimePriceContextValue>({
  priceMap: {},
  isLive: false,
})

export function RealtimePriceProvider({ children }: { children: React.ReactNode }) {
  const { data: hub } = useGetAssetHub()

  const etfTickers = hub?.etfHoldings?.map((h) => h.ticker) ?? []
  const stockTickers = hub?.stockHoldings?.map((h) => h.ticker) ?? []

  const { priceMap: etfPriceMap, isLive: etfIsLive } = useEtfPriceMap(etfTickers)
  const { priceMap: stockPriceMap, isLive: stockIsLive } = useStockPriceMap(stockTickers)

  const priceMap = useMemo(
    () => ({ ...etfPriceMap, ...stockPriceMap }),
    [etfPriceMap, stockPriceMap],
  )

  const isLive = etfIsLive || stockIsLive

  return (
    <RealtimePriceContext.Provider value={{ priceMap, isLive }}>
      {children}
    </RealtimePriceContext.Provider>
  )
}

export function useRealtimePrice() {
  return useContext(RealtimePriceContext)
}
