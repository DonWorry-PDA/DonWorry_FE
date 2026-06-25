import { useEffect, useRef, useState } from 'react'
import { EtfPricePayload } from '../types/product'

const BASE = (import.meta.env.VITE_PRODUCT_API_BASE_URL ?? import.meta.env.VITE_API_BASE_URL) as string
const WS_URL = `${BASE.replace(/^http/, 'ws').replace(/\/$/, '')}/ws/etf/price`

const useEtfPriceWebSocket = (ticker: string | undefined) => {
  const [price, setPrice] = useState<EtfPricePayload | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!ticker) return

    const ws = new WebSocket(WS_URL)
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
      ws.close()
    }
  }, [ticker])

  return price
}

export default useEtfPriceWebSocket
