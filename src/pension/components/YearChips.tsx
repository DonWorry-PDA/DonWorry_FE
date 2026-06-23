import { YEAR_OPTIONS } from '../types/pensionDefer'

type YearChipsProps = {
  selected: number
  onChange: (years: number) => void
  disabled: boolean
}

function YearChips({ selected, onChange, disabled }: YearChipsProps) {
  return (
    <div className={`flex gap-2 px-5 pb-1 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      {YEAR_OPTIONS.map((year) => (
        <button
          key={year}
          type="button"
          aria-pressed={selected === year}
          aria-label={`${year}년 연기`}
          onClick={() => onChange(year)}
          disabled={disabled}
          className={[
            'shrink-0 rounded-card px-4 py-2 text-body font-semibold transition-colors',
            selected === year
              ? 'bg-primary text-white'
              : 'bg-surface-muted text-ink-sub',
          ].join(' ')}
        >
          {year}년
        </button>
      ))}
    </div>
  )
}

export default YearChips
