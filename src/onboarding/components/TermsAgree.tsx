import { useState } from 'react'
import { BackArrowIc } from '../../common/assets/icons'

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

const initialChecked: CheckedState = {
  service: false,
  privacy: false,
  biometric: false,
  electronic: false,
  thirdParty: false,
  marketing: false,
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
  const [checked, setChecked] = useState<CheckedState>(initialChecked)
  const [modalTerm, setModalTerm] = useState<TermId | null>(null)

  const allChecked = TERMS.every(t => checked[t.id])
  const allRequiredChecked = TERMS.filter(t => t.required).every(t => checked[t.id])

  function toggleAll() {
    const next = !allChecked
    setChecked(Object.fromEntries(TERMS.map(t => [t.id, next])) as CheckedState)
  }

  function toggleOne(id: TermId) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function agreeAndClose(id: TermId) {
    setChecked(prev => ({ ...prev, [id]: true }))
    setModalTerm(null)
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      {/* 네비게이션 바 */}
      <div className="relative flex h-[52px] shrink-0 items-center px-3">
        <button type="button" onClick={onPrev} className="flex size-8 items-center justify-center">
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
                <button type="button" onClick={() => toggleOne(term.id)}>
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
                  onClick={() => setModalTerm(term.id)}
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
      <div className="shrink-0 border-t border-divider px-5 pb-[18px] pt-[15px]">
        <button
          type="button"
          onClick={onNext}
          disabled={!allRequiredChecked}
          className="h-[54px] w-full rounded-card bg-primary text-btn font-bold text-white disabled:bg-disabled disabled:text-white"
        >
          동의하고 시작하기
        </button>
      </div>

      {/* 약관 내용 모달 */}
      {modalTerm !== null && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/45">
          <div className="flex h-[80vh] flex-col overflow-hidden rounded-t-[22px] bg-white">
            <div className="flex h-[54px] shrink-0 items-center justify-between border-b border-divider px-[18px]">
              <span className="text-md font-bold text-ink">약관</span>
              <button
                type="button"
                onClick={() => setModalTerm(null)}
                className="flex size-[30px] items-center justify-center"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M5 5L15 15M15 5L5 15"
                    stroke="#1a1d24"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-5">
              <p className="text-body leading-relaxed text-ink-sub">
                {TERMS.find(t => t.id === modalTerm)?.label} 약관 내용이 여기에 표시됩니다.
              </p>
            </div>
            <div className="shrink-0 border-t border-divider px-5 pb-[14px] pt-[15px]">
              <button
                type="button"
                onClick={() => agreeAndClose(modalTerm)}
                className="h-[54px] w-full rounded-card bg-primary text-btn font-bold text-white"
              >
                이 약관에 동의
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TermsAgree
