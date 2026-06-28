import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getAccessToken } from '@/common/api/token'

const SSE_RECONNECT_DELAY_MS = 5_000

const useNotificationSSE = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    let mounted = true
    let abortController: AbortController | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null

    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notificationUnreadCount'] })
    }

    const connect = async () => {
      if (!mounted) return

      const token = getAccessToken()
      if (!token) return

      abortController = new AbortController()

      try {
        const base = (import.meta.env.VITE_API_BASE_URL as string).replace(/\/$/, '')
        const res = await fetch(`${base}/api/user/notifications/subscribe`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: abortController.signal,
        })

        if (!res.ok || !res.body) throw new Error(`SSE ${res.status}`)

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (mounted) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          // SSE events are separated by double newline
          const events = buffer.split('\n\n')
          buffer = events.pop() ?? ''

          for (const event of events) {
            if (event.trim()) invalidate()
          }
        }
      } catch {
        if (!mounted) return
      }

      if (mounted) {
        reconnectTimer = setTimeout(connect, SSE_RECONNECT_DELAY_MS)
      }
    }

    connect()

    return () => {
      mounted = false
      abortController?.abort()
      if (reconnectTimer) clearTimeout(reconnectTimer)
    }
  }, [queryClient])
}

export default useNotificationSSE
