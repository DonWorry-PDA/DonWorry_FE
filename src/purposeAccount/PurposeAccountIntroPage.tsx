import { useNavigate } from 'react-router-dom'
import AppBar from '@/common/components/AppBar'

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

  return (
    <div className="flex flex-col h-dvh bg-white">
      <AppBar title="" onBack={() => navigate(-1)} />

      <div className="flex-1 flex flex-col px-6 pt-4 overflow-y-auto">
        <h1 className="text-heading font-bold text-ink leading-snug">
          이제 들어오는 돈을
          <br />
          <span className="text-primary">목적별로 나눠</span> 모아요
        </h1>
        <p className="text-body text-ink-sub mt-3">
          설계안이 매달 만들어 주는 돈을, 의료비·여행처럼
          <br />
          목적별 통장에 자동으로 쌓을 수 있어요.
        </p>

        {/* Distribution preview card */}
        <div className="mt-8 bg-surface rounded-card-lg p-5">
          <p className="text-sub text-ink-hint text-center mb-3">매달 들어오는 분배금</p>
          <p className="font-inter text-display font-bold text-ink text-center">55만원</p>

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
            통장은 새로 개설하지 않아도 돼요. 지금 계좌 안에 목적별 보관함으로 만들어져요.
          </p>
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="shrink-0 bg-white px-6 pb-10 pt-3 flex flex-col gap-3">
        <button
          onClick={() => navigate('/purpose-account/select')}
          className="w-full bg-primary text-white rounded-btn text-btn font-bold py-4"
        >
          목적별 통장 만들기
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
