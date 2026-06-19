interface Props {
  title: string
  description: string
  selected: boolean
  onClick: () => void
}

function SelectionCard({ title, description, selected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-card border-2 bg-white p-4 text-left transition-colors ${
        selected
          ? 'border-primary bg-primary-tint'
          : 'border-line bg-white'
      }`}
    >
      {/* 리스트 아이콘 */}
      <span className="flex size-8 shrink-0 items-center justify-center text-ink-sub">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="5" width="14" height="2" rx="1" fill="currentColor" />
          <rect x="3" y="9" width="14" height="2" rx="1" fill="currentColor" />
          <rect x="3" y="13" width="10" height="2" rx="1" fill="currentColor" />
        </svg>
      </span>
      <div>
        <p className="text-md font-bold text-ink">{title}</p>
        <p className="mt-0.5 text-sub text-ink-sub">{description}</p>
      </div>
    </button>
  )
}

export default SelectionCard
