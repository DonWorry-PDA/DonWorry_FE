import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function SplashPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login', { replace: true })
    }, 2000)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="flex min-h-screen flex-col bg-white px-6 pt-16">
      <div>
        <h1 className="text-heading font-bold text-ink">
          은퇴 후의 삶,
          <br />
          <span className="text-primary">신한</span>이 함께 설계합니다
        </h1>
        <p className="mt-3 text-body text-ink-sub">
          안정적인 노후를 위한 한 걸음, 지금 시작하세요.
        </p>
      </div>
      <img
        src="/images/splash-illustration.png"
        alt=""
        className="mt-10 w-full object-contain"
      />
    </div>
  )
}

export default SplashPage
