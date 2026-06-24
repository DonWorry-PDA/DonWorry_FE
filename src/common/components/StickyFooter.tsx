import type { ReactNode } from 'react'

type StickyFooterProps = {
  children: ReactNode
}

function StickyFooter({ children }: StickyFooterProps) {
  return (
    <footer className="shrink-0 bg-white px-5 pb-6 pt-3">
      {children}
    </footer>
  )
}

export default StickyFooter
