import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createPortal } from 'react-dom'
import AppBar from '../common/components/AppBar'
import DateTimePickerSheet, { formatTime24 } from '../common/components/DateTimePickerSheet'
import { MOCK_CONSULT_RECORDS } from './mock/mypage'

type AlertState = 'save-success' | 'cancel-confirm' | 'cancel-done' | null

function parseDateTime(dateTimeStr: string) {
  const [datePart, time24] = dateTimeStr.split(' ')
  const [year, month, day] = datePart.split('.').map(Number)
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][new Date(year, month - 1, day).getDay()]
  const displayTime = formatTime24(time24)

  return {
    date: new Date(year, month - 1, day),
    fullDate: `${year}년 ${month}월 ${day}일 (${dayOfWeek})`,
    time: displayTime,
    time24,
  }
}

function formatShortDate(date: Date): string {
  const dow = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${dow})`
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-[0.875rem]">
      <span className="text-body text-ink-hint">{label}</span>
      <span className="text-body font-bold text-ink">{value}</span>
    </div>
  )
}

// 공통 알림창 카드
function AlertCard({ children }: { children: React.ReactNode }) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-[30px] bg-black/50">
      <div className="w-full max-w-[316px] rounded-[20px] bg-white px-[22px] pb-[18px] pt-[26px] shadow-[0px_20px_50px_-12px_rgba(0,0,0,0.4)]">
        {children}
      </div>
    </div>,
    document.body,
  )
}

// 아이콘: 파란 체크 (저장 완료, 취소 완료)
function IconCheck() {
  return (
    <div className="flex size-14 items-center justify-center rounded-[28px] bg-[#edf2ff]">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M6.5 14.5L11.5 19.5L21.5 8.5"
          stroke="#0046FF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

// 아이콘: 빨간 경고 (취소 확인)
function IconWarning() {
  return (
    <div className="flex size-14 items-center justify-center rounded-[28px] bg-[#fcebeb]">
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path
          d="M13 3L24 22H2L13 3Z"
          stroke="#E5484D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="13" y1="10" x2="13" y2="15" stroke="#E5484D" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="13" cy="18.5" r="1.3" fill="#E5484D" />
      </svg>
    </div>
  )
}

function ConsultModifyPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const record = MOCK_CONSULT_RECORDS.find((r) => r.id === id)
  const parsed = record ? parseDateTime(record.dateTime) : null

  const [selectedDate, setSelectedDate] = useState<Date>(parsed?.date ?? new Date())
  const [selectedTime24, setSelectedTime24] = useState<string>(parsed?.time24 ?? '14:00')
  const [showDateTimePicker, setShowDateTimePicker] = useState(false)
  const [alertState, setAlertState] = useState<AlertState>(null)

  if (!record || !parsed) {
    return (
      <div className="flex h-dvh flex-col bg-white">
        <AppBar title="예약 변경·취소" onBack={() => navigate(-1)} />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-body text-ink-sub">상담 내역을 찾을 수 없어요.</p>
        </div>
      </div>
    )
  }

  // 취소 확인창에 표시할 "6월 19일 (금) 오후 2:00 상담이 취소돼요." 텍스트
  const cancelPreviewText = `${formatShortDate(selectedDate)} ${formatTime24(selectedTime24)} 상담이 취소돼요.`

  return (
    <div className="flex h-dvh flex-col bg-white">
      <AppBar title="예약 변경·취소" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto">
        {/* 타이틀 */}
        <div className="flex flex-col gap-[0.5625rem] px-5 pb-[1.125rem] pt-2">
          <h2 className="text-heading font-extrabold leading-[1.43] tracking-[-0.025em] text-ink">
            예약을
            <br />
            변경하거나 취소할 수 있어요
          </h2>
          <p className="text-sub text-ink-hint">
            {record.title} · {record.location}
          </p>
        </div>

        {/* 현재 예약 */}
        <div className="flex flex-col gap-2 px-5 pb-[1.125rem]">
          <p className="text-sub font-semibold text-ink-hint">현재 예약</p>
          <div className="rounded-card-lg border border-line px-[1.0625rem] py-[0.3125rem]">
            <InfoRow label="상담원" value={record.counselor ?? '—'} />
            <div className="h-px bg-divider" />
            <InfoRow label="날짜" value={parsed.fullDate} />
            <div className="h-px bg-divider" />
            <InfoRow label="시간" value={parsed.time} />
          </div>
        </div>

        {/* 날짜·시간 변경 */}
        <div className="px-5 pt-1 pb-[1.125rem]">
          <p className="text-sub font-semibold text-ink-hint">다른 날짜·시간으로 변경</p>

          <button
            className="flex w-full items-center justify-between py-[1.125rem]"
            onClick={() => setShowDateTimePicker(true)}
          >
            <span className="text-body text-ink-hint">날짜 · 시간</span>
            <div className="flex items-center gap-1">
              <span className="text-body font-bold text-ink">
                {formatShortDate(selectedDate)} · {formatTime24(selectedTime24)}
              </span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M6.75 4.5L11.25 9L6.75 13.5"
                  stroke="#1A1D24"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>

          <div className="h-px bg-divider" />

          <button
            className="mt-[1.125rem] flex h-[3.375rem] w-full items-center justify-center rounded-card bg-primary text-btn font-bold text-white"
            onClick={() => setAlertState('save-success')}
          >
            변경 내용 저장
          </button>
        </div>

        {/* 예약 취소 */}
        <div className="flex flex-col gap-[0.875rem] px-5 pt-1 pb-6">
          <div className="h-px bg-divider" />

          <button
            className="flex h-[3.625rem] w-full items-center justify-center rounded-card border border-[#f3c9cb] text-btn font-bold text-danger"
            onClick={() => setAlertState('cancel-confirm')}
          >
            예약 취소하기
          </button>

          <div className="rounded-card bg-[#f1f5fb] px-4 py-[0.9375rem]">
            <p className="text-sub text-ink-sub">
              상담 시작 2시간 전까지 무료로 취소할 수 있어요.
            </p>
          </div>
        </div>
      </main>

      {/* 날짜·시간 선택 바텀시트 */}
      <DateTimePickerSheet
        open={showDateTimePicker}
        initialDate={selectedDate}
        initialTime24={selectedTime24}
        onConfirm={(date, time24) => {
          setSelectedDate(date)
          setSelectedTime24(time24)
        }}
        onClose={() => setShowDateTimePicker(false)}
      />

      {/* ── 알림창 1: 변경 저장 완료 ── */}
      {alertState === 'save-success' && (
        <AlertCard>
          <div className="flex flex-col items-center gap-2">
            <IconCheck />
            <p className="pt-[7px] text-center text-[17px] font-extrabold text-ink">
              저장되었습니다
            </p>
            <p className="pb-3 text-center text-sub leading-[1.63] text-ink-hint">
              변경한 예약 정보가 저장됐어요.
            </p>
            <button
              className="flex h-[50px] w-full items-center justify-center rounded-[13px] bg-primary text-btn font-bold text-white"
              onClick={() => navigate('/mypage/consult-history')}
            >
              확인
            </button>
          </div>
        </AlertCard>
      )}

      {/* ── 알림창 2: 예약 취소 확인 ── */}
      {alertState === 'cancel-confirm' && (
        <AlertCard>
          <div className="flex flex-col items-center gap-2">
            <IconWarning />
            <p className="pt-[7.5px] text-center text-[17px] font-extrabold text-ink">
              예약을 취소할까요?
            </p>
            <p className="text-center text-sub leading-[1.63] text-ink-hint">
              {cancelPreviewText}
              <br />
              취소 후에는 다시 예약해야 해요.
            </p>
            <div className="flex w-full gap-[9px] pt-[12.5px]">
              <button
                className="flex h-[50px] flex-1 items-center justify-center rounded-[13px] border border-[#e1e5eb] text-btn font-bold text-ink"
                onClick={() => setAlertState(null)}
              >
                닫기
              </button>
              <button
                className="flex h-[50px] flex-1 items-center justify-center rounded-[13px] bg-[#e5484d] text-btn font-bold text-white"
                onClick={() => setAlertState('cancel-done')}
              >
                예약 취소
              </button>
            </div>
          </div>
        </AlertCard>
      )}

      {/* ── 알림창 3: 취소 완료 ── */}
      {alertState === 'cancel-done' && (
        <AlertCard>
          <div className="flex flex-col items-center gap-2">
            <IconCheck />
            <p className="pt-[7px] text-center text-[17px] font-extrabold leading-[1.43] text-ink">
              상담 예약이
              <br />
              취소됐어요
            </p>
            <p className="pb-3 text-center text-sub leading-[1.63] text-ink-hint">
              필요할 때 언제든 다시 예약할 수 있어요.
            </p>
            <button
              className="flex h-[50px] w-full items-center justify-center rounded-[13px] bg-primary text-btn font-bold text-white"
              onClick={() => navigate('/mypage/consult-history')}
            >
              확인
            </button>
          </div>
        </AlertCard>
      )}
    </div>
  )
}

export default ConsultModifyPage
