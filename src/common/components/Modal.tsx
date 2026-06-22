import { type ReactNode, useEffect } from 'react'

type ModalProps = {
  children: ReactNode
}

function Modal({ children }: ModalProps) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center px-[30px] bg-[rgba(18,23,33,0.5)]">
      <div className="w-full max-w-[316px] rounded-[20px] bg-white shadow-float">
        {children}
      </div>
    </div>
  )
}

export default Modal
