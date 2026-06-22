import type { ReactNode } from 'react'

type CenterMessageVariant = 'status' | 'alert'

/**
 * 로딩·에러·빈 상태용 중앙 정렬 메시지.
 * 비동기 상태 변화를 보조기기가 인지하도록 live region을 부여한다.
 * - status(기본): 로딩·빈 데이터 → aria-live="polite"
 * - alert: 오류 → aria-live="assertive"
 */
function CenterMessage({
  children,
  variant = 'status',
}: {
  children: ReactNode
  variant?: CenterMessageVariant
}) {
  return (
    <div
      role={variant}
      aria-live={variant === 'alert' ? 'assertive' : 'polite'}
      className="flex items-center justify-center h-full px-8 text-center text-body text-ink-hint"
    >
      {children}
    </div>
  )
}

export default CenterMessage
