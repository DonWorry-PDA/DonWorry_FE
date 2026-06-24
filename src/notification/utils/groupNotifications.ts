import type { NotificationGroup, NotificationItem } from '../types/notification'

function toLocalDateString(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

function getGroupLabel(createdAt: string): string {
  const now = new Date()
  const date = new Date(createdAt)

  if (toLocalDateString(date) === toLocalDateString(now)) return '오늘'

  const diffDays = Math.round((now.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24))
  if (diffDays <= 6) return '이번 주'
  return '이전'
}

const GROUP_ORDER = ['오늘', '이번 주', '이전']

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
    })
  }

  return GROUP_ORDER.flatMap((label) => (map.has(label) ? [map.get(label)!] : []))
}

export default groupNotifications
