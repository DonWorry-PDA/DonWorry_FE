interface Props {
  attempts: number
  isLocked: boolean
}

const MAX_ATTEMPTS = 5

function PinErrorCard({ attempts, isLocked }: Props) {
  return (
    <div className="rounded-btn bg-danger-bg px-4 py-3">
      {isLocked ? (
        <p className="text-body font-bold text-danger-text">
          비밀번호 {MAX_ATTEMPTS}회 오류로 잠겼습니다.
        </p>
      ) : (
        <>
          <p className="text-body font-bold text-danger-text">
            비밀번호가 일치하지 않아요 ({attempts}/{MAX_ATTEMPTS})
          </p>
          <p className="mt-1 text-sub text-danger-text">
            5회 틀리면 보안을 위해 잠기게요.
          </p>
        </>
      )}
    </div>
  )
}

export default PinErrorCard
