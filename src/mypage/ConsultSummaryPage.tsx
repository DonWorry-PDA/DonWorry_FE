import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'
import { MOCK_CONSULT_RECORDS } from './mock/mypage'

const SUMMARY_DATA = {
  diagnosis:
    '보유 자산의 약 70%가 예금·현금성에 집중돼 있어요. 인출 단계에서 물가 상승을 방어할 성장 자산이 부족할 수 있습니다.',
  recommendations: [
    "생활비 3년치는 예금·MMF로 유지해 '안전 바닥' 확보",
    '나머지는 배당 ETF·채권 혼합으로 단계적 이전',
    '국민연금 1년 연기 시 수령액 약 7.2% 증액 검토',
  ],
  nextSteps: ['6/19 대면 상담에서 계좌별 인출 순서 확정', 'IRP 추가 납입 한도 점검'],
}

function ConsultSummaryPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const record = MOCK_CONSULT_RECORDS.find((r) => r.id === id)

  const [memo, setMemo] = useState('')
  const [showToast, setShowToast] = useState(false)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
    }
  }, [])

  const handleSave = () => {
    if (!memo.trim()) return
    setShowToast(true)
    toastTimer.current = setTimeout(() => setShowToast(false), 2500)
  }

  const metaLine = [record?.dateTime, record?.location, '김신한 PB팀장'].filter(Boolean).join(' · ')

  return (
    <div className="flex h-dvh flex-col bg-white">
      <AppBar title="상담 요약" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto">
        {/* 상담 헤더 */}
        <div className="px-5 pt-6 pb-1 flex flex-col gap-[7px]">
          <div className="flex items-center gap-2">
            <h2 className="text-card font-extrabold text-ink">{record?.title ?? '상담 요약'}</h2>
            <span className="bg-success-bg text-success text-caption font-bold px-[9px] py-[3px] rounded-badge shrink-0">
              상담 완료
            </span>
          </div>
          <p className="text-sub text-ink-hint">{metaLine}</p>
        </div>

        {/* PB 요약 카드 */}
        <div className="px-5 pt-[18px]">
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
              <p className="text-sub text-ink-sub leading-[1.72]">{SUMMARY_DATA.diagnosis}</p>
            </div>

            {/* 추천 방향 */}
            <div className="pt-[11px]">
              <p className="text-sub font-extrabold text-primary mb-[3px]">추천 방향</p>
              <div className="flex flex-col">
                {SUMMARY_DATA.recommendations.map((item) => (
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
                {SUMMARY_DATA.nextSteps.map((item) => (
                  <p key={item} className="text-sub text-ink-sub leading-[1.72]">
                    · {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 내 메모 */}
        <div className="px-5 pt-6 pb-4 flex flex-col gap-[9px]">
          <div className="flex items-baseline justify-between">
            <span className="text-sub font-semibold text-ink-hint">내 메모</span>
            <span className="text-caption text-disabled">나만 볼 수 있어요</span>
          </div>

          <textarea
            className="w-full min-h-[118px] border border-line rounded-card px-[15px] pt-[15px] pb-4 text-body text-ink placeholder:text-ink-hint resize-none focus:outline-none focus:border-primary transition-colors leading-[1.72]"
            placeholder={`상담에서 기억하고 싶은 내용을 적어보세요.\n예) IRP 추가 납입 7월 안에 알아보기`}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>
      </main>

      <StickyFooter>
        <Button onClick={handleSave} disabled={!memo.trim()}>
          메모 저장
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
