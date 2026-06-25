import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import queryClient from '../common/api/queryClient'
import { clearTokens } from '../common/api/token'
import usePostLogout from './hooks/usePostLogout'
import useGetProfile from './hooks/useGetProfile'
import { useGetConsultations } from './hooks/consultation'
import { formatScheduledAt } from './utils/consultation'
import { NotificationIc, NotificationItemIc } from '../common/assets/icons'
import Toggle from '../common/components/Toggle'
import BottomNav from '../common/components/BottomNav'
import Modal from '../common/components/Modal'
import { MOCK_LINKED_ACCOUNTS } from './mock/mypage'
import { formatKrw } from '../common/utils/formatKrw'
import type { LinkedAccount } from './types/mypage'

type LogoutStep = 'idle' | 'confirm' | 'done'

function MypagePage() {
  const navigate = useNavigate()
  const [largeFontEnabled, setLargeFontEnabled] = useState(
    () => localStorage.getItem('largeFont') === 'true',
  )

  const handleLargeFontToggle = (enabled: boolean) => {
    setLargeFontEnabled(enabled)
    localStorage.setItem('largeFont', String(enabled))
    document.documentElement.classList.toggle('large', enabled)
  }
  const [logoutStep, setLogoutStep] = useState<LogoutStep>('idle')

  const { data: profile, isPending: isProfilePending, isError: isProfileError } = useGetProfile()
  const { mutate: logout, isPending: isLoggingOut } = usePostLogout()
  const { data: consultations } = useGetConsultations()

  // 가장 가까운 예약(RESERVED)을 상담 내역 메뉴 부제로
  const nextReserved = (consultations ?? [])
    .filter((c) => c.status === 'RESERVED')
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))[0]
  const consultSubtitle = nextReserved
    ? `${formatScheduledAt(nextReserved.scheduledAt)} 상담 예약됨`
    : '예약·지난 상담 확인'

  // 로그아웃: API 호출 후 성공·실패 모두 클라이언트 토큰·캐시를 정리한다
  const handleLogout = () => {
    logout(undefined, {
      onSettled: () => {
        clearTokens()
        queryClient.clear()
        setLogoutStep('done')
      },
    })
  }

  return (
    <div className="relative flex flex-col bg-white h-dvh">
      {/* 헤더 */}
      <header className="flex h-[52px] items-center pl-6 pr-[14px]">
        <img src="/logos/sol-mark.svg" alt="SOL" width={36} height={36} className="mr-3 shrink-0" />
        <h1 className="flex-1 text-heading font-bold text-ink">마이페이지</h1>
        <button
          className="flex size-11 items-center justify-center"
          onClick={() => navigate('/notification')}
        >
          <NotificationIc className="text-ink" width={22} height={22} />
        </button>
      </header>

      {/* 스크롤 영역 */}
      <main className="flex-1 overflow-y-auto px-6 pt-4">
        {/* 프로필 */}
        <div className="flex items-center gap-[14px] border-b border-line py-[19px] pt-2">
          <div className="bg-primary-tint flex size-[54px] shrink-0 items-center justify-center rounded-full">
            <NotificationItemIc className="text-primary" width={24} height={29} />
          </div>
          <div className="flex flex-1 min-w-0 flex-col gap-[3px]">
            {isProfilePending ? (
              <>
                <div className="h-5 w-28 animate-pulse rounded bg-surface-muted" />
                <div className="mt-1 h-4 w-48 animate-pulse rounded bg-surface-muted" />
              </>
            ) : isProfileError ? (
              <p className="text-sub text-ink-hint">프로필을 불러오지 못했어요</p>
            ) : (
              <>
                <p className="text-card font-bold text-ink">{profile.name}님</p>
                <p className="text-sub text-ink-hint">
                  {profile.age}세 · {profile.status} · 목표 생활비 월{' '}
                  {(profile.monthlyTargetKrw / 10_000).toLocaleString('ko-KR')}만원
                </p>
              </>
            )}
          </div>
          <button className="shrink-0" onClick={() => navigate('/mypage/profile-edit')}>
            <span className="text-sub font-semibold text-primary">수정</span>
          </button>
        </div>

        {/* 연결된 계좌 */}
        <div className="pb-[10px] pt-[18px]">
          <p className="text-sub font-semibold text-ink-hint">연결된 계좌</p>
        </div>

        {MOCK_LINKED_ACCOUNTS.map((account) => (
          <AccountRow key={account.id} account={account} />
        ))}

        {/* 계좌 더 연결하기 */}
        <button className="flex w-full items-center gap-3 py-[13px]" onClick={() => navigate('/mypage/connect-account')}>
          <div className="bg-primary-tint flex size-10 shrink-0 items-center justify-center rounded-icon">
            <span className="text-card font-bold text-primary">＋</span>
          </div>
          <div className="flex flex-1 min-w-0 flex-col gap-0.5">
            <p className="text-md font-semibold text-primary text-left">계좌 더 연결하기</p>
            <p className="text-sub text-ink-sub text-left">빠진 자산이 있다면</p>
          </div>
        </button>

        {/* 구분선 */}
        <div className="relative -mx-5 h-7">
          <div className="absolute inset-x-0 top-[10px] h-2 bg-surface" />
        </div>

        {/* 큰 글씨로 보기 */}
        <div className="flex items-center border-b border-divider py-4">
          <p className="flex-1 text-md font-semibold text-ink">큰 글씨로 보기</p>
          <Toggle checked={largeFontEnabled} onChange={handleLargeFontToggle} size="sm" aria-label="큰 글씨로 보기" />
        </div>

        {/* 설정 메뉴 */}
        <MenuRow
          title="알림 설정"
          subtitle="입금일 · 잔액 부족 경고 켜짐"
          onPress={() => navigate('/notification/settings')}
        />
        <MenuRow
          title="상담 내역"
          subtitle={consultSubtitle}
          onPress={() => navigate('/mypage/consult-history')}
        />
        <MenuRow title="약관 및 동의 내역" onPress={() => navigate('/mypage/terms')} />

        {/* 로그아웃 */}
        <button
          className="flex w-full items-center py-[15px]"
          onClick={() => setLogoutStep('confirm')}
        >
          <p className="text-md font-medium text-ink-sub">로그아웃</p>
        </button>
      </main>

      <BottomNav />

      {/* 로그아웃 확인 모달 */}
      {logoutStep === 'confirm' && (
        <Modal>
          <div className="flex flex-col items-center gap-[7.5px] px-[22px] pb-[18px] pt-[26px]">
            <div className="bg-primary-tint flex size-14 items-center justify-center rounded-[28px]">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <circle cx="13" cy="13" r="11" stroke="#0046FF" strokeWidth="2" />
                <path d="M9.5 9.5L16.5 16.5M16.5 9.5L9.5 16.5" stroke="#0046FF" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex flex-col items-center pt-[7.5px]">
              <p className="text-[17px] font-extrabold text-ink text-center tracking-[-0.3px]">
                로그아웃 할까요?
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sub text-ink-hint text-center leading-[1.65]">
                저장된 자산·상담 정보는 그대로 보관돼요.
                <br />
                다시 로그인하면 이어서 볼 수 있어요.
              </p>
            </div>
            <div className="flex w-full gap-[9px] pt-[12.5px]">
              <button
                className="flex h-[50px] flex-1 items-center justify-center rounded-[13px] border border-line text-btn font-bold text-ink"
                onClick={() => setLogoutStep('idle')}
              >
                취소
              </button>
              <button
                className="bg-primary flex h-[50px] flex-1 items-center justify-center rounded-[13px] text-btn font-bold text-white disabled:opacity-50"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? '처리 중…' : '로그아웃'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 로그아웃 완료 모달 */}
      {logoutStep === 'done' && (
        <Modal>
          <div className="flex flex-col items-center gap-2 px-[22px] pb-[18px] pt-[26px]">
            <div className="bg-primary-tint flex size-14 items-center justify-center rounded-[28px]">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M6 14.5L11.5 20L22 8" stroke="#0046FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex flex-col items-center pt-[7px]">
              <p className="text-[17px] font-extrabold text-ink text-center tracking-[-0.3px] leading-[1.4]">
                연금SOL사에서
                <br />
                로그아웃됐어요
              </p>
            </div>
            <div className="flex flex-col items-center pb-3">
              <p className="text-sub text-ink-hint text-center leading-[1.65]">
                이용해주셔서 감사해요. 홈에서 다시 만나요.
              </p>
            </div>
            <button
              className="bg-primary flex h-[50px] w-full items-center justify-center rounded-[13px] text-btn font-bold text-white"
              onClick={() => navigate('/login')}
            >
              확인
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function AccountRow({ account }: { account: LinkedAccount }) {
  return (
    <div className="flex items-center gap-3 border-b border-divider py-[13px]">
      <div className="bg-surface-muted flex size-10 shrink-0 items-center justify-center rounded-icon">
        <NotificationItemIc className="text-ink" width={18} height={21} />
      </div>
      <div className="flex flex-1 min-w-0 flex-col gap-0.5">
        <p className="text-md font-semibold text-ink">{account.name}</p>
        <p className="text-sub text-ink-sub">{account.detail}</p>
      </div>
      <p className="font-inter text-md font-bold text-ink shrink-0">
        {formatKrw(account.amountKrw)}
      </p>
    </div>
  )
}

function MenuRow({
  title,
  subtitle,
  onPress,
}: {
  title: string
  subtitle?: string
  onPress: () => void
}) {
  return (
    <button
      onClick={onPress}
      className="flex w-full items-center gap-3 border-b border-divider py-4"
    >
      <div className="flex flex-1 min-w-0 flex-col gap-0.5">
        <p className="text-md font-semibold text-ink text-left">{title}</p>
        {subtitle && <p className="text-sub text-ink-sub text-left">{subtitle}</p>}
      </div>
      <span className="text-lg text-disabled shrink-0">›</span>
    </button>
  )
}

export default MypagePage
