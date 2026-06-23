import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'
import { MOCK_USER_PROFILE } from './mock/mypage'

type RetirementStatus = '은퇴 전' | '은퇴 후'

const SALARY_CHIPS = [180, 220, 300]

function ProfileEditPage() {
  const navigate = useNavigate()
  const profile = MOCK_USER_PROFILE

  const [name, setName] = useState(profile.name)
  const [age, setAge] = useState(String(profile.age))
  const [retirementStatus, setRetirementStatus] = useState<RetirementStatus>(
    profile.status === '은퇴 전' ? '은퇴 전' : '은퇴 후',
  )
  const [monthlyTarget, setMonthlyTarget] = useState(
    String(profile.monthlyTargetKrw / 10_000),
  )

  return (
    <div className="flex flex-col bg-white h-dvh">
      <AppBar title="프로필 수정" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto">
        {/* 타이틀 */}
        <div className="px-5 pt-2 pb-[1.125rem]">
          <h2 className="text-heading font-extrabold text-ink leading-[1.43] tracking-[-0.025em] mb-[0.5625rem]">
            내 정보를 바꾸면
            <br />
            월급·안정도가 다시 계산돼요
          </h2>
          <p className="text-sub text-ink-hint">
            온보딩에서 입력한 내용을 언제든 수정할 수 있어요.
          </p>
        </div>

        {/* 폼 */}
        <div className="flex flex-col gap-[1.125rem] px-5 pb-6">
          {/* 이름 */}
          <div className="flex flex-col gap-2">
            <label className="text-sub font-semibold text-ink-sub">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-[3.375rem] w-full rounded-card border border-line bg-white px-[1.0625rem] text-md font-semibold text-ink outline-none focus:border-primary"
            />
          </div>

          {/* 나이 */}
          <div className="flex flex-col gap-2">
            <label className="text-sub font-semibold text-ink-sub">나이</label>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="h-[3.375rem] w-full rounded-card border border-line bg-white pl-[1.0625rem] pr-[2.9375rem] text-md font-extrabold text-ink text-right outline-none focus:border-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-md font-bold text-ink-hint">
                세
              </span>
            </div>
          </div>

          {/* 은퇴 여부 */}
          <div className="flex flex-col gap-[0.4375rem]">
            <label className="text-sub font-semibold text-ink-sub">은퇴 여부</label>
            <div className="flex gap-1 rounded-card bg-surface-muted p-1">
              {(['은퇴 전', '은퇴 후'] as RetirementStatus[]).map((status) => {
                const isSelected = retirementStatus === status
                return (
                  <button
                    key={status}
                    onClick={() => setRetirementStatus(status)}
                    className={`flex h-[2.875rem] flex-1 items-center justify-center rounded-icon text-md transition-all ${
                      isSelected
                        ? 'bg-white font-bold text-primary shadow-[0px_1px_2px_rgba(0,0,0,0.10)]'
                        : 'font-semibold text-ink-sub'
                    }`}
                  >
                    {status}
                  </button>
                )
              })}
            </div>
            <p className="text-caption leading-[1.6] text-[#b0b8c1]">
              '은퇴 전' 선택 시 예상 은퇴 나이를 입력받아 인출 계획을 세워드려요.
            </p>
          </div>

          {/* 매달 만들 월급 */}
          <div className="flex flex-col gap-[0.4375rem]">
            <label className="text-sub font-semibold text-ink-sub">
              매달 만들 월급 (목표 생활비)
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                value={monthlyTarget}
                onChange={(e) => setMonthlyTarget(e.target.value)}
                className="h-[3.375rem] w-full rounded-card border border-line bg-white pl-[1.0625rem] pr-[3.5rem] text-md font-extrabold text-ink text-right outline-none focus:border-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-md font-bold text-ink-hint">
                만원
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-[0.1875rem]">
              {SALARY_CHIPS.map((amount) => {
                const isSelected = monthlyTarget === String(amount)
                return (
                  <button
                    key={amount}
                    onClick={() => setMonthlyTarget(String(amount))}
                    className={`h-10 rounded-[11px] px-4 text-body font-semibold transition-colors ${
                      isSelected
                        ? 'bg-primary-tint text-primary'
                        : 'bg-surface-muted text-ink-sub'
                    }`}
                  >
                    {amount}만원
                  </button>
                )
              })}
            </div>
            <p className="text-caption leading-[1.6] text-[#b0b8c1]">
              국민연금·연금저축 등 예상 수령액을 빼고, 추가로 만들 금액이에요.
            </p>
          </div>
        </div>
      </main>

      <StickyFooter>
        <Button onClick={() => navigate(-1)}>저장</Button>
      </StickyFooter>
    </div>
  )
}

export default ProfileEditPage
