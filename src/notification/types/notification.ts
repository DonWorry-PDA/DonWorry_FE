export type NotificationItem = {
  id: string
  title: string
  subtitle: string
  isUnread?: boolean
}

export type NotificationGroup = {
  label: string
  items: NotificationItem[]
}

export type NotificationSetting = {
  id: string
  icon: string
  title: string
  subtitle: string
  enabled: boolean
}
