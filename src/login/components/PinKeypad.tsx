import { useState } from 'react'

interface Props {
  onDigit: (digit: string) => void
  onDelete: () => void
  onReset: () => void
}

function shuffleDigits(): string[] {
  const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function PinKeypad({ onDigit, onDelete, onReset }: Props) {
  const [digits] = useState<string[]>(shuffleDigits)

  // 앞 9개는 3×3 그리드, 마지막 1개는 하단 중앙
  const gridDigits = digits.slice(0, 9)
  const lastDigit = digits[9]

  return (
    <div className="grid grid-cols-3">
      {gridDigits.map((d, i) => (
        <button
          key={i}
          onClick={() => onDigit(d)}
          className="flex items-center justify-center py-6 text-display font-medium text-ink active:bg-surface-muted"
        >
          {d}
        </button>
      ))}

      {/* 하단 행: 재배열 / 마지막 숫자 / 삭제 */}
      <button
        onClick={onReset}
        className="flex items-center justify-center py-6 text-body text-ink-sub active:bg-surface-muted"
      >
        CLEAR
      </button>
      <button
        onClick={() => onDigit(lastDigit)}
        className="flex items-center justify-center py-6 text-display font-medium text-ink active:bg-surface-muted"
      >
        {lastDigit}
      </button>
      <button
        onClick={onDelete}
        className="flex items-center justify-center py-6 active:bg-surface-muted"
      >
        <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
          <path
            d="M10.5 1H26a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H10.5a1 1 0 0 1-.72-.31L1.5 10l8.28-8.69A1 1 0 0 1 10.5 1Z"
            stroke="#5B6573"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M17 7l-6 6M11 7l6 6"
            stroke="#5B6573"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}

export default PinKeypad
