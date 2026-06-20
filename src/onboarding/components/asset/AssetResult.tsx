import { useNavigate } from 'react-router-dom'
import { NavHomeIc, NotificationIc } from '../../../common/assets/icons'
import { formatKrw } from '../../../common/utils/formatKrw'
import { MOCK_LINKED_ACCOUNTS } from '../../../mypage/mock/mypage'

const totalAsset = MOCK_LINKED_ACCOUNTS.reduce((sum, a) => sum + a.amountKrw, 0)
const MOCK_MONTHLY_INCOME_MAN = 130

function AssetResult() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex items-center justify-end gap-4 px-6 pt-12 pb-4 text-ink">
        <NotificationIc width={24} height={24} />
        <NavHomeIc width={24} height={24} />
      </div>

      <div className="flex flex-1 flex-col items-center px-6 pt-8">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary">
          <svg width="28" height="21" viewBox="0 0 28 21" fill="none" aria-hidden="true">
            <path d="M2 10L10 18L26 2" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="mt-6 text-heading font-bold text-ink">자산 연결 결과</h1>
        <p className="mt-2 text-body text-ink-sub">
          마이데이터로 연결된 자산을 한눈에 모아드려요.
        </p>

        <div className="mt-8 w-full rounded-card bg-surface p-4">
          <div className="flex items-center justify-between">
            <span className="text-sub text-ink-sub">마이데이터</span>
            <span className="text-body text-ink">신한은행 외 12개 자산 연결</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="rounded-badge bg-danger-bg px-2 py-0.5 text-sub text-danger-text">
              연결 오류
            </span>
            <span className="text-body text-ink-sub">연결하지 못한 기관이 있어요</span>
          </div>
        </div>

        <div className="mt-4 w-full rounded-card bg-surface p-4">
          <div className="flex items-center justify-between">
            <span className="text-body text-ink-sub">연결된 총자산</span>
            <span className="font-inter text-card font-bold text-ink">
              {formatKrw(totalAsset)}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-body text-ink-sub">매달 들어오는 돈</span>
            <span className="font-inter text-body font-bold text-ink">
              {MOCK_MONTHLY_INCOME_MAN}만원
            </span>
          </div>
        </div>

        <p className="mt-4 text-center text-sub text-ink-sub">
          이제 생활비 충당 상태를 함께 살펴볼게요.
        </p>
      </div>

      <div className="px-6 pb-10">
        <button
          type="button"
          onClick={() => navigate('/mypage', { replace: true })}
          className="w-full rounded-btn bg-primary py-4 text-btn font-bold text-white"
        >
          시작하기
        </button>
      </div>
    </div>
  )
}

export default AssetResult
