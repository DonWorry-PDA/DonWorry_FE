import { useEffect, useRef, useState } from 'react'
import type { EtfPricePayload } from '@/order/types/product'

/**
 * 여러 ticker를 동시에 구독하는 WS 훅.
 * tickers가 빈 배열이면 연결하지 않는다.
 * 반환값: { [ticker]: currentPrice } 맵 + WS 연결 여부
 */
const useEtfPriceMap = (tickers: string[]) => {
  const [priceMap, setPriceMap] = useState<Record<string, number>>({})
  const [isLive, setIsLive] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const tickerSet = tickers.join(',') // 배열 참조 변경 방지용 문자열 키

  useEffect(() => {
    if (tickers.length === 0) return

    const base: string | undefined =
      import.meta.env.VITE_PRODUCT_API_BASE_URL ?? import.meta.env.VITE_API_BASE_URL
    if (!base) return

    const wsUrl = `${base.replace(/^http/, 'ws').replace(/\/$/, '')}/ws/etf/price`
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => setIsLive(true)
    ws.onclose = () => setIsLive(false)
    ws.onerror = () => setIsLive(false)

    ws.onmessage = (event) => {
      try {
        const payload: EtfPricePayload = JSON.parse(event.data)
        if (tickers.includes(payload.ticker)) {
          setPriceMap((prev) => ({ ...prev, [payload.ticker]: payload.currentPrice }))
        }
      } catch {
        // 파싱 실패 무시
      }
    }

    return () => {
      ws.onopen = null
      ws.onmessage = null
      ws.onclose = null
      ws.onerror = null
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close()
      }
      setIsLive(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickerSet])

  return { priceMap, isLive }
}

export default useEtfPriceMap
