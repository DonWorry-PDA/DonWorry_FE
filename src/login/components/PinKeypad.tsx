interface Props {
  onDigit: (digit: string) => void
  onDelete: () => void
  onReset: () => void
}

const ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['재설정', '0', '←'],
]

function PinKeypad({ onDigit, onDelete, onReset }: Props) {
  function handleKey(key: string) {
    if (key === '←') {
      onDelete()
    } else if (key === '재설정') {
      onReset()
    } else {
      onDigit(key)
    }
  }

  return (
    <div className="grid grid-cols-3 border-t border-divider">
      {ROWS.flat().map((key) => (
        <button
          key={key}
          onClick={() => handleKey(key)}
          className={`flex items-center justify-center py-5 active:bg-surface-muted ${
            key === '재설정'
              ? 'text-sub text-ink-sub'
              : 'text-card font-medium text-ink'
          }`}
        >
          {key}
        </button>
      ))}
    </div>
  )
}

export default PinKeypad
