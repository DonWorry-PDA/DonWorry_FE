import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getAccessToken } from '@/common/api/token'
import { dispatchAuthFailure } from '@/common/api/authEvents'

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

    const scheduleReconnect = () => {
      if (!mounted || document.hidden) return
      reconnectTimer = setTimeout(connect, SSE_RECONNECT_DELAY_MS)
    }

    const connect = async () => {
      if (!mounted || document.hidden) return

      if (reconnectTimer) {
        clearTimeout(reconnectTimer)
        reconnectTimer = null
      }

      const token = getAccessToken()
      if (!token) {
        scheduleReconnect()
        return
      }

      abortController = new AbortController()

      try {
        const base = (import.meta.env.VITE_API_BASE_URL as string).replace(/\/$/, '')
        const res = await fetch(`${base}/api/user/notifications/subscribe`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: abortController.signal,
        })

        if (!res.ok || !res.body) {
          if (res.status === 401) { dispatchAuthFailure(); return }
          throw new Error(`SSE ${res.status}`)
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (mounted) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const events = buffer.split('\n\n')
          buffer = events.pop() ?? ''

          for (const event of events) {
            if (event.trim()) invalidate()
          }
        }
      } catch {
        if (!mounted) return
      }

      scheduleReconnect()
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 탭이 백그라운드로 가기 전에 먼저 끊어 ERR_NETWORK_IO_SUSPENDED를 방지한다.
        abortController?.abort()
        if (reconnectTimer) {
          clearTimeout(reconnectTimer)
          reconnectTimer = null
        }
      } else {
        connect()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    connect()

    return () => {
      mounted = false
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      abortController?.abort()
      if (reconnectTimer) clearTimeout(reconnectTimer)
    }
  }, [queryClient])
}

export default useNotificationSSE
