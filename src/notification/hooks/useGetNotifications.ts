import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import { NotificationItem } from '../types/notification'

const useGetNotifications = () =>
  useQuery({
    queryKey: ['notifications'],
    queryFn: () =>
      client
        .get<ApiResponse<NotificationItem[]>>('/api/user/notifications')
        .then((res) => res.data.data),
  })

export default useGetNotifications
