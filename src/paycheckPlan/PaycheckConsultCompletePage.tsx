import { useLocation, useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'
import CheckBadge from '../common/components/CheckBadge'
import type { SelectedBranch, ConsultMethod } from './types/paycheckPlan'

const METHOD_LABELS: Record<ConsultMethod, string> = {
  face: '영업점 대면 상담',
  phone: '전화 상담',
}

const DOW = ['일', '월', '화', '수', '목', '금', '토']

function formatScheduledAt(isoString: string): string {
  const date = new Date(isoString)
  const m = date.getMonth() + 1
  const d = date.getDate()
  const dow = DOW[date.getDay()]
  const h = date.getHours()
  const min = date.getMinutes()
  const period = h < 12 ? '오전' : '오후'
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${m}월 ${d}일 (${dow}) ${period} ${displayH}:${min.toString().padStart(2, '0')}`
}

function shortBranchName(name: string): string {
  return name
    .replace(/^신한투자증권\s+/, '')
    .replace(/^신한은행\s+/, '')
    .replace(/^신한\s+PWM\s+/, '')
    .replace(/^신한\s+/, '')
}

type LocationState = {
  branch: SelectedBranch
  scheduledAt: string
  method: ConsultMethod
}

function PaycheckConsultCompletePage() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state: LocationState | null }

  if (!state) {
    navigate('/home', { replace: true })
    return null
  }

  const { branch, scheduledAt, method } = state

  return (
    <div className="flex flex-col h-dvh">
      <AppBar title="상담 예약" onBack={() => navigate('/home', { replace: true })} />

      <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-[80px]">
        {/* 성공 아이콘 */}
        <div className="flex justify-center mb-6">
          <CheckBadge />
        </div>

        <h2 className="text-[21.7px] font-extrabold text-ink text-center mb-8 leading-[1.42]">
          상담이 예약됐어요
        </h2>

        {/* 예약 요약 카드 */}
        <div className="border border-[#e7eaef] rounded-[16px] divide-y divide-[#eef0f3]">
          <div className="flex items-center justify-between px-[18px] py-4">
            <span className="text-[14.2px] text-ink-hint">지점</span>
            <span className="text-[13.3px] font-bold text-ink">{shortBranchName(branch.name)}</span>
          </div>
          <div className="flex items-center justify-between px-[18px] py-4">
            <span className="text-[14.2px] text-ink-hint">일시</span>
            <span className="text-[13.3px] font-bold text-ink">{formatScheduledAt(scheduledAt)}</span>
          </div>
          <div className="flex items-center justify-between px-[18px] py-4">
            <span className="text-[14.2px] text-ink-hint">방식</span>
            <span className="text-[13.3px] font-bold text-ink">{METHOD_LABELS[method]}</span>
          </div>
          <div className="flex items-center justify-between px-[18px] py-4">
            <span className="text-[14.2px] text-ink-hint">담당</span>
            <span className="text-[13.3px] font-bold text-ink">예약 확정 후 PB 배정</span>
          </div>
        </div>
      </div>

      <StickyFooter>
        <div className="flex flex-col gap-3">
          <Button onClick={() => navigate('/mypage/consult-history')}>예약 내역 보기</Button>
          <Button variant="outline" onClick={() => navigate('/home')}>홈으로</Button>
        </div>
      </StickyFooter>
    </div>
  )
}

export default PaycheckConsultCompletePage
