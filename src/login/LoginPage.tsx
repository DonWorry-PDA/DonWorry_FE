import PinDots from './components/PinDots'
import PinKeypad from './components/PinKeypad'
import { usePinInput } from './hooks/usePinInput'

function LoginPage() {
  // TODO: userId는 앱 전역 인증 컨텍스트에서 가져오도록 교체
  const { pin, attempts, isError, isLocked, lockSecondsLeft, appendDigit, deleteDigit, reset } = usePinInput(1)

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 헤더 + 인사말 */}
      <div>
        <p className="px-6 pt-12 text-center text-sub text-ink-sub">신한 은퇴솔루션</p>
        <div className="mt-10 px-6 text-center">
          <h1 className="text-heading font-bold text-ink">
            다시 만나서 반가워요
          </h1>
          <p className="mt-2 text-body text-ink-sub">간편 비밀번호 6자리를 입력해주세요.</p>
        </div>
      </div>

      {/* PIN 점 + 에러 메시지 — 남은 공간에서 세로 중앙 */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <PinDots count={pin.length} />
        <div className="mt-3 h-5 text-center">
          {isLocked ? (
            <p className="text-sub text-danger">비밀번호 5회 오류로 잠겼습니다. ({lockSecondsLeft}초 후 해제)</p>
          ) : isError ? (
            <p className="text-sub text-danger">비밀번호가 일치하지 않아요 ({attempts}/5)</p>
          ) : null}
        </div>
      </div>

      {/* 키패드 */}
      <PinKeypad onDigit={appendDigit} onDelete={deleteDigit} onReset={reset} />
    </div>
  )
}

export default LoginPage
