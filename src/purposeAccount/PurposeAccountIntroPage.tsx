import { useNavigate } from 'react-router-dom'
import AppBar from '@/common/components/AppBar'
import useGetAssetHub from '@/asset/hooks/useGetAssetHub'
import { formatKrw } from '@/common/utils/formatKrw'

const INTRO_ICONS = [
  {
    label: '의료비',
    hexColor: '#0046FF',
    hexBg: '#EEF3FF',
    icon: (
      <svg width={28} height={28} viewBox="0 0 28 28" fill="none">
        <path
          d="M14 6v16M6 14h16"
          stroke="#0046FF"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: '여행',
    hexColor: '#069A53',
    hexBg: '#E9F7F0',
    icon: (
      <svg width={28} height={28} viewBox="0 0 28 28" fill="none">
        <path
          d="M5 18l4-8 5 3 4-7 5 3-4 9H5z"
          stroke="#069A53"
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
        <path d="M5 21h18" stroke="#069A53" strokeWidth={1.8} strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: '비상금',
    hexColor: '#7C3AED',
    hexBg: '#F0EAFF',
    icon: (
      <svg width={28} height={28} viewBox="0 0 28 28" fill="none">
        <path
          d="M14 4L6 8v7c0 4.5 3.5 8.5 8 9.5 4.5-1 8-5 8-9.5V8L14 4z"
          stroke="#7C3AED"
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
        <path
          d="M11 14l2 2 4-4"
          stroke="#7C3AED"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

export default function PurposeAccountIntroPage() {
  const navigate = useNavigate()
  const { data: hub, isLoading } = useGetAssetHub()
  const monthlyIncomeLabel = hub ? formatKrw(hub.monthlyIncome) : isLoading ? '불러오는 중' : '확인 필요'

  return (
    <div className="flex flex-col h-dvh bg-white">
      <AppBar title="" onBack={() => navigate(-1)} />

      <div className="flex-1 flex flex-col px-6 pt-4 overflow-y-auto">
        <h1 className="text-heading font-bold text-ink leading-snug">
          은퇴 후 쓸 돈을
          <br />
          <span className="text-primary">목적별로 나눠</span> 볼까요?
        </h1>
        <p className="text-body text-ink-sub mt-3">
          의료비·비상금·여행 자금처럼 목적을 나누면
          <br />
          필요한 순간에 얼마가 준비됐는지 더 쉽게 볼 수 있어요.
        </p>

        {/* Distribution preview card */}
        <div className="mt-8 bg-surface rounded-card-lg p-5">
          <p className="text-sub text-ink-hint text-center mb-3">예상 월 현금흐름</p>
          <p className="font-inter text-display font-bold text-ink text-center">
            {monthlyIncomeLabel}
          </p>

          {/* Arrow down */}
          <div className="flex justify-center my-4">
            <svg width={20} height={20} viewBox="0 0 20 20" fill="none" className="text-ink-hint">
              <path
                d="M10 4v12M5 11l5 5 5-5"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Purpose icons row */}
          <div className="flex justify-center gap-6">
            {INTRO_ICONS.map(({ label, hexBg, icon }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-14 h-14 rounded-icon flex items-center justify-center"
                  style={{ backgroundColor: hexBg }}
                >
                  {icon}
                </div>
                <span className="text-sub text-ink-sub">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info box */}
        <div className="mt-4 bg-surface-muted rounded-card px-4 py-3">
          <p className="text-sub text-ink-sub">
            실제 통장 구분이나 계좌 개설이 필요하면 상담을 통해 내 상황에 맞게 설계할 수 있어요.
          </p>
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="shrink-0 bg-white px-6 pb-10 pt-3 flex flex-col gap-3">
        <button
          onClick={() => navigate('/purpose-account/select')}
          className="w-full bg-primary text-white rounded-btn text-btn font-bold py-4"
        >
          목적별 통장 알아보기
        </button>
        <button
          onClick={() => navigate(-1)}
          className="w-full text-center text-body text-ink-sub py-2"
        >
          다음에 할게요
        </button>
      </div>
    </div>
  )
}
