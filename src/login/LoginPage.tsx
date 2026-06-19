import PinDots from './components/PinDots'
import PinErrorCard from './components/PinErrorCard'
import PinKeypad from './components/PinKeypad'
import { usePinInput } from './hooks/usePinInput'

function LoginPage() {
  const { pin, attempts, isError, isLocked, appendDigit, deleteDigit, reset, clearError } =
    usePinInput()

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <p className="px-6 pt-12 text-sub text-ink-sub">신한 은퇴솔루션</p>

      {/* 인사말 */}
      <div className="mt-6 px-6">
        <h1 className="text-heading font-bold text-ink">
          {isError ? (
            <>
              비밀번호를 다시
              <br />
              확인해주세요
            </>
          ) : (
            <>
              김영수님,
              <br />
              다시 만나서 반가워요
            </>
          )}
        </h1>
        {!isError && (
          <p className="mt-2 text-body text-ink-sub">
            간편 비밀번호 6자리를 입력해주세요.
          </p>
        )}
      </div>

      {/* PIN 점 */}
      <div className="mt-8 flex justify-center">
        <PinDots count={pin.length} />
      </div>

      {/* 에러 상태 */}
      {isError ? (
        <div className="mt-6 flex flex-col gap-3 px-6">
          <PinErrorCard attempts={attempts} isLocked={isLocked} />
          {!isLocked && (
            <button
              onClick={clearError}
              className="w-full rounded-btn bg-primary py-4 text-btn font-bold text-white"
            >
              다시 입력
            </button>
          )}
          <button className="w-full rounded-btn border border-line py-4 text-btn font-medium text-ink">
            비밀번호 재설정
          </button>
        </div>
      ) : (
        <>
          {/* 비밀번호 분실 링크 */}
          <button className="mt-5 text-center text-body text-primary">
            비밀번호를 몰라요
          </button>

          {/* 키패드 */}
          <div className="mt-auto">
            <PinKeypad
              onDigit={appendDigit}
              onDelete={deleteDigit}
              onReset={reset}
            />
          </div>
        </>
      )}

      {/* 하단 링크 */}
      <div className="flex items-center justify-center gap-3 py-6">
        <button className="text-sub text-ink-sub">다른 방법으로 로그인</button>
        {!isError && (
          <>
            <span className="text-sub text-sep">|</span>
            <button className="text-sub text-ink-sub">테스트 계정으로 들어가기</button>
          </>
        )}
      </div>
    </div>
  )
}

export default LoginPage
