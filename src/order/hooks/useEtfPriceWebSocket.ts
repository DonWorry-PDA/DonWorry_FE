import { useEffect, useRef, useState } from 'react'
import { EtfPricePayload } from '../types/product'

const WS_RECONNECT_DELAY_MS = 5_000

const useEtfPriceWebSocket = (ticker: string | undefined) => {
  const [price, setPrice] = useState<EtfPricePayload | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!ticker) return

    const base: string | undefined =
      import.meta.env.VITE_PRODUCT_API_BASE_URL ?? import.meta.env.VITE_API_BASE_URL
    if (!base) return

    const wsUrl = `${base.replace(/^http/, 'ws').replace(/\/$/, '')}/ws/etf/price`

    let mounted = true
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null

    setPrice(null)

    const connect = () => {
      if (!mounted) return

      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onmessage = (event) => {
        try {
          const payload: EtfPricePayload = JSON.parse(event.data)
          if (payload.ticker === ticker) {
            setPrice(payload)
          }
        } catch {
          // 파싱 실패 무시
        }
      }

      ws.onclose = () => {
        if (!mounted) return
        reconnectTimer = setTimeout(connect, WS_RECONNECT_DELAY_MS)
      }

      ws.onerror = () => {
        // onclose가 onerror 이후 항상 발생하므로 재연결은 onclose에서 처리
      }
    }

    connect()

    return () => {
      mounted = false
      if (reconnectTimer) clearTimeout(reconnectTimer)
      const ws = wsRef.current
      if (ws) {
        ws.onmessage = null
        ws.onclose = null
        ws.onerror = null
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close()
        }
      }
    }
  }, [ticker])

  return price
}

export default useEtfPriceWebSocket
