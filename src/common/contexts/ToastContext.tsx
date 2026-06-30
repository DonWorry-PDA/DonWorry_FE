import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type ToastContextType = {
  showToast: (message: string) => void
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((msg: string) => {
    if (timerRef.current !== null) clearTimeout(timerRef.current)
    setMessage(msg)
    timerRef.current = setTimeout(() => setMessage(null), 2200)
  }, [])

  useEffect(() => () => {
    if (timerRef.current !== null) clearTimeout(timerRef.current)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message &&
        createPortal(
          <div className="pointer-events-none fixed inset-x-0 top-10 z-50 flex justify-center px-6">
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="rounded-card bg-ink px-4 py-3 text-center text-sub font-medium text-white shadow-float"
            >
              {message}
            </div>
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
