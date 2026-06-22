import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import usePostLogin from './usePostLogin'

const MAX_ATTEMPTS = 5

interface UsePinInputReturn {
  pin: string
  attempts: number
  isError: boolean
  isLocked: boolean
  appendDigit: (digit: string) => void
  deleteDigit: () => void
  reset: () => void
  clearError: () => void
}

export function usePinInput(userId: number): UsePinInputReturn {
  const navigate = useNavigate()
  const { mutate: postLogin } = usePostLogin()

  const [pin, setPin] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [isError, setIsError] = useState(false)
  const [isLocked, setIsLocked] = useState(false)

  function appendDigit(digit: string) {
    if (isLocked) return

    if (isError) {
      setIsError(false)
      setPin(digit)
      return
    }

    if (pin.length >= 6) return
    const next = pin + digit
    if (next.length < 6) {
      setPin(next)
      return
    }

    setPin('')
    postLogin(
      { userId, pin: next },
      {
        onSuccess: ({ onboardingCompleted }) => {
          navigate(onboardingCompleted ? '/' : '/onboarding')
        },
        onError: () => {
          const nextAttempts = attempts + 1
          setAttempts(nextAttempts)
          setIsError(true)
          if (nextAttempts >= MAX_ATTEMPTS) setIsLocked(true)
        },
      },
    )
  }

  function deleteDigit() {
    if (isError || isLocked) return
    setPin((p) => p.slice(0, -1))
  }

  function reset() {
    setPin('')
  }

  function clearError() {
    setPin('')
    setIsError(false)
  }

  return { pin, attempts, isError, isLocked, appendDigit, deleteDigit, reset, clearError }
}
