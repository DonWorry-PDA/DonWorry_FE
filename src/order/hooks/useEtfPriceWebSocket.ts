import { useEffect, useRef, useState } from 'react'
import { EtfPricePayload } from '../types/product'

const useEtfPriceWebSocket = (ticker: string | undefined) => {
  const [price, setPrice] = useState<EtfPricePayload | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!ticker) return

    const base: string | undefined =
      import.meta.env.VITE_PRODUCT_API_BASE_URL ?? import.meta.env.VITE_API_BASE_URL
    if (!base) return

    const wsUrl = `${base.replace(/^http/, 'ws').replace(/\/$/, '')}/ws/etf/price`
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

    return () => {
      ws.onmessage = null
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close()
      }
    }
  }, [ticker])

  return price
}

export default useEtfPriceWebSocket
