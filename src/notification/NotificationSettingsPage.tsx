import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Toggle from '../common/components/Toggle'
import BottomNav from '../common/components/BottomNav'
import useGetNotificationSettings from './hooks/useGetNotificationSettings'
import usePatchNotificationSetting from './hooks/usePatchNotificationSetting'
import type { NotificationSetting } from './types/notification'

function NotificationSettingsPage() {
  const navigate = useNavigate()
  const { data: settings = [], isLoading, isError } = useGetNotificationSettings()
  const { mutate: patchSetting } = usePatchNotificationSetting()
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set())

  const toggle = (id: string, enabled: boolean) => {
    setPendingIds((prev) => new Set(prev).add(id))
    patchSetting({ id, enabled }, {
      onSettled: () => setPendingIds((prev) => { const next = new Set(prev); next.delete(id); return next }),
    })
  }

  return (
    <div className="flex flex-col bg-white h-dvh">
      <div className="bg-white shrink-0">
        <AppBar title="알림 설정" onBack={() => navigate(-1)} />
      </div>

      <main className="flex-1 overflow-y-auto">
        {/* 설정 목록 */}
        <div className="overflow-hidden">
          {isLoading && (
            <div role="status" aria-live="polite" aria-busy="true">
              <span className="sr-only">알림 설정을 불러오는 중입니다.</span>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 px-5 py-[18px] ${i < 3 ? 'border-b border-divider' : ''}`}
                >
                  <div className="size-11 shrink-0 animate-pulse rounded-btn bg-surface-muted" />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="h-4 w-28 animate-pulse rounded bg-surface-muted" />
                    <div className="h-3 w-36 animate-pulse rounded bg-surface-muted" />
                  </div>
                  <div className="h-[30px] w-[50px] shrink-0 animate-pulse rounded-full bg-surface-muted" />
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="flex items-center justify-center py-12">
              <p className="text-sub text-danger">설정을 불러오지 못했어요.</p>
            </div>
          )}

          {!isLoading && !isError && settings.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <p className="text-sub text-ink-hint">알림 설정 항목이 없어요.</p>
            </div>
          )}

          {!isLoading && !isError && settings.map((item, index) => (
            <SettingRow
              key={item.id}
              item={item}
              isLast={index === settings.length - 1}
              disabled={pendingIds.has(item.id)}
              onToggle={(enabled) => toggle(item.id, enabled)}
            />
          ))}
        </div>

        {/* 안내 문구 */}
        <div className="px-5 mt-4">
          <p className="text-sub text-ink-hint leading-[1.6]">
            잔액 부족 알림은 예정된 수입·지출을 기반으로 계산됩니다.
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

function SettingRow({
  item,
  isLast,
  disabled,
  onToggle,
}: {
  item: NotificationSetting
  isLast: boolean
  disabled: boolean
  onToggle: (enabled: boolean) => void
}) {
  return (
    <div
      className={`flex items-center gap-4 px-5 py-[18px] ${!isLast ? 'border-b border-divider' : ''}`}
    >
      {/* 텍스트 */}
      <div className="flex-1 min-w-0 flex flex-col gap-[3px]">
        <p className="text-md font-semibold text-ink">{item.title}</p>
        <p className="text-sub text-ink-hint">{item.subtitle}</p>
      </div>

      {/* 토글 */}
      <Toggle
        checked={item.enabled}
        onChange={onToggle}
        disabled={disabled}
        aria-label={`${item.title} 알림`}
      />
    </div>
  )
}

export default NotificationSettingsPage
