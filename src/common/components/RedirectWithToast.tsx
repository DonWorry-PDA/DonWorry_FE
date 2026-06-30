import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'

type Props = {
  to: string
  message: string
}

function RedirectWithToast({ to, message }: Props) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true
    showToast(message)
    navigate(to, { replace: true })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

export default RedirectWithToast
