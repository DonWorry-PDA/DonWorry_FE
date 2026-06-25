import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'
import SelectChip from '../common/components/SelectChip'
import ConsultCard from './components/ConsultCard'
import { mockConsultCards, mockTimeSlots } from './mock/paycheckPlan'
import type { ConsultType } from './types/paycheckPlan'
import { usePostConsultation } from '../mypage/hooks/consultation'
import { buildScheduledAtIso } from '../mypage/utils/consultation'

function PaycheckConsultPage() {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState<ConsultType>('pb')
  const [sendChecked, setSendChecked] = useState(true)
  const [selectedTime, setSelectedTime] = useState('10:30')
  const createConsultation = usePostConsultation()

  // 날짜 선택 UI 미연동 — 시연용으로 5일 뒤로 고정(표시·전송에 동일 값 사용)
  const [reservationDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 5)
    return d
  })
  const DOW = ['일', '월', '화', '수', '목', '금', '토']
  const reservationDateLabel = `${reservationDate.getMonth() + 1}월 ${reservationDate.getDate()}일 (${DOW[reservationDate.getDay()]})`

  const handleReserve = () => {
    createConsultation.mutate(
      {
        consultType: selectedType === 'pb' ? 'PB' : 'INSURANCE',
        scheduledAt: buildScheduledAtIso(reservationDate, selectedTime),
        planId: null,
      },
      { onSuccess: () => navigate('/mypage/consult-history') },
    )
  }

  return (
    <div className="flex flex-col h-full">
      <AppBar title="전문가와 같이 보기" onBack={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto px-5 pt-4">
        <h2 className="text-heading font-bold text-ink mb-1">
          진단 결과를 보니,
          <br />
          이런 상담이 도움이 되겠어요
        </h2>
        <p className="text-body text-ink-sub mb-5">가입을 권하는 게 아니라, 진단에서 나온 것만 연결해드려요.</p>

        <div className="flex flex-col gap-3 mb-6">
          {mockConsultCards.map((card) => (
            <ConsultCard
              key={card.type}
              card={card}
              selected={selectedType === card.type}
              sendChecked={sendChecked}
              onSendToggle={setSendChecked}
              onClick={() => setSelectedType(card.type)}
            />
          ))}
        </div>

        <div className="mb-1">
          <p className="text-sub text-ink-hint mb-4">예약</p>

          <div className="flex items-center justify-between py-3 border-t border-divider">
            <span className="text-body text-ink-sub">지점</span>
            <button className="text-body font-medium text-ink flex items-center gap-1">
              신한은행 서소문 PWM센터
              <span className="text-ink-hint">›</span>
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-divider mb-4">
            <span className="text-body text-ink-sub">날짜</span>
            <button className="text-body font-medium text-ink flex items-center gap-1">
              {reservationDateLabel}
              <span className="text-ink-hint">›</span>
            </button>
          </div>

          <div className="flex gap-2">
            {mockTimeSlots.map((slot) => (
              <SelectChip
                key={slot.time}
                selected={selectedTime === slot.time}
                onClick={() => setSelectedTime(slot.time)}
              >
                {slot.period} {slot.time}
              </SelectChip>
            ))}
          </div>
        </div>
      </div>

      <StickyFooter>
        <div className="flex flex-col gap-1.5">
          <Button onClick={handleReserve} disabled={createConsultation.isPending}>
            {createConsultation.isPending ? '예약 중…' : '상담 예약하기'}
          </Button>
          {createConsultation.isError ? (
            <p className="text-sub text-danger text-center">예약에 실패했어요. 잠시 후 다시 시도해주세요.</p>
          ) : (
            <p className="text-sub text-ink-hint text-center">예약 변경·취소는 마이페이지에서 할 수 있어요</p>
          )}
        </div>
      </StickyFooter>
    </div>
  )
}

export default PaycheckConsultPage
