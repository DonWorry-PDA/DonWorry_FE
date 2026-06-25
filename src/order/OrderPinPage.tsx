import { useNavigate, useLocation } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import PinDots from '../login/components/PinDots'
import PinKeypad from '../login/components/PinKeypad'
import useOrderPinInput from './hooks/useOrderPinInput'

function OrderPinPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const planId = state?.planId as string | undefined

  const { pin, isError, isServerError, isPending, appendDigit, deleteDigit, reset } =
    useOrderPinInput(planId)

  if (!planId) {
    return (
      <div className="flex h-dvh flex-col bg-white">
        <AppBar title="" onBack={() => navigate(-1)} />
        <div className="flex-1 flex items-center justify-center px-6">
          <p className="text-body text-ink-hint text-center">
            주문 정보를 찾을 수 없어요.<br />처음부터 다시 시도해주세요.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col bg-white">
      <AppBar title="" onBack={() => navigate(-1)} />

      <div className="mt-6 px-6 text-center">
        <h1 className="text-heading font-bold text-ink">주문을 시작할게요</h1>
        <p className="mt-2 text-body text-ink-sub">간편 비밀번호 6자리를 입력해주세요.</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <PinDots count={isPending ? 6 : pin.length} />
        <div role="status" aria-live="polite" className="mt-3 h-5 text-center">
          {isError && <p className="text-sub text-danger">비밀번호가 일치하지 않아요</p>}
          {isServerError && <p className="text-sub text-danger">오류가 발생했어요. 다시 시도해주세요</p>}
          {isPending && <p className="text-sub text-ink-hint">확인 중...</p>}
        </div>
      </div>

      <PinKeypad onDigit={appendDigit} onDelete={deleteDigit} onReset={reset} />
    </div>
  )
}

export default OrderPinPage
