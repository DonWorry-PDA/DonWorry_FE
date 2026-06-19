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
