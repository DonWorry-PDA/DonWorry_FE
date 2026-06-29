import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'
import DateTimePickerSheet, { formatTime24 } from '../common/components/DateTimePickerSheet'
import { buildScheduledAtIso } from '../mypage/utils/consultation'
import { type ConsultContext } from './constants/consultContext'
import type { Branch, ConsultMethod } from './types/paycheckPlan'

const METHODS: { key: ConsultMethod; label: string }[] = [
  { key: 'face', label: '대면' },
  { key: 'video', label: '화상' },
  { key: 'phone', label: '전화' },
]

const TOPICS = ['은퇴 자산 설계', '연금 수령 전략', '월급 만들기', '보험 점검']

const DOW = ['일', '월', '화', '수', '목', '금', '토']

function formatShortDate(date: Date): string {
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${DOW[date.getDay()]})`
}

function nextWeekday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 1)
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1)
  return d
}

type LocationState = {
  context?: ConsultContext
  planId?: string | number | null
  purposeAccountTypes?: string[]
  branch?: Branch
}

function PaycheckConsultPage() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state: LocationState | null }
  const branch = state?.branch

  const [method, setMethod] = useState<ConsultMethod>('face')
  const [pickedDate, setPickedDate] = useState<Date | null>(null)
  const [pickedTime, setPickedTime] = useState<string | null>(null)
  const [showPicker, setShowPicker] = useState(false)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])

  useEffect(() => {
    if (!branch) {
      navigate('/paycheck-plan/consult/branch', { replace: true, state: state ?? undefined })
    }
  }, [branch, navigate, state])

  if (!branch) return null

  const toggleTopic = (topic: string) =>
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    )

  const canSubmit = pickedDate !== null && pickedTime !== null

  const handleReserve = () => {
    if (!pickedDate || !pickedTime) return
    const scheduledAt = buildScheduledAtIso(pickedDate, pickedTime)
    navigate('/paycheck-plan/consult/complete', {
      replace: true,
      state: { branch, scheduledAt, method },
    })
  }

  const pickerInitialDate = pickedDate ?? nextWeekday()
  const pickerInitialTime = pickedTime ?? '10:30'

  const dateTimeLabel =
    pickedDate && pickedTime
      ? `${formatShortDate(pickedDate)} · ${formatTime24(pickedTime)}`
      : null

  return (
    <div className="flex flex-col h-dvh">
      <AppBar title="상담 예약" onBack={() => navigate(-1)} />

      <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-4 pb-6">
        {/* 선택된 지점 카드 */}
        <div className="bg-canvas rounded-[14px] px-4 py-[15px] flex items-start gap-3 mb-5">
          <div className="shrink-0 w-[34px] h-[34px] bg-primary rounded-[10px] flex items-center justify-center">
            <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
              <path
                d="M9 2C6.24 2 4 4.24 4 7c0 3.93 5 9 5 9s5-5.07 5-9c0-2.76-2.24-5-5-5z"
                stroke="white"
                strokeWidth="1.3"
              />
              <circle cx="9" cy="7" r="1.75" fill="white" />
            </svg>
          </div>
          <div className="flex-1 min-w-0 pt-px">
            <p className="text-[14.2px] font-bold text-ink truncate leading-[1.28]">{branch.name}</p>
            <p className="text-[11.7px] text-ink-sub mt-[5px]">
              {branch.distance} · {branch.address}
            </p>
          </div>
          <button
            onClick={() => navigate('/paycheck-plan/consult/branch', { state })}
            className="text-[12.3px] font-bold text-primary shrink-0 pt-px"
          >
            변경
          </button>
        </div>

        {/* 상담 방식 */}
        <p className="text-sub font-semibold text-ink-hint mb-3">상담 방식</p>
        <div className="bg-canvas rounded-[13px] p-1 flex mb-5">
          {METHODS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setMethod(key)}
              className={`flex-1 h-[46px] rounded-[10px] text-[14.2px] font-semibold transition-colors ${
                method === key
                  ? 'bg-white shadow-sm text-primary font-bold'
                  : 'text-[#79838e]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 날짜 · 시간 */}
        <p className="text-sub font-semibold text-ink-hint mb-1">날짜 · 시간</p>
        <button
          type="button"
          className="flex w-full items-center justify-between py-[1.125rem] border-b border-divider mb-5"
          onClick={() => setShowPicker(true)}
        >
          <span className={`text-body ${dateTimeLabel ? 'font-bold text-ink' : 'text-ink-hint'}`}>
            {dateTimeLabel ?? '날짜와 시간을 선택해주세요'}
          </span>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M6.75 4.5L11.25 9L6.75 13.5"
              stroke="#1A1D24"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* 상담 주제 (선택) */}
        <p className="text-sub font-semibold text-ink-hint mb-3">
          상담 주제{' '}
          <span className="font-medium text-[#b0b8c1]">(선택)</span>
        </p>
        <div className="flex flex-wrap gap-[6px] mb-5">
          {TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => toggleTopic(topic)}
              className={`h-[40px] rounded-[11px] px-4 text-[13.2px] font-semibold transition-colors ${
                selectedTopics.includes(topic)
                  ? 'bg-[#edf2ff] text-primary'
                  : 'bg-canvas text-[#6b7682]'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* 안내 문구 */}
        <div className="bg-[#f1f5fb] rounded-[14px] px-4 py-4 text-[12.1px] text-[#6e7884] leading-[1.65]">
          담당 PB는 예약 확정 후 지점에서 배정돼요. 상담 시작 10분 전 알림을 보내드려요.
        </div>

      </div>

      <StickyFooter>
        <Button onClick={handleReserve} disabled={!canSubmit}>
          예약하기
        </Button>
      </StickyFooter>

      <DateTimePickerSheet
        open={showPicker}
        initialDate={pickerInitialDate}
        initialTime24={pickerInitialTime}
        onConfirm={(date, time24) => {
          setPickedDate(date)
          setPickedTime(time24)
        }}
        onClose={() => setShowPicker(false)}
      />
    </div>
  )
}

export default PaycheckConsultPage
