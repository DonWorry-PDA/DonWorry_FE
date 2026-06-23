import { RATE_OPTIONS } from '../types/pensionDefer'

type RateChipsProps = {
  selected: number
  onChange: (rate: number) => void
}

function RateChips({ selected, onChange }: RateChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto px-5 pb-1 scrollbar-hide">
      {RATE_OPTIONS.map((rate) => (
        <button
          key={rate}
          type="button"
          aria-pressed={selected === rate}
          aria-label={rate === 0 ? '즉시 수령' : `${rate}% 연기`}
          onClick={() => onChange(rate)}
          className={[
            'shrink-0 rounded-card px-4 py-2 text-body font-semibold transition-colors',
            selected === rate
              ? 'bg-primary text-white'
              : 'bg-surface-muted text-ink-sub',
          ].join(' ')}
        >
          {rate === 0 ? '즉시' : `${rate}%`}
        </button>
      ))}
    </div>
  )
}

export default RateChips
