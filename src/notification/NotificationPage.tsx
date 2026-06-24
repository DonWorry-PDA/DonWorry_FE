import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import { NotificationItemIc } from '../common/assets/icons'
import useGetNotifications from './hooks/useGetNotifications'
import usePatchNotificationsReadAll from './hooks/usePatchNotificationsReadAll'
import groupNotifications from './utils/groupNotifications'
import type { NotificationUIItem } from './types/notification'

function NotificationPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useGetNotifications()
  const { mutate: readAll, isPending: isReadingAll } = usePatchNotificationsReadAll()

  const notifications = groupNotifications(data ?? [])
  const hasUnread = notifications.some((g) => g.items.some((i) => i.isUnread))
  const readAllDisabled = isLoading || isError || !hasUnread || isReadingAll

  const readAllButton = (
    <button
      type="button"
      onClick={() => readAll()}
      disabled={readAllDisabled}
      aria-disabled={readAllDisabled}
    >
      <span
        className={`text-sub text-center leading-tight font-normal ${readAllDisabled ? 'text-disabled' : 'text-primary'}`}
      >
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
{isLoading && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sub text-ink-hint">불러오는 중...</p>
          </div>
        )}

        {isError && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sub text-danger">알림을 불러오지 못했어요.</p>
          </div>
        )}

        {!isLoading && !isError && notifications.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sub text-ink-hint">알림이 없어요.</p>
          </div>
        )}

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
