import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import type { ApiResponse } from '@/common/types/api'
import type { NotificationSetting } from '../types/notification'

type NotificationSettingRaw = Pick<NotificationSetting, 'id' | 'enabled'>

const SETTING_META: Record<string, Pick<NotificationSetting, 'icon' | 'title' | 'subtitle'>> = {
  balance: { icon: '!', title: '잔액 부족 알림', subtitle: '예상 잔액 부족 시 안내' },
  pension: { icon: '₩', title: '연금 입금 알림', subtitle: '국민연금, IRP 입금 안내' },
  dividend: { icon: '↗', title: '배당금 알림', subtitle: '배당 예정 및 입금 안내' },
  report: { icon: '📊', title: '월간 리포트 알림', subtitle: '자산 변화 요약' },
}

const useGetNotificationSettings = () =>
  useQuery({
    queryKey: ['notificationSettings'],
    queryFn: () =>
      client
        .get<ApiResponse<NotificationSettingRaw[]>>('/api/user/notifications/settings')
        .then((res) =>
          res.data.data.map((item) => ({
            ...item,
            ...(SETTING_META[item.id] ?? { icon: '', title: item.id, subtitle: '' }),
          })),
        ),
    retry: false,
  })

export default useGetNotificationSettings
