import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { isAxiosError } from 'axios'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'
import {
  useGetConsultation,
  useGetConsultationSummary,
  usePatchConsultationMemo,
} from './hooks/consultation'
import { formatScheduledAt } from './utils/consultation'

function ConsultSummaryPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data: record,
    isLoading: isRecordLoading,
    isError: isRecordError,
    refetch: refetchRecord,
  } = useGetConsultation(id)
  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    error: summaryError,
    refetch: refetchSummary,
  } = useGetConsultationSummary(id)
  const memoMutation = usePatchConsultationMemo(id ?? '')

  // 저장된 메모를 기본값으로, 사용자가 입력하면 draft 우선. draft를 상담 id에 묶어 다른 상담과 섞이지 않게 한다.
  const [memoDraft, setMemoDraft] = useState<{ id: string; value: string } | null>(null)
  const draftMemo = memoDraft && memoDraft.id === id ? memoDraft.value : null
  const [showToast, setShowToast] = useState(false)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
    }
  }, [])

  const handleSave = () => {
    const value = draftMemo ?? summary?.memo ?? ''
    if (!value.trim() || !id) return
    memoMutation.mutate(value, {
      onSuccess: () => {
        setShowToast(true)
        toastTimer.current = setTimeout(() => setShowToast(false), 2500)
      },
    })
  }

  if (isRecordLoading || isSummaryLoading) {
    return (
      <div className="flex h-dvh flex-col bg-white">
        <AppBar title="상담 요약" onBack={() => navigate(-1)} />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sub text-ink-hint">불러오는 중이에요…</p>
        </div>
      </div>
    )
  }

  if (isRecordError) {
    return (
      <div className="flex h-dvh flex-col bg-white">
        <AppBar title="상담 요약" onBack={() => navigate(-1)} />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5">
          <p className="text-body text-ink-sub">상담 정보를 불러오지 못했어요.</p>
          <button
            onClick={() => refetchRecord()}
            className="rounded-btn border border-line px-5 py-2.5 text-body font-semibold text-ink"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  if (!record) {
    return (
      <div className="flex h-dvh flex-col bg-white">
        <AppBar title="상담 요약" onBack={() => navigate(-1)} />
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5">
          <p className="text-md font-medium text-ink">상담 기록을 찾을 수 없어요</p>
          <button onClick={() => navigate(-1)} className="text-sub text-primary">돌아가기</button>
        </div>
      </div>
    )
  }

  // 요약 없는 완료 건(404)은 "요약 없음", 그 외 오류는 재시도 가능 화면
  const summaryNotFound =
    isSummaryError && isAxiosError(summaryError) && summaryError.response?.status === 404

  if (summaryNotFound) {
    return (
      <div className="flex h-dvh flex-col bg-white">
        <AppBar title="상담 요약" onBack={() => navigate(-1)} />
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5">
          <p className="text-md font-medium text-ink">아직 상담 요약이 없어요</p>
          <button onClick={() => navigate(-1)} className="text-sub text-primary">돌아가기</button>
        </div>
      </div>
    )
  }

  if (isSummaryError || !summary) {
    return (
      <div className="flex h-dvh flex-col bg-white">
        <AppBar title="상담 요약" onBack={() => navigate(-1)} />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5">
          <p className="text-body text-ink-sub">상담 요약을 불러오지 못했어요.</p>
          <button
            onClick={() => refetchSummary()}
            className="rounded-btn border border-line px-5 py-2.5 text-body font-semibold text-ink"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  const memo = draftMemo ?? summary.memo ?? ''
  const metaLine = [formatScheduledAt(record.scheduledAt), record.location, record.counselorName]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="flex h-dvh flex-col bg-white">
      <AppBar title="상담 요약" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto">
        {/* 상담 헤더 */}
        <div className="px-6 pt-6 pb-1 flex flex-col gap-[7px]">
          <div className="flex items-center gap-2">
            <h2 className="text-card font-extrabold text-ink">{record.title}</h2>
            <span className="bg-success-bg text-success text-caption font-bold px-[9px] py-[3px] rounded-badge shrink-0">
              상담 완료
            </span>
          </div>
          <p className="text-sub text-ink-hint">{metaLine}</p>
        </div>

        {/* PB 요약 카드 */}
        <div className="px-6 pt-[18px]">
          <div className="border border-line rounded-card-xl p-[19px] flex flex-col gap-1">
            {/* 카드 헤더 */}
            <div className="flex items-center gap-[9px] mb-[4.8px]">
              <div className="bg-primary-tint size-[30px] rounded-full flex items-center justify-center shrink-0">
                <span className="text-caption font-extrabold text-primary">PB</span>
              </div>
              <span className="text-sub font-bold text-ink">상담원이 작성한 요약</span>
            </div>

            {/* 진단 요약 */}
            <div className="pt-[9px]">
              <p className="text-sub font-extrabold text-primary mb-[3px]">진단 요약</p>
              <p className="text-sub text-ink-sub leading-[1.72]">{summary.diagnosis}</p>
            </div>

            {/* 추천 방향 */}
            <div className="pt-[11px]">
              <p className="text-sub font-extrabold text-primary mb-[3px]">추천 방향</p>
              <div className="flex flex-col">
                {summary.recommendations.map((item) => (
                  <p key={item} className="text-sub text-ink-sub leading-[1.72]">
                    · {item}
                  </p>
                ))}
              </div>
            </div>

            {/* 다음 단계 */}
            <div className="pt-[11px]">
              <p className="text-sub font-extrabold text-primary mb-[3px]">다음 단계</p>
              <div className="flex flex-col">
                {summary.nextSteps.map((item) => (
                  <p key={item} className="text-sub text-ink-sub leading-[1.72]">
                    · {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 내 메모 */}
        <div className="px-6 pt-6 pb-4 flex flex-col gap-[9px]">
          <div className="flex items-baseline justify-between">
            <span className="text-sub font-semibold text-ink-hint">내 메모</span>
            <span className="text-caption text-disabled">나만 볼 수 있어요</span>
          </div>

          <textarea
            className="w-full min-h-[118px] border border-line rounded-card px-[15px] pt-[15px] pb-4 text-body text-ink placeholder:text-ink-hint resize-none focus:outline-none focus:border-primary transition-colors leading-[1.72]"
            placeholder={`상담에서 기억하고 싶은 내용을 적어보세요.\n예) IRP 추가 납입 7월 안에 알아보기`}
            value={memo}
            onChange={(e) => setMemoDraft({ id: id ?? '', value: e.target.value })}
          />
        </div>
      </main>

      <StickyFooter>
        <Button onClick={handleSave} disabled={!memo.trim() || memoMutation.isPending}>
          {memoMutation.isPending ? '저장 중…' : '메모 저장'}
        </Button>
      </StickyFooter>

      {/* 저장 완료 토스트 */}
      <div
        className={`absolute bottom-[14px] left-5 right-5 z-50 flex items-center gap-[9px] bg-[#23282f] rounded-[13px] px-4 py-[15px] shadow-float transition-all duration-300 ${
          showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <div className="bg-primary size-5 rounded-[10px] flex items-center justify-center shrink-0">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6L5 9L10 3"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-sub font-semibold text-white">메모를 저장했어요</span>
      </div>
    </div>
  )
}

export default ConsultSummaryPage
