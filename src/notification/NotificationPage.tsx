import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import { NotificationItemIc } from '../common/assets/icons'
import { MOCK_NOTIFICATIONS } from './mock/notifications'
import type { NotificationItem } from './types/notification'

function NotificationPage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((group) => ({
        ...group,
        items: group.items.map((item) => ({ ...item, isUnread: false })),
      })),
    )
  }

  const readAllButton = (
    <button onClick={markAllRead}>
      <span className="text-sub text-primary font-normal text-center leading-tight">
        모두
        <br />
        읽음
      </span>
    </button>
  )

  return (
    <div className="flex flex-col bg-white h-dvh">
      <AppBar title="알림" onBack={() => navigate(-1)} rightAction={readAllButton} />

      <main className="flex-1 overflow-y-auto flex flex-col px-5 pt-1">
        <button
          onClick={() => navigate('/notification/settings')}
          className="flex items-center justify-between py-3 border-b border-divider"
        >
          <span className="text-body font-medium text-ink">알림 설정</span>
          <span className="text-disabled text-lg">›</span>
        </button>

        {notifications.map((group) => (
          <div key={group.label}>
            <div className="pb-[10px] pt-2">
              <span className="text-sub font-semibold text-ink-hint">{group.label}</span>
            </div>
            {group.items.map((item, index) => (
              <NotificationListItem
                key={item.id}
                item={item}
                isLast={index === group.items.length - 1}
              />
            ))}
          </div>
        ))}
      </main>
    </div>
  )
}

function NotificationListItem({
  item,
  isLast,
}: {
  item: NotificationItem
  isLast: boolean
}) {
  if (item.isUnread) {
    return (
      <div className="pb-1">
        <div className="bg-primary-tint rounded-btn flex gap-3 items-center p-[14px]">
          <div className="bg-white rounded-icon shrink-0 size-10 flex items-center justify-center">
            <NotificationItemIc className="text-ink" width={18} height={21} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
            <p className="text-md font-semibold text-ink">{item.title}</p>
            <p className="text-sub text-ink-sub">{item.subtitle}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex gap-3 items-center py-4 ${!isLast ? 'border-b border-divider' : ''}`}
    >
      <div className="bg-surface-muted rounded-icon shrink-0 size-10 flex items-center justify-center">
        <NotificationItemIc className="text-ink" width={18} height={21} />
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <p className="text-md font-semibold text-ink">{item.title}</p>
        <p className="text-sub text-ink-sub">{item.subtitle}</p>
      </div>
    </div>
  )
}

export default NotificationPage
