import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Toggle from '../common/components/Toggle'
import BottomNav from '../common/components/BottomNav'

const AGREED_DATE = '2026.06.12'

const REQUIRED_TERMS = [
  { id: 'service', label: '연금SOL사 서비스 이용약관' },
  { id: 'privacy', label: '개인정보 수집·이용 동의' },
  { id: 'biometric', label: '고유식별정보 처리 동의' },
  { id: 'electronic', label: '전자금융거래 이용약관' },
] as const

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
      <path
        d="M8 5L13 10L8 15"
        stroke="#c4cad4"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TermsHistoryPage() {
  const navigate = useNavigate()
  const [thirdParty, setThirdParty] = useState(false)
  const [marketing, setMarketing] = useState(true)

  return (
    <div className="flex h-dvh flex-col bg-white">
      <AppBar title="약관 및 동의 내역" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto">
        {/* 페이지 설명 */}
        <p className="px-5 pb-2 pt-6 text-sub leading-relaxed text-ink-sub">
          동의한 약관과 처리 방침을 한곳에서 확인하고, 선택 항목은 직접 켜고 끌 수 있어요.
        </p>

        {/* 필수 동의 항목 */}
        <div className="px-5 pb-0.5 pt-4">
          <span className="text-caption font-semibold text-ink-hint">필수 동의 항목</span>
        </div>
        <div className="px-5">
          {REQUIRED_TERMS.map((term, idx) => (
            <div key={term.id}>
              <button
                type="button"
                onClick={() => navigate(`/terms/${term.id}`)}
                className="flex w-full items-center gap-3 py-[15px]"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  <p className="text-left text-md font-bold text-ink">{term.label}</p>
                  <p className="text-left text-caption text-ink-hint">동의 · {AGREED_DATE}</p>
                </div>
                <ChevronRightIcon />
              </button>
              {idx < REQUIRED_TERMS.length - 1 && <div className="h-px bg-divider" />}
            </div>
          ))}
        </div>

        {/* 선택 동의 항목 */}
        <div className="px-5 pb-0.5 pt-[18px]">
          <span className="text-caption font-semibold text-ink-hint">선택 동의 항목</span>
        </div>
        <div className="px-5">
          <div className="flex items-center gap-3 py-[15px]">
            <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
              <p className="text-md font-bold text-ink">개인정보 제3자 제공 동의</p>
              <p className="text-caption text-ink-hint">
                {thirdParty ? '동의' : '미동의'} · {AGREED_DATE}
              </p>
            </div>
            <Toggle checked={thirdParty} onChange={setThirdParty} size="md" />
          </div>
          <div className="h-px bg-divider" />
          <div className="flex items-center gap-3 py-[15px]">
            <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
              <p className="text-md font-bold text-ink">마케팅 정보 수신 동의</p>
              <p className="text-caption text-ink-hint">
                {marketing ? '동의' : '미동의'} · {AGREED_DATE}
              </p>
            </div>
            <Toggle checked={marketing} onChange={setMarketing} size="md" />
          </div>
        </div>

        {/* 안내 박스 */}
        <div className="px-5 pb-[26px] pt-[18px]">
          <div className="rounded-card bg-surface px-4 py-[14px]">
            <p className="text-sub leading-relaxed text-ink-sub">
              필수 항목은 서비스 이용에 반드시 필요해 철회할 수 없어요. 선택 항목 철회 시 일부
              기능이 제한될 수 있어요.
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

export default TermsHistoryPage
