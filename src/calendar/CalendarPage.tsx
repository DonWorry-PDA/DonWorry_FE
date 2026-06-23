import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import BottomNav from '../common/components/BottomNav'
import MonthGrid from './components/MonthGrid'
import EventLegend from './components/EventLegend'
import DaySchedule from './components/DaySchedule'
import TransactionList from './components/TransactionList'
import useGetCalendar from './hooks/useGetCalendar'
import { BackArrowIc } from '../common/assets/icons'
import { formatDayTitle, formatMonthTitle, parseIso, toIso } from './utils/monthGrid'

function CalendarPage() {
  const navigate = useNavigate()
  const today = new Date()
  const todayIso = toIso(today)

  const [view, setView] = useState({
    year: today.getFullYear(),
    month0: today.getMonth(),
  })
  const [selectedIso, setSelectedIso] = useState(todayIso)

  // API는 1-based month → 0-based month0에 +1
  const { data, isLoading, isError } = useGetCalendar(view.year, view.month0 + 1)

  const events = data?.events ?? {}
  const schedules = data?.schedules[selectedIso] ?? []
  const transactions = data?.transactions[selectedIso] ?? []

  const handleSelect = (iso: string) => {
    setSelectedIso(iso)
    // 이전/다음 달 날짜를 누르면 해당 달로 이동
    const d = parseIso(iso)
    if (d.getFullYear() !== view.year || d.getMonth() !== view.month0) {
      setView({ year: d.getFullYear(), month0: d.getMonth() })
    }
  }

  const goToday = () => {
    setView({ year: today.getFullYear(), month0: today.getMonth() })
    setSelectedIso(todayIso)
  }

  // 연도 경계(1월↔12월)는 Date 연산으로 자동 처리
  const shiftMonth = (delta: number) => {
    setView((v) => {
      const d = new Date(v.year, v.month0 + delta, 1)
      return { year: d.getFullYear(), month0: d.getMonth() }
    })
  }

  return (
    <div className="flex h-dvh flex-col bg-white">
      <AppBar title="캘린더" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto px-[18px] pb-6">
        {/* 월 헤더 */}
        <div className="relative flex items-center justify-center pt-1 pb-[14px]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => shiftMonth(-1)}
              aria-label="이전 달"
              className="flex size-7 items-center justify-center rounded-full bg-surface-muted text-ink-sub"
            >
              <BackArrowIc width={14} height={14} />
            </button>
            <h1 className="text-card font-bold text-ink">
              {formatMonthTitle(view.year, view.month0)}
            </h1>
            <button
              onClick={() => shiftMonth(1)}
              aria-label="다음 달"
              className="flex size-7 items-center justify-center rounded-full bg-surface-muted text-ink-sub"
            >
              <BackArrowIc width={14} height={14} className="rotate-180" />
            </button>
          </div>

          {/* 오늘 버튼: 캘린더 토(7번째) 열 위에 정렬 */}
          <div className="pointer-events-none absolute inset-x-0 grid grid-cols-7">
            <button
              onClick={goToday}
              className="pointer-events-auto col-start-7 justify-self-center text-body font-semibold text-primary"
            >
              오늘
            </button>
          </div>
        </div>

        <MonthGrid
          year={view.year}
          month0={view.month0}
          todayIso={todayIso}
          selectedIso={selectedIso}
          events={events}
          onSelect={handleSelect}
        />

        <EventLegend />

        {isError ? (
          <p className="py-10 text-center text-sub text-ink-hint">
            캘린더를 불러오지 못했어요
          </p>
        ) : isLoading ? (
          <p className="py-10 text-center text-sub text-ink-hint">불러오는 중…</p>
        ) : (
          <>
            <DaySchedule
              title={`${formatDayTitle(selectedIso)} 일정`}
              items={schedules}
            />
            <TransactionList items={transactions} />
          </>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

export default CalendarPage
