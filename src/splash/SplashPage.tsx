import { useNavigate } from 'react-router-dom'
import SplashScreen from '@/common/components/SplashScreen'

function SplashPage() {
  const navigate = useNavigate()

  return (
    <SplashScreen
      variant="spin"
      onFinish={() => navigate('/login', { replace: true })}
    />
  )
}

export default SplashPage
