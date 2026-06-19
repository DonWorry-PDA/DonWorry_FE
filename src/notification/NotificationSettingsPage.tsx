import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Toggle from '../common/components/Toggle'
import BottomNav from '../common/components/BottomNav'
import { MOCK_NOTIFICATION_SETTINGS } from './mock/notificationSettings'
import type { NotificationSetting } from './types/notification'

function NotificationSettingsPage() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState<NotificationSetting[]>(MOCK_NOTIFICATION_SETTINGS)

  const toggle = (id: string, enabled: boolean) => {
    setSettings((prev) => prev.map((s) => (s.id === id ? { ...s, enabled } : s)))
  }

  return (
    <div className="flex flex-col bg-white h-dvh">
      <AppBar title="알림 설정" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto flex flex-col">
        <div className="h-[37px] shrink-0" />

        {/* 히어로 배너 */}
        <div className="px-5">
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
        <div className="px-5 flex flex-col gap-4 pb-6">
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
