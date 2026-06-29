import { useNavigate, type NavigateFunction } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import BottomNav from '../common/components/BottomNav'
import { useGetConsultations } from './hooks/consultation'
import { toConsultRecord } from './utils/consultation'
import type { ConsultRecord } from './types/mypage'

function ConsultHistoryPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useGetConsultations()

  // CANCELLED는 목록에서 제외
  const records: ConsultRecord[] = (data ?? [])
    .filter((c) => c.status !== 'CANCELLED')
    .map(toConsultRecord)

  const reserved = records.filter((r) => r.status === 'reserved').length
  const completed = records.filter((r) => r.status === 'completed').length
  const total = records.length

  return (
    <div className="flex h-dvh flex-col bg-white">
      <AppBar title="상담 내역" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto">
        <div className="h-9" />

        {/* 히어로 카드 */}
        <div
          className="mx-6 rounded-[1.5rem] px-6 py-6"
          style={{ background: 'linear-gradient(135deg, #0046FF 0%, #4F86FF 100%)' }}
        >
          <h2 className="text-display mb-0.5 leading-[1.4] font-bold text-white">
            전문가와 함께하는
            <br />
            은퇴 설계 상담
          </h2>
          <p className="text-body text-white opacity-90">
            예약된 상담과 지난 상담 기록을 확인할 수 있습니다.
          </p>
        </div>

        {/* 통계 + 상담 목록 */}
        <div className="flex flex-col gap-[0.875rem] px-6 pt-6 pb-10">
          {/* 통계 박스 */}
          <div className="flex gap-[0.625rem]">
            {(
              [
                { value: reserved, label: '예약' },
                { value: completed, label: '완료' },
                { value: total, label: '전체' },
              ] as const
            ).map(({ value, label }) => (
              <div
                key={label}
                className="bg-primary-tint rounded-card-xl flex flex-1 flex-col items-center gap-px p-4"
              >
                <span className="text-display text-primary leading-tight font-bold">{value}</span>
                <span className="text-caption text-ink-hint">{label}</span>
              </div>
            ))}
          </div>

          {/* 상담 카드 목록 */}
          {isLoading ? (
            <p className="text-sub text-ink-hint py-10 text-center">상담 내역을 불러오는 중이에요…</p>
          ) : isError ? (
            <div className="flex flex-col items-center gap-3 py-10">
              <p className="text-md font-medium text-ink">상담 내역을 불러오지 못했어요</p>
              <button
                onClick={() => refetch()}
                className="rounded-btn border border-line px-5 py-2.5 text-body font-semibold text-ink"
              >
                다시 시도
              </button>
            </div>
          ) : records.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10">
              <p className="text-md font-medium text-ink">상담 내역이 없어요</p>
              <p className="text-sub text-ink-hint">예약하신 상담이 여기에 표시됩니다</p>
            </div>
          ) : (
            records.map((record) => (
              <ConsultHistoryCard key={record.id} record={record} navigate={navigate} />
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

function ConsultHistoryCard({ record, navigate }: { record: ConsultRecord; navigate: NavigateFunction }) {
  const statusLabel = record.status === 'reserved' ? '예약 완료' : '상담 완료'

  return (
    <div className="border-line rounded-card-xl flex flex-col gap-[0.5625rem] border p-[1.1875rem]">
      <div className="flex items-start justify-between gap-2">
        <span className="text-md text-ink font-bold">{record.title}</span>
        <span className="bg-primary-tint text-primary text-caption shrink-0 rounded-full px-[0.625rem] py-[0.4375rem] leading-none">
          {statusLabel}
        </span>
      </div>

      <div className="text-sub text-ink-sub flex flex-col">
        <span>{record.dateTime}</span>
        <span>{record.location}</span>
      </div>

      {record.actionLabel ? (
        <button
          className="bg-surface rounded-btn text-md text-primary w-full py-[0.875rem] text-center font-semibold"
          onClick={() => record.actionPath && navigate(record.actionPath)}
        >
          {record.actionLabel}
        </button>
      ) : record.status === 'completed' ? (
        <p className="text-sub text-ink-hint py-1 text-center">
          상담 요약이 아직 등록되지 않았어요.
          <br />
          잠시 기다려 주세요.
        </p>
      ) : null}
      {record.status === 'reserved' && (
        <button
          className="text-sub font-semibold text-ink-sub w-full min-h-11 text-center"
          onClick={() => navigate(`/mypage/consult-history/${record.id}/modify`)}
        >
          예약 변경·취소
        </button>
      )}
    </div>
  )
}

export default ConsultHistoryPage
