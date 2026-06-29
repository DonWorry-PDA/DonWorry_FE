import { useNavigate, useParams } from 'react-router-dom'
import AppBar from '@/common/components/AppBar'
import CircularProgress from './components/CircularProgress'
import { AccountType, ACCOUNT_META } from './types/purposeAccount'
import { MOCK_ACCOUNTS } from './mock/purposeAccountData'
import { formatKrw, formatWon } from '@/common/utils/formatKrw'

export default function PurposeDetailPage() {
  const navigate = useNavigate()
  const { accountType } = useParams<{ accountType: string }>()

  const account = MOCK_ACCOUNTS.find((a) => a.type === accountType)
  if (!account) return null

  const meta = ACCOUNT_META[account.type as AccountType]
  const pct = Math.round((account.current / account.goal) * 100)
  const remaining = account.goal - account.current

  const moreBtn = (
    <button className="flex items-center justify-center w-7 h-7" aria-label="더보기">
      <svg width={20} height={20} viewBox="0 0 20 20" fill="none" className="text-ink">
        <circle cx={4} cy={10} r={1.5} fill="currentColor" />
        <circle cx={10} cy={10} r={1.5} fill="currentColor" />
        <circle cx={16} cy={10} r={1.5} fill="currentColor" />
      </svg>
    </button>
  )

  return (
    <div className="flex flex-col h-dvh bg-white">
      <AppBar title={account.name} onBack={() => navigate(-1)} rightAction={moreBtn} />

      <div className="flex-1 overflow-y-auto">
        {/* Circular progress section */}
        <div className="flex flex-col items-center px-6 pt-8 pb-8">
          <CircularProgress
            percentage={pct}
            hexColor={meta.hexColor}
            size={172}
            strokeWidth={16}
            label="달성"
          />

          <div className="mt-6 text-center">
            <div className="flex items-baseline justify-center gap-1">
              <span className="font-inter text-display font-bold text-ink">
                {formatKrw(account.current)}
              </span>
              <span className="text-body text-ink-hint">/ {formatKrw(account.goal)}</span>
            </div>
            <p className="text-body text-ink-sub mt-1">
              목표까지{' '}
              <span className="font-semibold" style={{ color: meta.color }}>
                {formatKrw(remaining)}
              </span>{' '}
              남았어요
            </p>
          </div>
        </div>

        {/* Info card */}
        <div className="mx-4 rounded-card-lg border border-line overflow-hidden">
          <div className="flex justify-between items-center px-4 py-4 border-b border-divider">
            <span className="text-body text-ink-sub">매달 자동 적립</span>
            <span className="font-inter text-body font-semibold" style={{ color: meta.color }}>
              {formatKrw(account.monthly)}
            </span>
          </div>
          <div className="flex justify-between items-center px-4 py-4">
            <span className="text-body text-ink-sub">다음 적립일</span>
            <span className="font-inter text-body font-semibold text-ink">
              {account.nextDepositDate}
            </span>
          </div>
        </div>

        {/* Completion estimate */}
        <p className="text-sub text-ink-hint text-center mt-4 px-6">
          지금 속도면 {account.completionDate}쯤 목표를 채워요.
          {account.type === 'emergency' && ' 급할 땐 언제든 꺼내 쓸 수 있어요.'}
        </p>

        {/* Transaction history */}
        <div className="mt-6 px-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-body font-semibold text-ink">입출금 내역</span>
            <button className="text-sub text-ink-hint">전체 &rsaquo;</button>
          </div>

          <div className="flex flex-col divide-y divide-divider">
            {account.transactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 py-3">
                <div
                  className="w-9 h-9 rounded-icon flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: tx.isDeposit ? meta.bgColor : 'var(--color-surface)' }}
                >
                  {tx.isDeposit ? (
                    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" style={{ color: meta.color }}>
                      <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" className="text-ink-sub">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body text-ink">{tx.label}</p>
                  <p className="text-sub text-ink-hint">{tx.date}</p>
                </div>
                <span
                  className="font-inter text-body font-semibold flex-shrink-0"
                  style={{ color: tx.isDeposit ? meta.color : 'var(--color-ink)' }}
                >
                  {tx.isDeposit ? '+' : '-'}{formatWon(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom padding for fixed footer */}
        <div className="h-28" />
      </div>

      {/* Fixed bottom buttons */}
      <div className="shrink-0 bg-white border-t border-divider px-4 pb-10 pt-3 flex gap-3">
        <button className="flex-1 border-2 border-line bg-white rounded-btn text-btn font-bold py-4 text-ink">
          꺼내기
        </button>
        <button
          className="flex-1 rounded-btn text-btn font-bold py-4 text-white"
          style={{ backgroundColor: meta.color }}
        >
          적립액 변경
        </button>
      </div>
    </div>
  )
}
