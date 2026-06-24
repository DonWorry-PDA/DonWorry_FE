import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import type { ApiResponse } from '@/common/types/api'
import type { NotificationSetting } from '../types/notification'
import { MOCK_NOTIFICATION_SETTINGS } from '../mock/notificationSettings'

const useGetNotificationSettings = () =>
  useQuery({
    queryKey: ['notificationSettings'],
    queryFn: () =>
      client
        .get<ApiResponse<NotificationSetting[]>>('/api/user/notifications/settings')
        .then((res) => res.data.data),
    // TODO: 백엔드 구현 완료 후 제거
    placeholderData: MOCK_NOTIFICATION_SETTINGS,
    retry: false,
  })

export default useGetNotificationSettings
