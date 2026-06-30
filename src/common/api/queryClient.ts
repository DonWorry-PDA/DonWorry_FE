import { QueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (!isAxiosError(error)) return failureCount < 1
        const status = error.response?.status
        if (status === 401 || status === 403) return false
        return failureCount < 1
      },
      staleTime: 1000 * 60,
    },
  },
})

export default queryClient
