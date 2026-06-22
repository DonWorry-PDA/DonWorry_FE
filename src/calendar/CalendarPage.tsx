import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import BottomNav from '../common/components/BottomNav'
import MonthGrid from './components/MonthGrid'
import EventLegend from './components/EventLegend'
import DaySchedule from './components/DaySchedule'
import TransactionList from './components/TransactionList'
import {
  MOCK_EVENTS,
  MOCK_SCHEDULES,
  MOCK_TODAY_ISO,
  MOCK_TRANSACTIONS,
} from './mock/calendar'
import {
  formatDayTitle,
  formatMonthTitle,
  parseIso,
} from './utils/monthGrid'

function CalendarPage() {
  const navigate = useNavigate()
  const today = parseIso(MOCK_TODAY_ISO)

  const [view, setView] = useState({
    year: today.getFullYear(),
    month0: today.getMonth(),
  })
  const [selectedIso, setSelectedIso] = useState(MOCK_TODAY_ISO)

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
    setSelectedIso(MOCK_TODAY_ISO)
  }

  const schedules = MOCK_SCHEDULES[selectedIso] ?? []
  const transactions = MOCK_TRANSACTIONS[selectedIso] ?? []

  return (
    <div className="flex h-dvh flex-col bg-white">
      <AppBar title="캘린더" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto px-[18px] pb-6">
        {/* 월 헤더 */}
        <div className="flex items-center justify-between pt-1 pb-[14px]">
          <h1 className="text-card font-bold text-ink">
            {formatMonthTitle(view.year, view.month0)} ›
          </h1>
          <button onClick={goToday} className="text-body font-semibold text-primary">
            오늘
          </button>
        </div>

        <MonthGrid
          year={view.year}
          month0={view.month0}
          todayIso={MOCK_TODAY_ISO}
          selectedIso={selectedIso}
          events={MOCK_EVENTS}
          onSelect={handleSelect}
        />

        <EventLegend />

        <DaySchedule title={`${formatDayTitle(selectedIso)} 일정`} items={schedules} />

        <TransactionList items={transactions} />
      </main>

      <BottomNav />
    </div>
  )
}

export default CalendarPage
