import { useState } from 'react'
import { BackArrowIc } from '../../../common/assets/icons'

const CONSENT_ITEMS = [
  { id: 'collect', label: '[필수] 개인(신용)정보 수집 이용 동의' },
  { id: 'provide', label: '[필수] 개인(신용)정보 제공 동의' },
  { id: 'transfer', label: '[필수] 전송요구 및 통합조회 동의 (한국신용정보원)' },
]

interface Props {
  onNext: () => void
  onPrev: () => void
}

function AssetConsent({ onNext, onPrev }: Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(CONSENT_ITEMS.map(item => [item.id, false]))
  )

  const allChecked = CONSENT_ITEMS.every(item => checked[item.id])

  function toggleAll() {
    const next = !allChecked
    setChecked(Object.fromEntries(CONSENT_ITEMS.map(item => [item.id, next])))
  }

  function toggleItem(id: string) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex items-center gap-3 px-6 pt-12 pb-4">
        <button type="button" onClick={onPrev} aria-label="이전 단계로 이동" className="text-ink">
          <BackArrowIc width={24} height={24} />
        </button>
        <span className="text-body text-ink-sub">자산 연결 약관 동의 3/3</span>
      </div>

      <div className="flex flex-1 flex-col px-6 pt-8">
        <h1 className="text-heading font-bold text-ink">
          자산을 안전하게 불러오기<br />위해 약관에 동의해주세요
        </h1>

        <div className="mt-6 rounded-card bg-surface p-4 text-sub text-ink-sub">
          <p className="font-bold">마이데이터 통합조회 서비스</p>
          <p className="mt-1">금융플랫폼 연금카드 등 다양한 자산을 모아 보여드려요. 6개월마다 자동 갱신되며 중단 시 안내해드려요.</p>
        </div>

        <button
          type="button"
          onClick={toggleAll}
          className="mt-6 flex items-center gap-3 text-left"
        >
          <div className={`flex size-5 items-center justify-center rounded-full border-2 ${allChecked ? 'border-primary bg-primary' : 'border-line'}`}>
            {allChecked && (
              <svg width="12" height="9" viewBox="0 0 12 9" fill="none" aria-hidden="true">
                <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <span className="text-body font-bold text-ink">[필수] 약관에 전체 동의</span>
        </button>

        <div className="mt-4 h-px bg-line" />

        <div className="mt-4 flex flex-col gap-4">
          {CONSENT_ITEMS.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleItem(item.id)}
              className="flex items-center gap-3 text-left"
            >
              <div className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${checked[item.id] ? 'border-primary bg-primary' : 'border-line'}`}>
                {checked[item.id] && (
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none" aria-hidden="true">
                    <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <span className="text-body text-ink">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-10">
        <button
          type="button"
          onClick={onNext}
          disabled={!allChecked}
          className="w-full rounded-btn bg-primary py-4 text-btn font-bold text-white disabled:bg-disabled"
        >
          동의하고 연결하기
        </button>
      </div>
    </div>
  )
}

export default AssetConsent
