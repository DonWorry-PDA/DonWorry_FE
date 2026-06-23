import { useNavigate } from 'react-router-dom'
import BottomNav from '../common/components/BottomNav'
import { NotificationIc } from '../common/assets/icons'
import AssetSummaryCard from './components/AssetSummaryCard'
import ManageMenuCard from './components/ManageMenuCard'
import type { AssetHubSummary, ManageMenu } from './types/asset'

const MOCK_SUMMARY: AssetHubSummary = {
  totalAmountKrw: 251_200_000,
  changeAmountKrw: 1_200_000,
  changeDirection: 'UP',
  allocation: [
    { label: '연금', pct: 60 },
    { label: '예금', pct: 20 },
    { label: 'ETF', pct: 12 },
    { label: '주식', pct: 8 },
  ],
  monthlyIncomeKrw: 1_300_000,
  monthlyExpenseKrw: 2_180_000,
}

const MOCK_MENUS: ManageMenu[] = [
  {
    key: 'salaryMaking',
    title: '월급 만들기',
    caption: '목표 220만 중 130만',
    path: '/paycheck-plan/assets',
    iconTone: 'primary',
    progressPct: 59,
    highlighted: true,
  },
  {
    key: 'lifeStability',
    title: '생활 안정도',
    caption: '충당률 59%',
    path: '/stability',
    iconTone: 'warning',
    statusDot: 'warning',
    statusText: '주의',
  },
  {
    key: 'investmentCheck',
    title: '투자 건강검진',
    caption: '월급 만드는 자산\n32%뿐이에요',
    path: '/asset/investment-checkup',
    iconTone: 'muted',
  },
  {
    key: 'monthlyReport',
    title: '월간 리포트',
    caption: '6월 리포트가\n도착했어요',
    path: '/asset/monthly-report',
    iconTone: 'muted',
    isNew: true,
  },
]

function AssetHubPage() {
  const navigate = useNavigate()

  return (
    <div className="bg-page flex h-dvh flex-col">
      <header className="flex shrink-0 items-center justify-between px-5 pt-3 pb-2">
        <h1 className="text-heading text-ink font-bold">자산관리</h1>
        <button
          aria-label="알림"
          onClick={() => navigate('/notification')}
          className="-mr-2 flex size-11 items-center justify-center"
        >
          <NotificationIc className="text-ink" width={22} height={22} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-6">
        <div className="flex flex-col gap-5 px-5">
          <AssetSummaryCard {...MOCK_SUMMARY} />

          <section>
            <h2 className="text-body text-ink mb-3 font-bold">관리 메뉴</h2>
            <div className="grid grid-cols-2 gap-3 [grid-auto-rows:1fr]">
              {MOCK_MENUS.map((menu) => (
                <ManageMenuCard key={menu.key} menu={menu} onClick={() => navigate(menu.path)} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

export default AssetHubPage
