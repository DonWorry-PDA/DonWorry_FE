import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'

type CheckItem = {
  id: string
  label: string
  subLabel: string
  optional?: boolean
}

const PREP_ITEMS: CheckItem[] = [
  { id: 'id-card', label: '신분증', subLabel: '본인 확인용' },
  { id: 'account', label: '연결된 계좌 정보', subLabel: '앱에 연결한 자산이면 충분해요' },
  { id: 'pension', label: '국민연금 가입내역서', subLabel: '정부24·국민연금공단에서 발급' },
  { id: 'insurance', label: '보유 보험 증권', subLabel: '의료비 대비 점검 시 참고', optional: true },
]

const RESERVATION_ROWS = [
  { label: '지점', value: '신한투자증권 PWM센터' },
  { label: '상담원', value: '김신한 PB팀장' },
  { label: '날짜', value: '2026년 6월 19일 (금)' },
  { label: '시간', value: '오후 2:00' },
  { label: '상담 방식', value: '영업점 대면 상담' },
]

const TOPICS = [
  '은퇴 자산 배분 점검 — 예금에 쏠린 비중 진단',
  '월 220만원 목표 현금흐름 설계',
  '국민연금 수령 시점(연기 1년) 비교',
]

function CheckIcon({ checked }: { checked: boolean }) {
  return (
    <button
      type="button"
      className={`shrink-0 size-6 rounded-[0.5rem] flex items-center justify-center transition-colors ${
        checked ? 'bg-primary border border-primary' : 'bg-white border border-radio'
      }`}
    >
      <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
        <path
          d="M1.5 5L5 8.5L11.5 1.5"
          stroke={checked ? 'white' : '#cfd5de'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

function ConsultPrepPage() {
  const navigate = useNavigate()
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set(['id-card', 'account']))

  const toggle = (id: string) =>
    setCheckedItems((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <div className="flex h-dvh flex-col bg-white">
      <AppBar title="상담 준비사항" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto">
        {/* 헤더 */}
        <div className="px-5 pt-6 pb-1">
          <h2 className="text-heading font-extrabold text-ink leading-[1.47]">
            상담 전,
            <br />
            이것만 준비하면 돼요
          </h2>
          <p className="text-sub text-ink-hint mt-2 leading-[1.67]">
            은퇴 자산 설계 상담이 예약돼 있어요. 시작 10분 전에 알림을
            <br />
            보내드릴게요.
          </p>
        </div>

        {/* 예약 정보 카드 */}
        <div className="px-5 pt-5">
          <div className="border border-line rounded-card-xl px-[1.0625rem] py-[0.3125rem]">
            {RESERVATION_ROWS.map(({ label, value }, i) => (
              <div key={label}>
                {i > 0 && <div className="h-px bg-divider" />}
                <div className="flex items-center justify-between py-[0.875rem]">
                  <span className="text-body text-ink-hint">{label}</span>
                  <span className="text-body font-bold text-ink">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 준비물 체크리스트 */}
        <div className="px-5 pt-[1.375rem]">
          <p className="text-caption font-semibold text-ink-hint mb-[0.9375rem]">준비물 체크리스트</p>
          {PREP_ITEMS.map((item, i) => (
            <div key={item.id}>
              {i > 0 && <div className="h-px bg-divider" />}
              <button
                type="button"
                className="flex w-full items-center gap-3 py-[0.8125rem] text-left"
                onClick={() => toggle(item.id)}
                aria-label={item.label}
              >
                <CheckIcon checked={checkedItems.has(item.id)} />
                <span className="flex flex-col gap-0.5">
                  <span className="text-body font-semibold text-ink">
                    {item.label}
                    {item.optional && (
                      <span className="font-medium text-ink-hint"> (선택)</span>
                    )}
                  </span>
                  <span className="text-caption text-ink-hint">{item.subLabel}</span>
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* 이번 상담 주제 */}
        <div className="px-5 pt-[1.375rem]">
          <p className="text-caption font-semibold text-ink-hint mb-2">이번 상담에서 다룰 내용</p>
          <div className="bg-surface rounded-card-xl px-[1.1875rem] py-[1.0625rem] flex flex-col gap-[0.6875rem]">
            {TOPICS.map((topic) => (
              <div key={topic} className="flex gap-[0.625rem] items-start">
                <span className="text-primary text-body font-extrabold leading-[21px] shrink-0">·</span>
                <span className="text-body text-ink-sub leading-[21px]">{topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 액션 */}
        <div className="px-5 pt-6 pb-7 flex flex-col gap-[0.875rem]">
          <button className="border border-line rounded-card w-full h-[3.375rem] text-btn font-bold text-ink">
            예약 변경·취소
          </button>
          <p className="text-sub text-ink-hint text-center">상담 시작 10분 전 알림을 보내드려요</p>
        </div>
      </main>
    </div>
  )
}

export default ConsultPrepPage
