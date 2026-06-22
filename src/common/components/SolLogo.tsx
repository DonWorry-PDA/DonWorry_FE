import solMark from '@/assets/sol-mark.png'

interface SolMarkProps {
  size?: number
}

export function SolMark({ size = 48 }: SolMarkProps) {
  return (
    <img
      src={solMark}
      alt="연금SOL사"
      width={size}
      height={size}
      className="object-contain"
    />
  )
}

export function SolWordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-brand font-bold text-ink ${className}`.trim()}>
      연금<span className="text-primary">SOL</span>사
    </span>
  )
}

export function SolLogo({ size = 36 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <SolMark size={size} />
      <SolWordmark />
    </div>
  )
}
