import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import type { ApiResponse } from '@/common/types/api'
import type { NotificationSetting } from '../types/notification'

const useGetNotificationSettings = () =>
  useQuery({
    queryKey: ['notificationSettings'],
    queryFn: () =>
      client
        .get<ApiResponse<NotificationSetting[]>>('/api/user/notifications/settings')
        .then((res) => res.data.data),
  })

export default useGetNotificationSettings
