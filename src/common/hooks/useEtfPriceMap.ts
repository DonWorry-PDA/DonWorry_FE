import { useEffect, useRef, useState } from 'react'
import type { EtfPricePayload } from '@/order/types/product'

const WS_RECONNECT_DELAY_MS = 5_000

const useEtfPriceMap = (tickers: string[]) => {
  const [priceMap, setPriceMap] = useState<Record<string, number>>({})
  const [isLive, setIsLive] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const tickerSet = tickers.join(',')

  useEffect(() => {
    if (tickers.length === 0) return

    const base: string | undefined =
      import.meta.env.VITE_PRODUCT_API_BASE_URL ?? import.meta.env.VITE_API_BASE_URL
    if (!base) return

    const wsUrl = `${base.replace(/^http/, 'ws').replace(/\/$/, '')}/ws/etf/price`

    let mounted = true
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null

    setPriceMap({})

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
          const payload: EtfPricePayload = JSON.parse(event.data)
          if (tickers.includes(payload.ticker)) {
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
      setIsLive(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickerSet])

  return { priceMap, isLive }
}

export default useEtfPriceMap
