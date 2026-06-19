import type { ReactNode } from 'react'
import { BackArrowIc } from '../assets/icons'

type AppBarProps = {
  title: string
  onBack?: () => void
  rightAction?: ReactNode
}

function AppBar({ title, onBack, rightAction }: AppBarProps) {
  return (
    <header className="flex h-[52px] shrink-0 items-center gap-2 px-5 w-full">
      <div className="shrink-0 size-7 flex items-center justify-center">
        {onBack && (
          <button onClick={onBack} aria-label="뒤로 가기">
            <BackArrowIc className="text-ink" width={22} height={22} />
          </button>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-btn font-semibold text-ink">{title}</h1>
      </div>

      <div className="shrink-0 size-7 flex items-center justify-center">
        {rightAction}
      </div>
    </header>
  )
}

export default AppBar
