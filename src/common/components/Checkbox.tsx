type CheckboxProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  subLabel?: string
  'aria-label'?: string
}

function Checkbox({ checked, onChange, label, subLabel, 'aria-label': ariaLabel }: CheckboxProps) {
  const accessibleLabel = ariaLabel ?? label ?? '체크박스'
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={accessibleLabel}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 text-left"
    >
      <span
        className={`shrink-0 size-6 rounded-[6px] flex items-center justify-center transition-colors ${
          checked ? 'bg-primary' : 'bg-white border-2 border-line'
        }`}
      >
        {checked && (
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
            <path
              d="M1.5 5L5 8.5L11.5 1.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {(label || subLabel) && (
        <span className="flex flex-col">
          {label && <span className="text-body font-medium text-ink">{label}</span>}
          {subLabel && <span className="text-sub text-ink-hint">{subLabel}</span>}
        </span>
      )}
    </button>
  )
}

export default Checkbox
