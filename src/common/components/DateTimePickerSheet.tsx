import { useEffect, useRef, useState } from 'react'
import BottomSheet from './BottomSheet'

const DAY_KO = ['일', '월', '화', '수', '목', '금', '토']

const TIME_SLOTS: { time: string; available: boolean }[] = [
  { time: '09:30', available: false },
  { time: '10:30', available: true },
  { time: '11:30', available: true },
  { time: '13:00', available: false },
  { time: '14:00', available: true },
  { time: '15:30', available: true },
  { time: '16:30', available: true },
  { time: '17:30', available: false },
  { time: '18:00', available: true },
]

function isAvailable(year: number, month: number, day: number): boolean {
  const dow = new Date(year, month - 1, day).getDay()
  if (dow === 0 || dow === 6) return false
  if (year === 2026 && month === 6 && day < 8) return false
  return true
}

export function formatTime24(time24: string): string {
  const [h, m] = time24.split(':').map(Number)
  const isPM = h >= 12
  const hour = h % 12 || 12
  return `${isPM ? '오후' : '오전'} ${hour}:${String(m).padStart(2, '0')}`
}

function formatShortDate(date: Date): string {
  const dow = DAY_KO[date.getDay()]
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${dow})`
}

interface DateTimePickerSheetProps {
  open: boolean
  initialDate: Date
  initialTime24: string
  onConfirm: (date: Date, time24: string) => void
  onClose: () => void
}

function DateTimePickerSheet({
  open,
  initialDate,
  initialTime24,
  onConfirm,
  onClose,
}: DateTimePickerSheetProps) {
  const [step, setStep] = useState<'date' | 'time'>('date')
  const [viewDate, setViewDate] = useState(
    () => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
  )
  const [tempDate, setTempDate] = useState<Date>(initialDate)
  const [tempTime, setTempTime] = useState<string>(initialTime24)
  const contentRef = useRef<HTMLDivElement>(null)

  // 시트 열릴 때마다 초기화
  useEffect(() => {
    if (open) {
      setStep('date')
      setTempDate(initialDate)
      setTempTime(initialTime24)
      setViewDate(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1))
    }
  }, [open, initialDate, initialTime24])

  // step 전환 시 스크롤 맨 위로
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 })
  }, [step])

  const viewYear = viewDate.getFullYear()
  const viewMonth = viewDate.getMonth() + 1
  const firstDayOfMonth = new Date(viewYear, viewMonth - 1, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate()

  const cells: (number | null)[] = [
    ...Array<null>(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const isDateSelected = (day: number) =>
    tempDate.getFullYear() === viewYear &&
    tempDate.getMonth() + 1 === viewMonth &&
    tempDate.getDate() === day

  const prevMonth = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const nextMonth = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))

  const handleDateSelect = (day: number) => {
    setTempDate(new Date(viewYear, viewMonth - 1, day))
  }

  const handleConfirm = () => {
    onConfirm(tempDate, tempTime)
    onClose()
  }

  const buttonText = `${formatShortDate(tempDate)} ${formatTime24(tempTime)}로 변경`

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div ref={contentRef} className="overflow-y-auto px-5 pb-5 pt-1.5">
        {/* ── STEP 1: 달력 ── */}
        {step === 'date' && (
          <>
            {/* 헤더 */}
            <div className="flex items-center justify-between pb-[0.875rem] pt-5">
              <button
                aria-label="이전 달"
                className="flex size-[34px] items-center justify-center"
                onClick={prevMonth}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M12.5 15L7.5 10L12.5 5"
                    stroke="#191F28"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span className="text-md font-extrabold tracking-[-0.3px] text-ink">
                {viewYear}년 {viewMonth}월
              </span>
              <button
                aria-label="다음 달"
                className="flex size-[34px] items-center justify-center"
                onClick={nextMonth}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M7.5 5L12.5 10L7.5 15"
                    stroke="#191F28"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* 요일 헤더 */}
            <div className="grid grid-cols-7">
              {DAY_KO.map((label, i) => (
                <div key={label} className="flex h-[28px] items-center justify-center">
                  <span
                    className={`text-caption font-semibold ${
                      i === 0 ? 'text-[#e5484d]' : i === 6 ? 'text-[#2f6bff]' : 'text-[#9aa2ac]'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* 달력 그리드 */}
            <div className="grid grid-cols-7 gap-y-1 pt-1">
              {cells.map((day, idx) => {
                if (day === null) return <div key={`e-${idx}`} className="h-[46px]" />

                const dow = (firstDayOfMonth + day - 1) % 7
                const isWeekend = dow === 0 || dow === 6
                const avail = isAvailable(viewYear, viewMonth, day)
                const selected = isDateSelected(day)

                return (
                  <button
                    key={day}
                    disabled={!avail}
                    onClick={() => handleDateSelect(day)}
                    className="relative flex h-[46px] flex-col items-center justify-center"
                  >
                    {selected ? (
                      <div className="flex size-[38px] items-center justify-center rounded-full bg-primary">
                        <span className="text-body font-bold text-white">{day}</span>
                      </div>
                    ) : (
                      <>
                        <span
                          className={`text-body font-semibold ${
                            avail && !isWeekend ? 'text-ink' : 'text-disabled'
                          }`}
                        >
                          {day}
                        </span>
                        {avail && !isWeekend && (
                          <span className="absolute bottom-[5px] left-1/2 size-[5px] -translate-x-1/2 rounded-[2.5px] bg-primary" />
                        )}
                      </>
                    )}
                  </button>
                )
              })}
            </div>

            {/* 범례 */}
            <div className="flex items-center gap-1.5 pb-[0.875rem] pt-[0.875rem]">
              <span className="size-[6px] rounded-[3px] bg-primary" />
              <span className="text-[11px] text-ink-hint">
                상담 가능 · 주말·공휴일은 영업점 휴무예요
              </span>
            </div>

            {/* 날짜 선택 확인 버튼 → 시간 선택으로 이동 */}
            <button
              className="flex h-[54px] w-full items-center justify-center rounded-card bg-primary text-btn font-bold text-white"
              onClick={() => setStep('time')}
            >
              이 날짜로 선택
            </button>
          </>
        )}

        {/* ── STEP 2: 시간 선택 ── */}
        {step === 'time' && (
          <>
            {/* 뒤로 + 선택된 날짜 */}
            <div className="flex items-center gap-2 pb-4 pt-2">
              <button
                aria-label="날짜 선택으로 돌아가기"
                className="flex size-8 items-center justify-center"
                onClick={() => setStep('date')}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M12.5 15L7.5 10L12.5 5"
                    stroke="#191F28"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span className="text-md font-extrabold text-ink">
                {formatShortDate(tempDate)}
              </span>
            </div>

            {/* 예약 가능 시간 */}
            <p className="pb-2.5 text-caption font-semibold text-[#98a1ab]">예약 가능 시간</p>
            <div className="grid grid-cols-3 gap-[9px]">
              {TIME_SLOTS.map(({ time, available }) => {
                const selected = tempTime === time
                return (
                  <button
                    key={time}
                    disabled={!available}
                    onClick={() => available && setTempTime(time)}
                    className={`flex h-[46px] items-center justify-center rounded-[12px] text-body font-semibold transition-colors ${
                      !available
                        ? 'bg-[#f7f8fa] text-[#c2c9d1]'
                        : selected
                          ? 'border border-primary bg-[#edf2ff] text-primary'
                          : 'border border-[#e5e9ee] bg-white text-[#454f5e]'
                    }`}
                  >
                    {time}
                  </button>
                )
              })}
            </div>

            {/* 범례 */}
            <div className="flex items-center gap-1.5 pb-[1.125rem] pt-2">
              <span className="size-[6px] rounded-[3px] bg-[#c2c9d1]" />
              <span className="text-[11px] text-ink-hint">회색은 마감된 시간이에요</span>
            </div>

            {/* 최종 확인 버튼 */}
            <button
              className="flex h-[54px] w-full items-center justify-center rounded-card bg-primary text-btn font-bold text-white"
              onClick={handleConfirm}
            >
              {buttonText}
            </button>
          </>
        )}
      </div>
    </BottomSheet>
  )
}

export default DateTimePickerSheet
