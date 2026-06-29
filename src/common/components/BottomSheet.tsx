import { createPortal } from 'react-dom'
import { useEffect, useRef, useState } from 'react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const startYRef = useRef(0)
  const isDragging = useRef(false)
  const sheetRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement
    } else {
      previousFocusRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (visible) sheetRef.current?.focus()
  }, [visible])

  useEffect(() => {
    if (open) {
      setMounted(true)
      // Double rAF: first ensures DOM is mounted, second starts CSS transition
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true)),
      )
      return () => cancelAnimationFrame(id)
    } else {
      setVisible(false)
      const t = setTimeout(() => setMounted(false), 300)
      return () => clearTimeout(t)
    }
  }, [open])

  // Body scroll lock while open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Non-passive touchmove to block pull-to-refresh and page scroll while dragging.
  // React registers onTouchMove as passive, so preventDefault() there is ignored by the browser.
  useEffect(() => {
    const el = sheetRef.current
    if (!el) return
    const handler = (e: TouchEvent) => {
      if (isDragging.current) e.preventDefault()
    }
    el.addEventListener('touchmove', handler, { passive: false })
    return () => el.removeEventListener('touchmove', handler)
  }, [mounted])

  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY
    isDragging.current = true
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return
    const delta = Math.max(0, e.touches[0].clientY - startYRef.current)
    setDragOffset(delta)
  }

  const handleTouchEnd = () => {
    isDragging.current = false
    const shouldClose = dragOffset > 80
    setDragOffset(0)
    if (shouldClose) onClose()
  }

  if (!mounted) return null

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center transition-colors duration-300 ${
        visible ? 'bg-black/45' : 'pointer-events-none bg-transparent'
      }`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={`w-full max-w-[480px] rounded-t-[22px] bg-white shadow-float transition-transform duration-300 outline-none ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={
          dragOffset > 0
            ? { transform: `translateY(${dragOffset}px)`, transition: 'none' }
            : undefined
        }
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 드래그 핸들 — 여기서 시작한 터치만 시트 닫기 드래그로 인식 */}
        <div
          className="flex justify-center pb-1 pt-3"
          onTouchStart={handleTouchStart}
        >
          <div className="h-1 w-10 rounded-full bg-[#e2e6eb]" />
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}

export default BottomSheet
