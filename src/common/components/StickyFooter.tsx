import type { ReactNode } from 'react'

type StickyFooterProps = {
  children: ReactNode
}

function StickyFooter({ children }: StickyFooterProps) {
  return (
    <footer className="relative shrink-0 bg-white px-6 pb-6 pt-3">
      <div className="pointer-events-none absolute -top-8 inset-x-0 h-8 bg-gradient-to-b from-white/0 to-white" />
      {children}
    </footer>
  )
}

export default StickyFooter
