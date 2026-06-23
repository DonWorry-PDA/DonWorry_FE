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

export default SimActionItems
