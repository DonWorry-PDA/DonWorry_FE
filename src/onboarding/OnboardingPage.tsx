import { useNavigate } from 'react-router-dom'
import OnboardingSlide from './components/OnboardingSlide'

const slides = [
  {
    title: '은퇴 후도 걱정 없이',
    description: '내 자산을 한눈에 파악하고\n스마트하게 관리하세요',
  },
  {
    title: '맞춤 목표 설정',
    description: '나만의 은퇴 목표를 세우고\n단계별로 달성해 나가세요',
  },
]

function OnboardingPage() {
  const navigate = useNavigate()

  return (
    <div className="flex w-full flex-col items-center justify-between pb-10 pt-20">
      <OnboardingSlide {...slides[0]} />
      <button
        onClick={() => navigate('/login')}
        className="mt-16 w-[calc(100%-48px)] rounded-btn bg-primary py-4 text-btn font-bold text-white"
      >
        시작하기
      </button>
    </div>
  )
}

export default OnboardingPage
