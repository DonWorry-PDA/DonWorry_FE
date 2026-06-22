import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Toggle from '../common/components/Toggle'
import BottomNav from '../common/components/BottomNav'
import InfoBox from '../common/components/InfoBox'
import { useTermsAgreement } from './hooks/useTermsAgreement'

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
  const { terms, mutationError, dismissMutationError, toggleConsent } = useTermsAgreement()

  const requiredTerms = terms.filter(t => t.required)
  const optionalTerms = terms.filter(t => !t.required)

  return (
    <div className="flex h-dvh flex-col bg-white">
      <AppBar title="약관 및 동의 내역" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto">
        {/* 페이지 설명 */}
        <p className="px-5 pb-2 pt-6 text-sub leading-relaxed text-ink-sub">
          동의한 약관과 처리 방침을 한곳에서 확인하고, 선택 항목은 직접 켜고 끌 수 있어요.
        </p>

        {mutationError && (
          <div className="flex items-center gap-2 px-5 pb-2">
            <InfoBox tone="danger" className="flex-1">
              {mutationError}
            </InfoBox>
            <button
              type="button"
              onClick={dismissMutationError}
              className="shrink-0 text-danger-text text-body leading-none"
              aria-label="오류 닫기"
            >
              ✕
            </button>
          </div>
        )}

        {/* 필수 동의 항목 */}
        <div className="px-5 pb-0.5 pt-4">
          <span className="text-caption font-semibold text-ink-hint">필수 동의 항목</span>
        </div>
        <div className="px-5">
          {requiredTerms.map((term, idx) => (
            <div key={term.id}>
              <button
                type="button"
                onClick={() => navigate(`/terms/${term.id}`)}
                className="flex w-full items-center gap-3 py-[15px]"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  <p className="text-left text-md font-bold text-ink">{term.label}</p>
                  <p className="text-left text-caption text-ink-hint">
                    동의 · {term.agreedAt}
                  </p>
                </div>
                <ChevronRightIcon />
              </button>
              {idx < requiredTerms.length - 1 && <div className="h-px bg-divider" />}
            </div>
          ))}
        </div>

        {/* 선택 동의 항목 */}
        <div className="px-5 pb-0.5 pt-[18px]">
          <span className="text-caption font-semibold text-ink-hint">선택 동의 항목</span>
        </div>
        <div className="px-5">
          {optionalTerms.map((term, idx) => (
            <div key={term.id}>
              <div className="flex items-center gap-3 py-[15px]">
                <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  <p className="text-md font-bold text-ink">{term.label}</p>
                  <p className="text-caption text-ink-hint">
                    {term.agreed ? '동의' : '미동의'} · {term.agreedAt}
                  </p>
                </div>
                <Toggle
                  checked={term.agreed}
                  onChange={agreed => toggleConsent(term.id, agreed)}
                  size="md"
                  aria-label={`${term.label} ${term.agreed ? '동의됨' : '미동의'}`}
                />
              </div>
              {idx < optionalTerms.length - 1 && <div className="h-px bg-divider" />}
            </div>
          ))}
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
