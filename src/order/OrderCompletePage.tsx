import { useNavigate } from 'react-router-dom'
import Button from '../common/components/Button'
import CheckBadge from '../common/components/CheckBadge'

function OrderCompletePage() {
  const navigate = useNavigate()

  return (
    <div className="flex h-dvh flex-col bg-white">
      <div className="flex flex-1 flex-col items-center overflow-y-auto px-5 pt-[calc(5dvh+1.375rem)] pb-6">
        <CheckBadge />

        <h2 className="mt-6 text-heading font-bold text-ink text-center mb-1">실행을 마쳤어요</h2>
        <p className="text-body text-ink-sub text-center mb-8">설계안이 실제 계좌에 반영됐어요</p>

        {/* 월수입 변화 카드 */}
        <div className="w-full rounded-card-lg bg-primary px-5 py-5 mb-4">
          <p className="text-sub text-white/70 mb-1">이제 매달 받는 돈</p>
          <div className="flex items-center gap-2">
            <span className="font-inter text-display font-bold text-white">130만원</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white/60">
              <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-inter text-display font-bold text-white">185만원</span>
          </div>
          <p className="text-sub text-white/70 mt-2">다음 분배금 입금 · 7월 15일</p>
        </div>

        {/* 홈·캘린더 반영 */}
        <div className="w-full rounded-card border border-line px-4 py-4 flex items-center gap-3 mb-4">
          <div className="size-6 rounded-full bg-success flex items-center justify-center shrink-0">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6.5L4.5 9L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-body font-semibold text-ink">홈·캘린더에 반영됐어요</p>
            <p className="text-sub text-ink-hint">생활 안정도 충당률 59% → 84%</p>
          </div>
        </div>

        {/* 안내 박스 */}
        <div className="w-full rounded-btn bg-surface px-4 py-3 mb-8">
          <p className="text-sub text-ink-sub">
            계약일로부터 <span className="font-semibold text-ink">7영업일 이내</span> 청약을 철회할 수 있어요. (일부 상품 한정)
          </p>
        </div>
      </div>

      <div className="px-5 pb-4 shrink-0 flex flex-col gap-2">
        <Button onClick={() => navigate('/home')}>홈으로</Button>
        <button
          onClick={() => navigate('/order/modify')}
          className="w-full text-body text-ink-sub text-center py-3"
        >
          주문 내역 보기
        </button>
      </div>
    </div>
  )
}

export default OrderCompletePage
