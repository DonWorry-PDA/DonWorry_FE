import type { ReactNode } from 'react'

type StickyFooterProps = {
  children: ReactNode
}

function StickyFooter({ children }: StickyFooterProps) {
  return (
    <footer className="relative shrink-0 bg-white px-5 pb-6 pt-3">
      {/* 스크롤 영역 하단을 부드럽게 가리는 그라데이션 */}
      <div className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-gradient-to-b from-white/0 to-white" />
      {children}
    </footer>
  )
}

export default StickyFooter
