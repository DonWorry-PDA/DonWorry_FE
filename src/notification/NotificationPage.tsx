import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import { NotificationIc } from '../common/assets/icons'
import useGetNotifications from './hooks/useGetNotifications'
import usePatchNotificationsReadAll from './hooks/usePatchNotificationsReadAll'
import usePatchNotificationRead from './hooks/usePatchNotificationRead'
import groupNotifications from './utils/groupNotifications'
import type { NotificationUIItem } from './types/notification'

type TypeConfig = { bg: string; iconColor: string }

const TYPE_CONFIG: Record<string, TypeConfig> = {
  PENSION_DEPOSIT: { bg: 'bg-success-bg', iconColor: 'text-success' },
  DIVIDEND:        { bg: 'bg-success-bg', iconColor: 'text-success' },
  MONTHLY_REPORT:  { bg: 'bg-warning-bg', iconColor: 'text-warning' },
  BALANCE_ALERT:   { bg: 'bg-danger-bg',  iconColor: 'text-danger'  },
}

const DEFAULT_TYPE_CONFIG: TypeConfig = { bg: 'bg-primary-tint', iconColor: 'text-primary' }

function getTypeConfig(type?: string): TypeConfig {
  return (type && TYPE_CONFIG[type]) || DEFAULT_TYPE_CONFIG
}

function formatRelativeTime(createdAt?: string): string {
  if (!createdAt) return ''
  const now = new Date()
  const date = new Date(createdAt)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}분 전`
  if (diffHours < 24) return `${diffHours}시간 전`
  if (diffDays <= 6) return `${diffDays}일 전`

  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${m}월 ${d}일`
}

function GearIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function NotificationPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useGetNotifications()
  const { mutate: readAll, isPending: isReadingAll } = usePatchNotificationsReadAll()
  const { mutateAsync: readOne } = usePatchNotificationRead()

  const notifications = groupNotifications(data ?? [])
  const hasUnread = notifications.some((g) => g.items.some((i) => i.isUnread))

  const handleItemClick = async (item: NotificationUIItem) => {
    if (item.isUnread) {
      try {
        await readOne(Number(item.id))
      } catch {
        // 읽음 처리 실패해도 이동은 수행
      }
    }
    if (item.linkTarget) navigate(item.linkTarget)
  }

  const settingsButton = (
    <button
      type="button"
      onClick={() => navigate('/notification/settings')}
      aria-label="알림 설정"
      className="text-ink"
    >
      <GearIcon />
    </button>
  )

  return (
    <div className="flex h-dvh flex-col bg-white">
      <AppBar title="알림" onBack={() => navigate(-1)} rightAction={settingsButton} />

      <main className="flex flex-1 flex-col overflow-y-auto">
        {/* 모두 읽음 */}
        {!isLoading && !isError && hasUnread && (
          <div className="flex justify-end px-5 pt-1 pb-1">
            <button
              type="button"
              onClick={() => readAll()}
              disabled={isReadingAll}
              className="text-sub text-ink-hint disabled:text-disabled active:opacity-60"
            >
              모두 읽음
            </button>
          </div>
        )}

        {/* 로딩 스켈레톤 */}
        {isLoading && (
          <div role="status" aria-live="polite" aria-busy="true" className="flex flex-col px-5 pt-4">
            <span className="sr-only">알림을 불러오는 중입니다.</span>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 py-[14px] border-b border-divider">
                <div className="size-11 shrink-0 animate-pulse rounded-full bg-surface-muted" />
                <div className="flex flex-1 flex-col gap-2 pt-1">
                  <div className="flex justify-between gap-4">
                    <div className="h-4 w-1/3 animate-pulse rounded bg-surface-muted" />
                    <div className="h-3 w-10 animate-pulse rounded bg-surface-muted" />
                  </div>
                  <div className="h-3 w-full animate-pulse rounded bg-surface-muted" />
                  <div className="h-3 w-4/5 animate-pulse rounded bg-surface-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 에러 */}
        {isError && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sub text-danger">알림을 불러오지 못했어요.</p>
          </div>
        )}

        {/* 빈 상태 */}
        {!isLoading && !isError && notifications.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2">
            <div className="size-14 rounded-full bg-surface-muted flex items-center justify-center">
              <NotificationIc className="text-ink-hint" width={24} height={24} />
            </div>
            <p className="text-body text-ink-sub mt-2">아직 알림이 없어요</p>
            <p className="text-sub text-ink-hint">중요한 소식이 생기면 알려드릴게요</p>
          </div>
        )}

        {/* 알림 목록 */}
        {notifications.map((group) => (
          <div key={group.label}>
            <div className="flex items-center gap-3 px-5 pt-5 pb-3">
              <span className="text-sub font-semibold text-ink-sub shrink-0">{group.label}</span>
              <div className="flex-1 h-px bg-divider" />
            </div>

            <div className="px-5">
              {group.items.map((item) => (
                <NotificationListItem
                  key={item.id}
                  item={item}
                  onClick={() => { void handleItemClick(item) }}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="h-8 shrink-0" />
      </main>
    </div>
  )
}

function NotificationListItem({
  item,
  onClick,
}: {
  item: NotificationUIItem
  onClick: () => void
}) {
  const { bg, iconColor } = getTypeConfig(item.notificationType)
  const timeText = formatRelativeTime(item.createdAt)

  const inner = (
    <div className={`flex items-start gap-3 py-[14px] rounded-card border-b border-divider ${item.isUnread ? 'bg-primary-tint border-transparent' : 'bg-white'}`}>
      {/* 타입 아이콘 */}
      <div className={`size-11 shrink-0 rounded-full flex items-center justify-center ${bg}`}>
        <NotificationIc className={iconColor} width={20} height={20} />
      </div>

      {/* 텍스트 영역 */}
      <div className="flex min-w-0 flex-1 flex-col gap-[5px] pt-[2px]">
        <div className="flex items-center justify-between gap-2">
          <p className={`text-body font-semibold leading-tight ${item.isUnread ? 'text-ink' : 'text-ink-sub'} flex-1 min-w-0`}>
            {item.title}
          </p>
          {timeText && (
            <span className="text-caption text-ink-hint shrink-0">{timeText}</span>
          )}
        </div>
        {item.subtitle && (
          <p className="text-sub text-ink-hint leading-[1.5]">{item.subtitle}</p>
        )}
      </div>
    </div>
  )

  if (item.linkTarget || item.isUnread) {
    return (
      <button type="button" onClick={onClick} className="w-full text-left mb-1 active:opacity-70">
        {inner}
      </button>
    )
  }

  return <div className="mb-1">{inner}</div>
}

export default NotificationPage
