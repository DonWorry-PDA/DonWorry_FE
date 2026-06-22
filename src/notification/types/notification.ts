export type NotificationType = 'BALANCE_ALERT' | (string & {})

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
