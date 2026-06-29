import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AppBar from '@/common/components/AppBar'
import Toggle from '@/common/components/Toggle'
import { AccountType, ACCOUNT_META } from './types/purposeAccount'
import { formatKrw } from '@/common/utils/formatKrw'

interface AccountSetup {
  type: AccountType
  goal: number
  monthly: number
}

const TOTAL_DISTRIBUTION = 550_000

export default function PurposeDistributionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setups: AccountSetup[] = location.state?.setups ?? [
    { type: 'medical', goal: 12_000_000, monthly: 200_000 },
    { type: 'travel', goal: 3_000_000, monthly: 150_000 },
    { type: 'emergency', goal: 6_000_000, monthly: 100_000 },
  ]

  const [autoDistribute, setAutoDistribute] = useState(true)

  const allocated = setups.reduce((sum, s) => sum + s.monthly, 0)
  const free = TOTAL_DISTRIBUTION - allocated

  const barItems = [
    ...setups.map((s) => ({
      label: ACCOUNT_META[s.type].label,
      amount: s.monthly,
      color: ACCOUNT_META[s.type].color,
    })),
    ...(free > 0 ? [{ label: '자유롭게 쓰기', amount: free, color: 'var(--color-track)' }] : []),
  ]

  return (
    <div className="flex flex-col h-dvh bg-white">
      <AppBar title="자동 배분" onBack={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-4">
        <h1 className="text-heading font-bold text-ink">
          매달 이렇게
          <br />
          나눠 담을게요
        </h1>

        {/* Total + Distribution bar */}
        <div className="mt-6 bg-surface rounded-card-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sub text-ink-hint">매달 들어오는 분배금</span>
            <span className="font-inter text-body font-bold text-ink">
              {formatKrw(TOTAL_DISTRIBUTION)}
            </span>
          </div>

          {/* Stacked bar */}
          <div className="flex h-3 rounded-full overflow-hidden gap-px">
            {barItems.map((item) => (
              <div
                key={item.label}
                className="h-full"
                style={{
                  width: `${(item.amount / TOTAL_DISTRIBUTION) * 100}%`,
                  backgroundColor: item.color,
                }}
              />
            ))}
          </div>

          {/* Distribution list */}
          <div className="flex flex-col gap-3 mt-4">
            {setups.map((setup) => {
              const meta = ACCOUNT_META[setup.type]
              return (
                <div key={setup.type} className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: meta.color }}
                  />
                  <span className="text-body text-ink flex-1">{meta.label} 통장</span>
                  <span className="font-inter text-body font-semibold text-ink">
                    {formatKrw(setup.monthly)}
                  </span>
                </div>
              )
            })}
            {free > 0 && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-track flex-shrink-0" />
                <span className="text-body text-ink-sub flex-1">자유롭게 쓰기</span>
                <span className="font-inter text-body font-semibold text-ink-sub">
                  {formatKrw(free)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Auto-distribute toggle */}
        <div className="mt-4 flex items-center justify-between py-4 border-b border-divider">
          <div>
            <p className="text-body font-semibold text-ink">매달 자동으로 배분</p>
            <p className="text-sub text-ink-hint mt-0.5">분배금 입금일(매달 15일)에 실행</p>
          </div>
          <Toggle
            checked={autoDistribute}
            onChange={setAutoDistribute}
            aria-label="자동 배분 켜기/끄기"
          />
        </div>

        {/* Info */}
        <div className="mt-4 bg-surface-muted rounded-card px-4 py-3">
          <p className="text-sub text-ink-sub">
            분배금이 예상보다 적게 들어온 달엔, 위 순서대로 채우고 모자라면 마지막 항목부터 줄여요.
          </p>
        </div>
      </div>

      <div className="shrink-0 bg-white px-6 pb-10 pt-3 border-t border-divider">
        <button
          onClick={() => navigate('/purpose-account/dashboard', { state: { autoDistribute } })}
          className="w-full bg-primary text-white rounded-btn text-btn font-bold py-4"
        >
          {autoDistribute ? '자동 배분 켜기' : '설정 완료'}
        </button>
      </div>
    </div>
  )
}
