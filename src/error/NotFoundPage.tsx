import { useNavigate } from 'react-router-dom'
import Button from '@/common/components/Button'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex h-dvh flex-col items-center justify-center bg-white px-6">
      <div className="flex flex-col items-center gap-6 w-full max-w-sm">
        <div className="flex flex-col items-center gap-3">
          <span className="font-inter text-[64px] font-bold text-primary leading-none">404</span>
          <p className="text-heading font-bold text-ink text-center">페이지를 찾을 수 없어요</p>
          <p className="text-body text-ink-hint text-center leading-relaxed">
            주소가 잘못되었거나 삭제된 페이지예요.
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Button onClick={() => navigate('/home', { replace: true })}>
            홈으로 이동
          </Button>
          <Button variant="outline" onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/home', { replace: true })}>
            이전 페이지로
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
