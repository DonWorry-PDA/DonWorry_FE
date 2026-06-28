export type NotificationType = 'PENSION_DEPOSIT' | 'DIVIDEND' | 'MONTHLY_REPORT' | (string & {})

// UI(목/로컬) 알림 아이템 — API 응답과 별도
export type NotificationUIItem = {
  id: string
  title: string
  subtitle?: string
  isUnread?: boolean
  linkTarget?: string
}

export type NotificationGroup = {
  label: string
  items: NotificationUIItem[]
}

export type NotificationItem = {
  notificationId: number
  notificationType: NotificationType
  title: string
  content: string
  linkTarget: string
  read: boolean
  createdAt: string
}

export type NotificationSetting = {
  id: string
  icon: string
  title: string
  subtitle: string
  enabled: boolean
}
