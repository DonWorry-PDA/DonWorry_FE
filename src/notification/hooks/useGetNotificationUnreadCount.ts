import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'

const useGetNotificationUnreadCount = () =>
  useQuery({
    queryKey: ['notificationUnreadCount'],
    queryFn: () =>
      client
        .get<ApiResponse<number>>('/api/user/notifications/unread-count')
        .then((res) => res.data.data),
  })

export default useGetNotificationUnreadCount
