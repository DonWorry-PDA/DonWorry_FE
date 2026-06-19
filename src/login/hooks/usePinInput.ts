import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CORRECT_PIN = '123456'
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

export function usePinInput(): UsePinInputReturn {
  const navigate = useNavigate()
  const [pin, setPin] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [isError, setIsError] = useState(false)
  const [isLocked, setIsLocked] = useState(false)

  function appendDigit(digit: string) {
    if (isError || isLocked || pin.length >= 6) return
    const next = pin + digit
    if (next.length < 6) {
      setPin(next)
      return
    }
    if (next === CORRECT_PIN) {
      navigate('/onboarding')
      return
    }
    const nextAttempts = attempts + 1
    setPin(next)
    setAttempts(nextAttempts)
    setIsError(true)
    if (nextAttempts >= MAX_ATTEMPTS) setIsLocked(true)
  }

  function deleteDigit() {
    if (isError || isLocked) return
    setPin(p => p.slice(0, -1))
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
