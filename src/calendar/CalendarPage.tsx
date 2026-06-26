import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../common/components/BottomNav'
import BottomSheet from '../common/components/BottomSheet'
import MonthGrid from './components/MonthGrid'
import DaySchedule from './components/DaySchedule'
import TransactionList from './components/TransactionList'
import useGetCalendar from './hooks/useGetCalendar'
import { BackArrowIc, NotificationIc } from '../common/assets/icons'
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
  const [sheetOpen, setSheetOpen] = useState(false)

  // API는 1-based month → 0-based month0에 +1
  const { data, isLoading, isError } = useGetCalendar(view.year, view.month0 + 1)

  const events = data?.events ?? {}
  const schedules = data?.schedules[selectedIso] ?? []
  const transactions = data?.transactions[selectedIso] ?? []

  // 날짜 탭 → 선택 + 바텀시트 open. 다른 달 날짜를 누르면 해당 달로 이동.
  const handleSelect = (iso: string) => {
    setSelectedIso(iso)
    const d = parseIso(iso)
    if (d.getFullYear() !== view.year || d.getMonth() !== view.month0) {
      setView({ year: d.getFullYear(), month0: d.getMonth() })
    }
    setSheetOpen(true)
  }

  const goToday = () => {
    setView({ year: today.getFullYear(), month0: today.getMonth() })
    setSelectedIso(todayIso)
  }

  // 월 이동(시트 닫힌 상태에서만 보이는 버튼). 연도 경계(1월↔12월)는 Date 연산으로 자동 처리.
  const shiftMonth = (delta: number) => {
    const d = new Date(view.year, view.month0 + delta, 1)
    setView({ year: d.getFullYear(), month0: d.getMonth() })
  }

  return (
    <div className="flex h-dvh flex-col bg-white">
      <header className="flex h-[52px] items-center pl-6 pr-[14px]">
        <img src="/logos/sol-mark.svg" alt="SOL" width={36} height={36} className="mr-3 shrink-0" />
        <h1 className="flex-1 text-heading font-bold text-ink">캘린더</h1>
        <button
          className="flex size-11 items-center justify-center"
          onClick={() => navigate('/notification')}
          aria-label="알림"
        >
          <NotificationIc className="text-ink" width={22} height={22} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pt-4 pb-6">
        {/* 월 헤더 */}
        <div className="relative flex items-center justify-center pt-1 pb-[18px]">
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

        {isError ? (
          <p className="py-10 text-center text-sub text-ink-hint">
            캘린더를 불러오지 못했어요
          </p>
        ) : isLoading ? (
          <p role="status" aria-live="polite" className="py-10 text-center text-sub text-ink-hint">
            캘린더를 불러오는 중이에요…
          </p>
        ) : null}
      </main>

      <BottomNav />

      {/* 날짜 선택 시 올라오는 일정·거래 내역 시트 */}
      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        <div className="px-6 pb-8 pt-1">
          <h2 className="pb-1 text-card font-bold text-ink">{formatDayTitle(selectedIso)}</h2>
          <div className="max-h-[62dvh] overflow-y-auto">
            <DaySchedule title="일정" items={schedules} />
            <TransactionList items={transactions} />
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}

export default CalendarPage
