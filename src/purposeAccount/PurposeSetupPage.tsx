import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AppBar from '@/common/components/AppBar'
import { AccountType, ACCOUNT_META } from './types/purposeAccount'
import { TOTAL_DISTRIBUTION } from './mock/purposeAccountData'
import { formatKrw } from '@/common/utils/formatKrw'

const PRESET_GOALS: Record<AccountType, number> = {
  medical: 12_000_000,
  travel: 3_000_000,
  children: 10_000_000,
  gift: 5_000_000,
  emergency: 6_000_000,
  custom: 5_000_000,
}

const PRESET_MONTHLY: Record<AccountType, number> = {
  medical: 200_000,
  travel: 150_000,
  children: 100_000,
  gift: 50_000,
  emergency: 100_000,
  custom: 100_000,
}

interface AccountSetup {
  type: AccountType
  goal: number
  monthly: number
}

const HINT: Partial<Record<AccountType, string>> = {
  medical: '의료비 목표는 의료비 비상금 진단에서 권장한 금액(1,200만원)으로 맞췄어요. 지금 600만원 → 절반을 채우는 중.',
}

export default function PurposeSetupPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const selected: AccountType[] = location.state?.selected ?? ['medical', 'travel']

  const [setups, setSetups] = useState<AccountSetup[]>(
    selected.map((type) => ({
      type,
      goal: PRESET_GOALS[type],
      monthly: PRESET_MONTHLY[type],
    }))
  )

  return (
    <div className="flex flex-col h-dvh bg-white">
      <AppBar title="통장 설정" onBack={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-4">
        <h1 className="text-heading font-bold text-ink">얼마씩 모을까요?</h1>
        <p className="text-body text-ink-sub mt-2">
          목표와 매달 넣을 금액을 정해요. 숫자를 누르면 바꿀 수 있어요.
        </p>

        <div className="flex flex-col gap-4 mt-6">
          {setups.map((setup) => {
            const meta = ACCOUNT_META[setup.type]
            const progress = Math.min((setup.monthly * 60 / setup.goal) * 100, 100)
            return (
              <div key={setup.type} className="rounded-card-lg border border-line overflow-hidden">
                {/* Card header */}
                <div
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ backgroundColor: meta.bgColor }}
                >
                  <span className="text-body font-semibold" style={{ color: meta.color }}>
                    {meta.label} 통장
                  </span>
                </div>

                {/* Amount rows */}
                <div className="px-4 bg-white">
                  <div className="flex justify-between items-center py-3.5 border-b border-divider">
                    <span className="text-body text-ink-sub">목표 금액</span>
                    <button
                      className="font-inter text-body font-semibold text-ink"
                      onClick={() => {
                        const input = prompt('목표 금액 (만원)')
                        if (!input) return
                        const val = Number(input) * 10_000
                        if (val > 0)
                          setSetups((prev) =>
                            prev.map((s) => (s.type === setup.type ? { ...s, goal: val } : s))
                          )
                      }}
                    >
                      {formatKrw(setup.goal)}
                    </button>
                  </div>

                  <div className="flex justify-between items-center pt-3.5 pb-2">
                    <span className="text-body text-ink-sub">매달 넣을 금액</span>
                    <button
                      className="font-inter text-body font-semibold"
                      style={{ color: meta.color }}
                      onClick={() => {
                        const input = prompt('매달 금액 (만원)')
                        if (!input) return
                        const val = Number(input) * 10_000
                        if (val <= 0) return
                        const newTotal = setups.reduce(
                          (sum, s) => sum + (s.type === setup.type ? val : s.monthly),
                          0,
                        )
                        if (newTotal > TOTAL_DISTRIBUTION) {
                          alert(
                            `매달 적립 합계가 분배금(${formatKrw(TOTAL_DISTRIBUTION)})을 초과할 수 없어요.`,
                          )
                          return
                        }
                        setSetups((prev) =>
                          prev.map((s) => (s.type === setup.type ? { ...s, monthly: val } : s))
                        )
                      }}
                    >
                      매달 {formatKrw(setup.monthly)}
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 bg-track rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${progress}%`, backgroundColor: meta.color }}
                    />
                  </div>

                  {HINT[setup.type] && (
                    <p className="text-sub text-ink-hint pb-4">{HINT[setup.type]}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="shrink-0 bg-white px-6 pb-10 pt-3 border-t border-divider">
        <button
          onClick={() => navigate('/purpose-account/distribution', { state: { selected, setups } })}
          className="w-full bg-primary text-white rounded-btn text-btn font-bold py-4"
        >
          다음 · 배분 설정
        </button>
      </div>
    </div>
  )
}
