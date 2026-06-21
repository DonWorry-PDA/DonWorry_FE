type SelectChipProps = {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}

function SelectChip({ selected, onClick, children }: SelectChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-badge px-3 py-1.5 text-body font-medium transition-colors ${
        selected
          ? 'bg-primary-tint text-primary border border-primary'
          : 'bg-surface text-ink-sub border border-line'
      }`}
    >
      {children}
    </button>
  )
}

export default SelectChip
