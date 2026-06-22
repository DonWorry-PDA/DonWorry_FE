import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import { NotificationItemIc } from '../common/assets/icons'
import { MOCK_NOTIFICATIONS } from './mock/notifications'
import type { NotificationUIItem } from './types/notification'

function NotificationPage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((group) => ({
        ...group,
        items: group.items.map((item) => ({ ...item, isUnread: false })),
      }))
    )
  }

  const readAllButton = (
    <button onClick={markAllRead}>
      <span className="text-sub text-primary text-center leading-tight font-normal">
        모두
        <br />
        읽음
      </span>
    </button>
  )

  return (
    <div className="flex h-dvh flex-col bg-white">
      <AppBar title="알림" onBack={() => navigate(-1)} rightAction={readAllButton} />

      <main className="flex flex-1 flex-col overflow-y-auto px-5 pt-1">
        <button
          onClick={() => navigate('/notification/settings')}
          className="border-divider flex items-center justify-between border-b py-3"
        >
          <span className="text-body text-ink font-medium">알림 설정</span>
          <span className="text-disabled text-lg">›</span>
        </button>

        {notifications.map((group) => (
          <div key={group.label}>
            <div className="pt-2 pb-[10px]">
              <span className="text-sub text-ink-hint font-semibold">{group.label}</span>
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

function NotificationListItem({ item, isLast }: { item: NotificationUIItem; isLast: boolean }) {
  if (item.isUnread) {
    return (
      <div className="pb-1">
        <div className="bg-primary-tint rounded-btn flex items-center gap-3 p-[14px]">
          <div className="rounded-icon flex size-10 shrink-0 items-center justify-center bg-white">
            <NotificationItemIc className="text-ink" width={18} height={21} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="text-md text-ink font-semibold">{item.title}</p>
            {item.subtitle && <p className="text-sub text-ink-sub">{item.subtitle}</p>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 py-4 ${!isLast ? 'border-divider border-b' : ''}`}>
      <div className="bg-surface-muted rounded-icon flex size-10 shrink-0 items-center justify-center">
        <NotificationItemIc className="text-ink" width={18} height={21} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-md text-ink font-semibold">{item.title}</p>
        {item.subtitle && <p className="text-sub text-ink-sub">{item.subtitle}</p>}
      </div>
    </div>
  )
}

export default NotificationPage
