import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NotificationIc, NotificationItemIc } from '../common/assets/icons'
import Toggle from '../common/components/Toggle'
import BottomNav from '../common/components/BottomNav'
import { MOCK_LINKED_ACCOUNTS, MOCK_USER_PROFILE } from './mock/mypage'
import { formatKrw } from '../common/utils/formatKrw'
import type { LinkedAccount } from './types/mypage'

function MypagePage() {
  const navigate = useNavigate()
  const [largeFontEnabled, setLargeFontEnabled] = useState(true)

  const profile = MOCK_USER_PROFILE

  return (
    <div className="flex flex-col bg-white h-dvh">
      {/* 헤더 */}
      <header className="flex h-[52px] items-center pl-5 pr-[14px]">
        <h1 className="flex-1 text-card font-bold text-ink">마이페이지</h1>
        <button
          className="flex size-7 items-center justify-center"
          onClick={() => navigate('/notification')}
        >
          <NotificationIc className="text-ink" width={22} height={22} />
        </button>
      </header>

      {/* 스크롤 영역 */}
      <main className="flex-1 overflow-y-auto px-5">
        {/* 프로필 */}
        <div className="flex items-center gap-[14px] border-b border-line py-[19px] pt-2">
          <div className="bg-primary-tint flex size-[54px] shrink-0 items-center justify-center rounded-full">
            <NotificationItemIc className="text-primary" width={24} height={29} />
          </div>
          <div className="flex flex-1 min-w-0 flex-col gap-[3px]">
            <p className="text-card font-bold text-ink">{profile.name}님</p>
            <p className="text-sub text-ink-hint">
              {profile.age}세 · {profile.status} · 목표 생활비 월{' '}
              {(profile.monthlyTargetKrw / 10_000).toLocaleString('ko-KR')}만원
            </p>
          </div>
          <button className="shrink-0">
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
        <button className="flex w-full items-center gap-3 py-[13px]">
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
          <Toggle checked={largeFontEnabled} onChange={setLargeFontEnabled} size="sm" />
        </div>

        {/* 설정 메뉴 */}
        <MenuRow
          title="알림 설정"
          subtitle="입금일 · 잔액 부족 경고 켜짐"
          onPress={() => navigate('/notification/settings')}
        />
        <MenuRow
          title="상담 내역"
          subtitle="6월 19일 PB 상담 예약됨"
          onPress={() => {}}
        />
        <MenuRow title="약관 및 동의 내역" onPress={() => {}} />

        {/* 로그아웃 */}
        <button className="flex w-full items-center py-[15px]">
          <p className="text-md font-medium text-ink-sub">로그아웃</p>
        </button>
      </main>

      <BottomNav />
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
