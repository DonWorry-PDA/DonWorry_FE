import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackArrowIc } from '../../../common/assets/icons'
import StickyFooter from '../../../common/components/StickyFooter'

const CONSENT_ITEMS = [
  { id: 'collect', label: '개인(신용)정보 수집·이용 동의서' },
  { id: 'provide', label: '개인(신용)정보 제공 동의서' },
  { id: 'provideKcis', label: '개인(신용)정보 제공 동의서(한국신용정보원)' },
] as const

type ConsentId = (typeof CONSENT_ITEMS)[number]['id']

interface Props {
  onNext: () => void
  onPrev: () => void
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

function AssetConsent({ onNext, onPrev }: Props) {
  const navigate = useNavigate()
  const [checked, setChecked] = useState<Record<ConsentId, boolean>>({
    collect: false,
    provide: false,
    provideKcis: false,
  })

  const allChecked = CONSENT_ITEMS.every(item => checked[item.id])

  function toggleAll() {
    const next = !allChecked
    setChecked({ collect: next, provide: next, provideKcis: next })
  }

  function toggleItem(id: ConsentId) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="relative flex h-dvh flex-col bg-white">
      {/* 헤더 */}
      <div className="relative flex h-[52px] shrink-0 items-center px-3">
        <button type="button" onClick={onPrev} aria-label="뒤로 가기" className="flex size-8 items-center justify-center">
          <BackArrowIc width={22} height={22} />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 text-md font-bold text-ink">자산연결</span>
      </div>

      {/* 진행 표시 */}
      <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-2.5">
        <span className="text-sub font-semibold text-ink-sub">약관동의</span>
        <span className="rounded-full bg-surface px-2.5 py-0.5 text-sub font-semibold text-ink-sub">3/3</span>
      </div>

      {/* 스크롤 영역 */}
      <div className="flex flex-1 flex-col gap-2 overflow-auto px-5 pb-4">
        <div className="pb-3 pt-7">
          <h1 className="text-heading font-extrabold leading-tight tracking-[-0.4px] text-ink">
            선택하신 금융기관의<br />자산정보를 확인할게요
          </h1>
          <p className="mt-2 text-sub text-ink-hint">
            자산을 연결하기 위해 아래 약관 동의가 필요해요.
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

        {/* 개별 동의서 목록 */}
        <div className="flex flex-col">
          {CONSENT_ITEMS.map((item, idx) => (
            <div key={item.id}>
              <div className="flex items-center gap-3 py-[13px]">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={checked[item.id]}
                  aria-label={item.label}
                  onClick={() => toggleItem(item.id)}
                >
                  <CheckboxIcon checked={checked[item.id]} />
                </button>
                <span className="min-w-0 flex-1 text-body font-semibold text-ink-sub">
                  [필수] {item.label}
                </span>
                <button
                  type="button"
                  onClick={() => navigate(`/onboarding/asset-consent/${item.id}`)}
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
              {idx < CONSENT_ITEMS.length - 1 && <div className="h-px bg-divider" />}
            </div>
          ))}
        </div>

        {/* 안내 박스 */}
        <div className="rounded-card bg-surface px-4 py-[14px]">
          <p className="text-sub leading-relaxed text-ink-sub">
            필수 항목에 동의해야 자산 연결을 진행할 수 있어요.
          </p>
        </div>
      </div>

      {/* 하단 버튼 */}
      <StickyFooter>
        <button
          type="button"
          onClick={onNext}
          disabled={!allChecked}
          className="h-[54px] w-full rounded-card bg-primary text-btn font-bold text-white disabled:bg-disabled disabled:text-white"
        >
          [필수] 전체동의
        </button>
      </StickyFooter>
    </div>
  )
}

export default AssetConsent
