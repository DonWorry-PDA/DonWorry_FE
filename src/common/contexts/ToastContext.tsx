import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type ToastContextType = {
  showToast: (message: string) => void
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)

  const showToast = useCallback((msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(null), 2200)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message &&
        createPortal(
          <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-6">
            <div className="rounded-card bg-ink px-4 py-3 text-center text-sub font-medium text-white shadow-float">
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
