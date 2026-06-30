import { useEffect, useRef, useState } from 'react'

// 개별주식 실시간 시세 push payload (BE StockPricePayload). EtfPricePayload와 동일 구조.
type StockPricePayload = {
  ticker: string
  currentPrice: number
  changePrice: number
  changeRate: number
  sign: string // '2'=상승 '3'=보합 '5'=하락
}

const WS_RECONNECT_DELAY_MS = 5_000

/**
 * 개별주식 ticker 목록을 WebSocket(/ws/stock/price)으로 구독해 ticker→현재가 맵을 만든다.
 * ETF(useEtfPriceMap)와 동일하게 서버가 전 종목을 broadcast하면 보유 종목만 골라 담는다.
 */
const useStockPriceMap = (tickers: string[]) => {
  const [priceMap, setPriceMap] = useState<Record<string, number>>({})
  const [isLive, setIsLive] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const tickerSet = tickers.join(',')

  useEffect(() => {
    if (tickers.length === 0) return

    const base: string | undefined =
      import.meta.env.VITE_PRODUCT_API_BASE_URL ?? import.meta.env.VITE_API_BASE_URL
    if (!base) return

    const wsUrl = `${base.replace(/^http/, 'ws').replace(/\/$/, '')}/ws/stock/price`

    let mounted = true
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null

    const connect = () => {
      if (!mounted) return

      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        if (mounted) setIsLive(true)
      }

      ws.onclose = () => {
        if (!mounted) return
        setIsLive(false)
        reconnectTimer = setTimeout(connect, WS_RECONNECT_DELAY_MS)
      }

      ws.onerror = () => {
        // onclose가 onerror 이후 항상 발생하므로 재연결은 onclose에서 처리
      }

      ws.onmessage = (event) => {
        try {
          const payload: StockPricePayload = JSON.parse(event.data)
          // 유효하지 않은 payload(비문자열 ticker·비유한 가격)는 무시해 NaN이 총자산으로 전파되지 않게 한다
          if (
            typeof payload?.ticker === 'string' &&
            typeof payload.currentPrice === 'number' &&
            Number.isFinite(payload.currentPrice) &&
            tickers.includes(payload.ticker)
          ) {
            setPriceMap((prev) => ({ ...prev, [payload.ticker]: payload.currentPrice }))
          }
        } catch {
          // 파싱 실패 무시
        }
      }
    }

    connect()

    return () => {
      mounted = false
      if (reconnectTimer) clearTimeout(reconnectTimer)
      const ws = wsRef.current
      if (ws) {
        ws.onopen = null
        ws.onmessage = null
        ws.onclose = null
        ws.onerror = null
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close()
        }
      }
      // 구독 종목 변경/해제 시 이전 시세를 비워 stale 값이 남지 않게 한다 (tickers가 비면 리셋 효과)
      setPriceMap({})
      setIsLive(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickerSet])

  return { priceMap, isLive }
}

export default useStockPriceMap
