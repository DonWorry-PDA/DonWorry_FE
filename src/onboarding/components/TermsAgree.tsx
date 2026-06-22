import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackArrowIc } from '../../common/assets/icons'
import StickyFooter from '../../common/components/StickyFooter'

interface Props {
  onNext: () => void
  onPrev: () => void
}

const TERMS = [
  { id: 'service', label: '연금SOL사 서비스 이용약관', required: true },
  { id: 'privacy', label: '개인정보 수집·이용 동의', required: true },
  { id: 'biometric', label: '고유식별정보 처리 동의', required: true },
  { id: 'electronic', label: '전자금융거래 이용약관', required: true },
  { id: 'thirdParty', label: '개인정보 제3자 제공 동의', required: false },
  { id: 'marketing', label: '마케팅 정보 수신 동의', required: false },
] as const

type TermId = (typeof TERMS)[number]['id']
type CheckedState = Record<TermId, boolean>

const STORAGE_KEY = 'onboarding-terms-agreed'

const defaultChecked: CheckedState = {
  service: false,
  privacy: false,
  biometric: false,
  electronic: false,
  thirdParty: false,
  marketing: false,
}

function isCheckedState(value: unknown): value is CheckedState {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>
  return TERMS.every(t => typeof obj[t.id] === 'boolean')
}

function loadChecked(): CheckedState {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed: unknown = JSON.parse(stored)
      if (isCheckedState(parsed)) return parsed
    }
  } catch {}
  return defaultChecked
}

function CheckboxIcon({ checked }: { checked: boolean }) {
  return checked ? (
    <div className="flex size-6 shrink-0 items-center justify-center rounded-[12px] bg-primary">
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M2.5 7.5L6 11L12.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  ) : (
    <div className="flex size-6 shrink-0 items-center justify-center rounded-[12px] border border-[#d2d8df]">
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M2.5 7.5L6 11L12.5 4" stroke="#d2d8df" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function AllAgreeCheckbox({ checked }: { checked: boolean }) {
  return checked ? (
    <div className="flex size-[26px] shrink-0 items-center justify-center rounded-[8px] border border-primary bg-primary">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 8L6.5 11.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  ) : (
    <div className="flex size-[26px] shrink-0 items-center justify-center rounded-[8px] border border-[#bfcbe6] bg-white">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 8L6.5 11.5L13 5" stroke="#bfcbe6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function TermsAgree({ onNext, onPrev }: Props) {
  const navigate = useNavigate()
  const [checked, setChecked] = useState<CheckedState>(loadChecked)

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(checked))
  }, [checked])

  const allChecked = TERMS.every(t => checked[t.id])
  const allRequiredChecked = TERMS.filter(t => t.required).every(t => checked[t.id])

  function toggleAll() {
    const next = !allChecked
    setChecked(Object.fromEntries(TERMS.map(t => [t.id, next])) as CheckedState)
  }

  function toggleOne(id: TermId) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function handleProceed() {
    sessionStorage.removeItem(STORAGE_KEY)
    onNext()
  }

  return (
    <div className="relative flex h-dvh flex-col bg-white">
      {/* 네비게이션 바 */}
      <div className="relative flex h-[52px] shrink-0 items-center px-3">
        <button type="button" onClick={onPrev} aria-label="뒤로 가기" className="flex size-8 items-center justify-center">
          <BackArrowIc width={22} height={22} />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 text-md font-bold text-ink">약관 동의</span>
      </div>

      {/* 스크롤 영역 */}
      <div className="flex flex-1 flex-col gap-2 overflow-auto px-5 pb-4">
        {/* 타이틀 */}
        <div className="pb-3 pt-7">
          <h1 className="text-heading font-extrabold leading-tight tracking-[-0.4px] text-ink">
            서비스 시작 전,<br />약관에 동의해주세요
          </h1>
          <p className="mt-2 text-sub text-ink-hint">
            은퇴 자산을 진단·설계하기 위해 아래 약관 동의가 필요해요.
          </p>
        </div>

        {/* 전체 동의 카드 */}
        <button
          type="button"
          onClick={toggleAll}
          className="flex w-full items-center gap-3 rounded-card border border-[#e0e9ff] bg-primary-tint p-[17px] text-left"
        >
          <AllAgreeCheckbox checked={allChecked} />
          <span className="text-md font-extrabold text-ink">약관에 전체 동의합니다</span>
        </button>

        {/* 개별 약관 목록 */}
        <div className="flex flex-col">
          {TERMS.map((term, idx) => (
            <div key={term.id}>
              <div className="flex items-center gap-3 py-[13px]">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={checked[term.id]}
                  aria-label={term.label}
                  onClick={() => toggleOne(term.id)}
                >
                  <CheckboxIcon checked={checked[term.id]} />
                </button>
                <span className="min-w-0 flex-1 text-body font-semibold text-ink-sub">
                  {term.label}
                </span>
                <span
                  className={`shrink-0 pr-2 text-sub font-semibold ${
                    term.required ? 'text-primary' : 'text-ink-hint'
                  }`}
                >
                  ({term.required ? '필수' : '선택'})
                </span>
                <button
                  type="button"
                  onClick={() => navigate(`/terms/${term.id}`)}
                  className="flex shrink-0 items-center"
                >
                  <span className="text-sub font-semibold text-disabled">보기</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M8 5L13 10L8 15"
                      stroke="#c4cad4"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              {idx < TERMS.length - 1 && <div className="h-px bg-divider" />}
            </div>
          ))}
        </div>

        {/* 안내 박스 */}
        <div className="rounded-card bg-surface px-4 py-[14px]">
          <p className="text-sub leading-relaxed text-ink-sub">
            필수 항목에 동의해야 서비스를 시작할 수 있어요. 선택 항목은 동의하지 않아도 이용에 영향이 없어요.
          </p>
        </div>
      </div>

      {/* 하단 버튼 */}
      <StickyFooter>
        <button
          type="button"
          onClick={handleProceed}
          disabled={!allRequiredChecked}
          className="h-[54px] w-full rounded-card bg-primary text-btn font-bold text-white disabled:bg-disabled disabled:text-white"
        >
          동의하고 시작하기
        </button>
      </StickyFooter>
    </div>
  )
}

export default TermsAgree
