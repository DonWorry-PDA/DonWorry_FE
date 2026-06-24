import { useNavigate } from 'react-router-dom'

interface ActionItem {
  title: string
  subtitle: string
  onClick: () => void
}

function useSimActionItems(): ActionItem[] {
  const navigate = useNavigate()

  return [
    {
      title: '균형 월급형 설계안 보기',
      subtitle: '충당률 84%까지 올라가요',
      onClick: () => navigate('/paycheck-plan/plans'),
    },
    {
      title: '국민연금 미루기 비교',
      subtitle: '평생 월 연금이 늘어나요',
      onClick: () => navigate('/pension/defer'),
    },
    {
      title: '고정지출 점검하기',
      subtitle: '보험료 등 월 142만원',
      onClick: () => {},
    },
  ]
}

export default useSimActionItems
