import { useNavigate } from 'react-router-dom'

interface ActionItem {
  title: string
  subtitle: string
  onClick: () => void
}

interface SimActionItemsProps {
  items: ActionItem[]
}

function SimActionItems({ items }: SimActionItemsProps) {
  return (
    <div className="px-5">
      <p className="mb-3 text-sub font-semibold text-ink-hint">다음으로 해볼 수 있는 것</p>
      <div className="flex flex-col">
        {items.map((item, i) => (
          <button
            key={item.title}
            type="button"
            onClick={item.onClick}
            className={`flex w-full items-center gap-3 py-4 text-left ${
              i < items.length - 1 ? 'border-b border-divider' : ''
            }`}
          >
            <div className="min-w-0 flex-1">
              <p className="text-md font-bold text-ink">{item.title}</p>
              <p className="mt-0.5 text-sub text-ink-sub">{item.subtitle}</p>
            </div>
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true" className="shrink-0">
              <path d="M1 1l5 5-5 5" stroke="#C4CAD4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}

export function useSimActionItems() {
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

export default SimActionItems
