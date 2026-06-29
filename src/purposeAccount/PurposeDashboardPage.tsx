import { useNavigate } from 'react-router-dom'
import AppBar from '@/common/components/AppBar'
import CircularProgress from './components/CircularProgress'
import { ACCOUNT_META } from './types/purposeAccount'
import { MOCK_ACCOUNTS, TOTAL_DISTRIBUTION, USED_DISTRIBUTION, NEXT_DISTRIBUTION_DATE } from './mock/purposeAccountData'
import { formatKrw } from '@/common/utils/formatKrw'

export default function PurposeDashboardPage() {
  const navigate = useNavigate()

  const plusBtn = (
    <button
      onClick={() => navigate('/purpose-account/select')}
      className="flex items-center justify-center w-7 h-7"
      aria-label="통장 추가"
    >
      <svg width={20} height={20} viewBox="0 0 20 20" fill="none" className="text-ink">
        <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      </svg>
    </button>
  )

  return (
    <div className="flex flex-col h-dvh bg-white">
      <div className="bg-white shrink-0">
        <AppBar title="목적별 통장" onBack={() => navigate(-1)} rightAction={plusBtn} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-10">
        {/* Banner */}
        <div className="bg-primary rounded-card-xl p-5 mb-4">
          <p className="text-sub text-white/80">매달 자동으로 모으는 중</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-inter text-display font-bold text-white">
              {formatKrw(USED_DISTRIBUTION)}
            </span>
            <span className="text-body text-white/70">/ {formatKrw(TOTAL_DISTRIBUTION)}</span>
          </div>

          <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${(USED_DISTRIBUTION / TOTAL_DISTRIBUTION) * 100}%` }}
            />
          </div>

          <p className="text-sub text-white/70 mt-2">다음 배분 · {NEXT_DISTRIBUTION_DATE}</p>
        </div>

        {/* Account cards */}
        <div className="flex flex-col gap-3">
          {MOCK_ACCOUNTS.length === 0 && (
            <div className="flex flex-col items-center py-16 gap-4">
              <p className="text-body text-ink-sub text-center">
                아직 만든 통장이 없어요.
                <br />
                목적별 통장을 만들어 보세요.
              </p>
              <button
                onClick={() => navigate('/purpose-account/select')}
                className="bg-primary text-white rounded-btn text-btn font-bold px-8 py-3"
              >
                통장 만들기
              </button>
            </div>
          )}
          {MOCK_ACCOUNTS.map((account) => {
            const meta = ACCOUNT_META[account.type]
            const pct = Math.round((account.current / account.goal) * 100)

            return (
              <button
                key={account.type}
                onClick={() => navigate(`/purpose-account/detail/${account.type}`)}
                className="w-full bg-white rounded-card-lg p-4 flex items-center gap-4 border border-line text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex-shrink-0">
                  <CircularProgress
                    percentage={pct}
                    hexColor={meta.hexColor}
                    size={72}
                    strokeWidth={7}
                    label="달성"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-body font-semibold text-ink">{account.name}</p>
                  <p className="font-inter text-sub text-ink-sub mt-0.5">
                    {formatKrw(account.current)} / {formatKrw(account.goal)}
                  </p>
                  <p className="text-sub mt-1" style={{ color: meta.color }}>
                    매달 {formatKrw(account.monthly)} 자동 적립
                  </p>
                </div>

                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" className="text-ink-hint flex-shrink-0">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )
          })}
        </div>

        <div className="mt-4 bg-surface rounded-card px-4 py-3 border border-line">
          <p className="text-sub text-ink-sub">
            목표를 채우면 알려드려요. 급할 땐 통장에서 바로 꺼내 쓸 수 있어요.
          </p>
        </div>
      </div>
    </div>
  )
}
