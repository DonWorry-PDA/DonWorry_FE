import type { NotificationGroup, NotificationItem } from '../types/notification'

function getGroupLabel(createdAt: string): string {
  const now = new Date()
  const date = new Date(createdAt)
  const diffDays = Math.round(
    (now.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24),
  )
  return diffDays <= 7 ? '최근 7일' : '이전 알림'
}

const GROUP_ORDER = ['최근 7일', '이전 알림']

function groupNotifications(items: NotificationItem[]): NotificationGroup[] {
  const map = new Map<string, NotificationGroup>()

  for (const item of items) {
    const label = getGroupLabel(item.createdAt)
    if (!map.has(label)) {
      map.set(label, { label, items: [] })
    }
    map.get(label)!.items.push({
      id: String(item.notificationId),
      title: item.title,
      subtitle: item.content || undefined,
      isUnread: !item.read,
      linkTarget: item.linkTarget || undefined,
      createdAt: item.createdAt,
      notificationType: item.notificationType,
    })
  }

  return GROUP_ORDER.flatMap((label) => (map.has(label) ? [map.get(label)!] : []))
}

export default groupNotifications
