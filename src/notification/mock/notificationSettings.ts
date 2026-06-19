import type { NotificationSetting } from '../types/notification'

export const MOCK_NOTIFICATION_SETTINGS: NotificationSetting[] = [
  {
    id: 'balance',
    icon: '!',
    title: '잔액 부족 알림',
    subtitle: '예상 잔액 부족 시 안내',
    enabled: true,
  },
  {
    id: 'pension',
    icon: '₩',
    title: '연금 입금 알림',
    subtitle: '국민연금, IRP 입금 안내',
    enabled: true,
  },
  {
    id: 'dividend',
    icon: '↗',
    title: '배당금 알림',
    subtitle: '배당 예정 및 입금 안내',
    enabled: true,
  },
  {
    id: 'report',
    icon: '📊',
    title: '월간 리포트 알림',
    subtitle: '자산 변화 요약',
    enabled: false,
  },
]
