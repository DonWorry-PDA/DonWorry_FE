import { useMutation } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'

type MarketOpenReminderResponse = {
  subscribed: boolean
}

const usePostMarketOpenReminder = () =>
  useMutation({
    mutationFn: () =>
      client
        .post<ApiResponse<MarketOpenReminderResponse>>('/api/user/notifications/market-open-reminder')
        .then((res) => res.data.data),
  })

export default usePostMarketOpenReminder
