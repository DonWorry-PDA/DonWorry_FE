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

  const toggle = (id: string, enabled: boolean) => {
    patchSetting({ id, enabled })
  }

  return (
    <div className="flex flex-col bg-white h-dvh">
      <AppBar title="알림 설정" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto flex flex-col">
        <div className="h-[37px] shrink-0" />

        {/* 히어로 배너 */}
        <div className="px-6">
          <div
            className="rounded-card-xl px-6 pt-[23px] pb-6 flex flex-col gap-[10px]"
            style={{ background: 'linear-gradient(134.98deg, #0046FF 0%, #4F86FF 100%)' }}
          >
            <p className="text-display font-bold text-white leading-[1.4]">
              돈 흐름을 놓치지 않게
              <br />
              필요한 순간 알려드려요
            </p>
            <p className="text-body text-white opacity-90">
              잔액 부족, 연금 입금, 배당금 수령 등 중요한 현금흐름을 알려드립니다.
            </p>
          </div>
        </div>

        <div className="h-[10px] shrink-0" />

        {/* 설정 목록 */}
        <div className="px-6 flex flex-col gap-4 pb-6">
          {isLoading && (
            <div role="status" aria-live="polite" aria-busy="true" className="overflow-hidden rounded-card-xl border border-line shadow-[0px_4px_15px_0px_rgba(0,0,0,0.04)]">
              <span className="sr-only">알림 설정을 불러오는 중입니다.</span>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-[18px] ${i < 2 ? 'border-b border-divider' : ''}`}
                >
                  <div className="size-11 shrink-0 animate-pulse rounded-btn bg-surface-muted" />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="h-4 w-28 animate-pulse rounded bg-surface-muted" />
                    <div className="h-3 w-36 animate-pulse rounded bg-surface-muted" />
                  </div>
                  <div className="h-[26px] w-11 shrink-0 animate-pulse rounded-full bg-surface-muted" />
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="flex items-center justify-center py-10">
              <p className="text-sub text-danger">설정을 불러오지 못했어요.</p>
            </div>
          )}

          {!isLoading && !isError && settings.length === 0 && (
            <div className="flex items-center justify-center py-10">
              <p className="text-sub text-ink-hint">알림 설정 항목이 없어요.</p>
            </div>
          )}

          {!isLoading && !isError && settings.length > 0 && (
            <div className="border border-line rounded-card-xl shadow-[0px_4px_15px_0px_rgba(0,0,0,0.04)] overflow-hidden">
              {settings.map((item, index) => (
                <SettingRow
                  key={item.id}
                  item={item}
                  isLast={index === settings.length - 1}
                  onToggle={(enabled) => toggle(item.id, enabled)}
                />
              ))}
            </div>
          )}

          {/* 안내 문구 */}
          <div className="bg-surface rounded-card-lg p-4">
            <p className="text-sub text-ink-sub leading-[1.6]">
              잔액 부족 알림은 예정된 수입·지출을 기반으로 계산됩니다.
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

function SettingRow({
  item,
  isLast,
  onToggle,
}: {
  item: NotificationSetting
  isLast: boolean
  onToggle: (enabled: boolean) => void
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-[18px] ${
        !isLast ? 'border-b border-divider' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="bg-primary-tint rounded-btn shrink-0 size-11 flex items-center justify-center">
          <span className="text-body font-bold text-primary">{item.icon}</span>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-md font-semibold text-ink">{item.title}</p>
          <p className="text-sub text-ink-hint">{item.subtitle}</p>
        </div>
      </div>
      <Toggle checked={item.enabled} onChange={onToggle} aria-label={`${item.title} 알림 활성화`} />
    </div>
  )
}

export default NotificationSettingsPage
