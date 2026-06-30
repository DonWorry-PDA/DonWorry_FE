import CoachMark from '@/common/components/CoachMark'
import { useOnboardingCompleted } from '@/common/hooks/useOnboardingStorage'
import type { CoachMarkStep } from '@/common/components/CoachMark'

// spotlightPadding: 0 → 요소 크기 그대로만 밝힘
// spotlightRadius: 요소의 실제 border-radius에 맞춤
const HOME_STEPS: CoachMarkStep[] = [
  {
    targetId: 'home-summary',
    title: '내 노후 자산 한눈에 확인',
    description: '내 노후 자산과 자산 구성을 한눈에 확인할 수 있어요.',
    spotlightPadding: 0,
    spotlightRadius: 20, // rounded-card-xl
  },
  {
    targetId: 'home-stability',
    title: '생활 안정도',
    description: '목표 생활비 대비 현재 현금흐름이 얼마나 채워졌는지 확인할 수 있어요.',
    spotlightPadding: 0,
    spotlightRadius: 20, // rounded-card-xl
  },
  {
    targetId: 'salary-create-cta',
    title: '월급 만들기로 시작해요',
    description: '월급 만들기를 시작하면 내 자산으로 매달 받을 수 있는 금액을 계산해드려요.',
    spotlightPadding: 0,
    spotlightRadius: 12, // rounded-btn
  },
  {
    targetId: 'navbar-asset',
    title: '자산분석',
    description: '자산분석 탭에서 예금, 연금, 투자자산을 연결하고 관리할 수 있어요.',
    spotlightShape: 'none',
  },
  {
    targetId: 'navbar-calendar',
    title: '캘린더',
    description: '주요 금융 일정과 리포트 일정을 캘린더에서 확인할 수 있어요.',
    spotlightShape: 'none',
  },
  {
    targetId: 'navbar-mypage',
    title: '마이페이지',
    description: '내 정보와 서비스 설정을 관리할 수 있어요.',
    spotlightShape: 'none',
  },
  {
    targetId: 'notification-icon',
    title: '알림',
    description: '배당금 입금, 월간 리포트 도착 같은 주요 알림을 확인할 수 있어요.',
    spotlightPadding: 0,
    spotlightRadius: 22, // size-11(44px) 원형 버튼
  },
]

function HomeCoachMark() {
  const { completed, markCompleted } = useOnboardingCompleted('homeCoachMark')

  if (completed) return null

  const handleComplete = () => {
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' })
    markCompleted()
  }

  return (
    <CoachMark
      steps={HOME_STEPS}
      onComplete={handleComplete}
      onSkip={markCompleted}
    />
  )
}

export default HomeCoachMark
