import type { NotificationGroup, NotificationItem } from '../types/notification'

function getGroupLabel(createdAt: string): string {
  const now = new Date()
  const date = new Date(createdAt)
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return '오늘'
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
