import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'

type TermsItem = {
  id: string
  termId: string
  title: string
  subtitle: string | null
  required: boolean
}

const TERMS_ITEMS: TermsItem[] = [
  {
    id: 'account',
    termId: 'account',
    title: '신한 은퇴솔루션 계좌 약관',
    subtitle: null,
    required: true,
  },
  {
    id: 'deposit',
    termId: 'deposit',
    title: '예금거래 기본약관',
    subtitle: null,
    required: true,
  },
  {
    id: 'privacy-collect',
    termId: 'account-privacy',
    title: '개인정보 수집·이용 동의',
    subtitle: '계좌 개설·거래 목적',
    required: true,
  },
  {
    id: 'privacy-share',
    termId: 'account-third-party',
    title: '개인정보 제3자 제공 동의',
    subtitle: '예금보험공사 등 계좌 운영 필수',
    required: true,
  },
]

type AgreedState = Record<string, boolean>

const INITIAL_STATE: AgreedState = Object.fromEntries(TERMS_ITEMS.map((item) => [item.id, false]))

function CheckIcon() {
  return (
    <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
      <path
        d="M1 4.5L4.5 8L11 1"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M5.25 3.5L8.75 7L5.25 10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TermsAgreePage() {
  const navigate = useNavigate()
  const [agreed, setAgreed] = useState<AgreedState>(INITIAL_STATE)

  const allChecked = TERMS_ITEMS.every((item) => agreed[item.id])
  const requiredChecked = TERMS_ITEMS.filter((item) => item.required).every((item) => agreed[item.id])

  const toggleAll = () => {
    const next = !allChecked
    setAgreed(Object.fromEntries(TERMS_ITEMS.map((item) => [item.id, next])))
  }

  const toggle = (id: string) => {
    setAgreed((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex flex-col bg-white h-dvh">
      <AppBar title="약관 동의" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto px-6 pb-6">
        <h2 className="mt-[1.375rem] text-heading font-extrabold text-ink leading-[1.43] tracking-[-0.025em] mb-3">
          계좌 개설을 위해
          <br />
          약관에 동의해주세요
        </h2>

        <p className="text-sub text-ink-hint leading-[1.66] mb-[1.375rem]">
          본인확인·서비스 약관은 가입할 때 완료했어요. 계좌 개설에 필요한 약관만 확인하면 돼요.
        </p>

        {/* 전체 동의 */}
        <button
          role="checkbox"
          aria-checked={allChecked}
          onClick={toggleAll}
          className="flex w-full items-center gap-3 rounded-card-lg border border-[#e0e9ff] bg-[#edf2ff] p-[1.0625rem] text-left mb-3"
        >
          <span
            className={`flex size-[1.625rem] shrink-0 items-center justify-center rounded-[8px] border transition-colors ${
              allChecked ? 'bg-primary border-primary' : 'bg-white border-[#bfcbe6]'
            }`}
          >
            {allChecked && <CheckIcon />}
          </span>
          <span className="text-md font-extrabold text-ink tracking-[-0.019em]">
            약관에 전체 동의합니다
          </span>
        </button>

        {/* 개별 항목 */}
        <div>
          {TERMS_ITEMS.map((item, index) => {
            const isChecked = agreed[item.id]
            const isLast = index === TERMS_ITEMS.length - 1
            return (
              <div key={item.id}>
                <div className="flex items-start gap-3 py-[0.9375rem]">
                  {/* 체크박스 */}
                  <button
                    role="checkbox"
                    aria-checked={isChecked}
                    aria-label={item.title}
                    onClick={() => toggle(item.id)}
                    className="shrink-0 mt-[1px]"
                  >
                    <span
                      className={`flex size-6 items-center justify-center rounded-full border transition-colors ${
                        isChecked ? 'bg-primary border-primary' : 'border-radio'
                      }`}
                    >
                      {isChecked && <CheckIcon />}
                    </span>
                  </button>

                  {/* 제목 + 부제목 */}
                  <button
                    onClick={() => toggle(item.id)}
                    className="flex-1 min-w-0 text-left"
                  >
                    <span className="text-body font-bold text-ink block tracking-[-0.019em]">
                      {item.title}
                    </span>
                    {item.subtitle && (
                      <span className="text-sub text-ink-hint block mt-0.5">
                        {item.subtitle}
                      </span>
                    )}
                  </button>

                  {/* (필수) + 보기 > */}
                  <div className="shrink-0 flex items-center gap-1.5 mt-[1px]">
                    {item.required && (
                      <span className="text-caption font-bold text-primary">(필수)</span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/terms/${item.termId}`)
                      }}
                      className="flex items-center gap-0.5 text-ink-hint"
                    >
                      <span className="text-caption font-semibold">보기</span>
                      <ChevronRight />
                    </button>
                  </div>
                </div>
                {!isLast && <div className="h-px bg-divider" />}
              </div>
            )
          })}
        </div>

        {/* 안내 박스 */}
        <div className="mt-4 rounded-card-lg bg-[#f1f5fb] px-4 py-[1.125rem]">
          <p className="text-sub text-ink-sub leading-[1.66]">
            마케팅 정보 수신과 본인확인(고유식별정보)은 가입할 때 이미 받았어요. 계좌 개설에 필요한 항목만 다시 확인합니다.
          </p>
        </div>
      </main>

      <StickyFooter>
        <Button
          disabled={!requiredChecked}
          onClick={() =>
            navigate('/account-open/complete', {
              state: {
                accountNumber: '123-456-789012',
                openedAt: new Date()
                  .toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
                  .replace(/\.\s?/g, '.')
                  .replace(/\.$/, ''),
              },
            })
          }
        >
          동의하고 계속
        </Button>
      </StickyFooter>
    </div>
  )
}

export default TermsAgreePage
