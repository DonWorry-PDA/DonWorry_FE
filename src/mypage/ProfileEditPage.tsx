import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'
import useGetProfile from './hooks/useGetProfile'
import usePatchProfile from './hooks/usePatchProfile'

type RetirementStatus = '은퇴 전' | '은퇴 후'
type PensionStatus = '수령 전' | '수령 중'

function ProfileEditPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo
  const { data: profile } = useGetProfile()
  const { mutate: patchProfile, isPending } = usePatchProfile()

  const [initialized, setInitialized] = useState(false)
  const [age, setAge] = useState('')
  const [retirementStatus, setRetirementStatus] = useState<RetirementStatus>('은퇴 전')
  const [pensionStatus, setPensionStatus] = useState<PensionStatus>('수령 전')
  const [monthlyTarget, setMonthlyTarget] = useState('')
  const [toastVariant, setToastVariant] = useState<'success' | 'superseded' | 'error' | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!profile || initialized) return
    setInitialized(true)
    setAge(String(profile.age))
    setRetirementStatus(
      profile.status === '은퇴 전' || profile.status === '은퇴 후' ? profile.status : '은퇴 전',
    )
    setPensionStatus(profile.pensionStatus === '수령 중' ? '수령 중' : '수령 전')
    setMonthlyTarget(String(profile.monthlyTargetKrw / 10_000))
  }, [profile, initialized])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const ageNum = Number(age)
  const monthlyNum = Number(monthlyTarget)
  const isValid =
    /^\d+$/.test(age) && ageNum >= 1 && ageNum <= 120 &&
    /^\d+$/.test(monthlyTarget) && monthlyNum >= 0

  const handleSave = () => {
    patchProfile(
      {
        age: ageNum,
        status: retirementStatus,
        pensionStatus,
        monthlyTargetKrw: monthlyNum * 10_000,
      },
      {
        onSuccess: (data) => {
          const superseded = data?.activePlanSuperseded === true
          setToastVariant(superseded ? 'superseded' : 'success')
          timerRef.current = setTimeout(() => {
            if (returnTo) navigate(returnTo, { replace: true })
            else navigate(-1)
          }, superseded ? 2800 : 2000)
        },
        onError: () => {
          setToastVariant('error')
          timerRef.current = setTimeout(() => setToastVariant(null), 2500)
        },
      },
    )
  }

  return (
    <div className="relative flex flex-col bg-white h-dvh">
      <AppBar title="프로필 수정" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto">
        {/* 타이틀 */}
        <div className="px-6 pt-2 pb-[1.125rem]">
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
        <div className="flex flex-col gap-[1.125rem] px-6 pb-6">
          {/* 이름 (읽기 전용) */}
          <div className="flex flex-col gap-2">
            <span className="text-sub font-semibold text-ink-sub">이름</span>
            <div className="flex h-[3.375rem] w-full items-center rounded-card border border-line bg-surface px-[1.0625rem]">
              <span className="truncate text-md font-semibold text-ink-sub">{profile?.name ?? ''}</span>
            </div>
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
                    type="button"
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

          {/* 연금 수령 여부 */}
          <div className="flex flex-col gap-[0.4375rem]">
            <label className="text-sub font-semibold text-ink-sub">연금 수령 여부</label>
            <div className="flex gap-1 rounded-card bg-surface-muted p-1">
              {(['수령 전', '수령 중'] as PensionStatus[]).map((status) => {
                const isSelected = pensionStatus === status
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setPensionStatus(status)}
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
              국민연금·개인연금 등 현재 수령 중인 연금이 있으면 '수령 중'을 선택해주세요.
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
            <p className="text-caption leading-[1.6] text-[#b0b8c1]">
              국민연금·연금저축 등 예상 수령액을 빼고, 추가로 만들 금액이에요.
            </p>
          </div>
        </div>
      </main>

      <StickyFooter>
        <Button disabled={!isValid || isPending} onClick={handleSave}>
          {isPending ? '저장 중…' : '저장'}
        </Button>
      </StickyFooter>

      {/* 저장 결과 토스트 */}
      <div
        role={toastVariant === 'error' ? 'alert' : 'status'}
        aria-live={toastVariant === 'error' ? 'assertive' : 'polite'}
        aria-atomic="true"
        className={`absolute bottom-[14px] left-5 right-5 z-50 flex items-center gap-[9px] rounded-[13px] bg-[#23282f] px-4 py-[15px] shadow-float transition-all duration-300 ${
          toastVariant ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
        }`}
      >
        {toastVariant === 'error' ? (
          <>
            <div className="flex size-5 shrink-0 items-center justify-center rounded-[10px] bg-danger">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 3L9 9M9 3L3 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sub font-semibold text-white">저장에 실패했어요. 다시 시도해주세요</span>
          </>
        ) : (
          <>
            <div className="flex size-5 shrink-0 items-center justify-center rounded-[10px] bg-primary">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-sub font-semibold text-white">
              {toastVariant === 'superseded'
                ? '목표가 바뀌어 월급 설계안을 다시 맞춰야 해요'
                : '프로필이 수정됐어요'}
            </span>
          </>
        )}
      </div>
    </div>
  )
}

export default ProfileEditPage
