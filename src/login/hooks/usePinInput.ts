import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import usePostLogin from './usePostLogin'
import { UsePinInputReturn } from '../types/login'

const MAX_ATTEMPTS = 5

export function usePinInput(userId: number): UsePinInputReturn {
  const navigate = useNavigate()
  const { mutate: postLogin, isPending } = usePostLogin()

  const [pin, setPin] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [isError, setIsError] = useState(false)
  const [isServerError, setIsServerError] = useState(false)
  const [isLocked, setIsLocked] = useState(false)

  function appendDigit(digit: string) {
    if (isLocked || isPending) return

    if (isError || isServerError) {
      setIsError(false)
      setIsServerError(false)
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
        onError: (error) => {
          // 401(인증 실패)만 시도 횟수에 반영하고, 네트워크/서버 오류는 별도 처리
          if (isAxiosError(error) && error.response?.status === 401) {
            setAttempts((prev) => {
              const next = prev + 1
              if (next >= MAX_ATTEMPTS) setIsLocked(true)
              return next
            })
            setIsError(true)
          } else {
            setIsServerError(true)
          }
        },
      },
    )
  }

  function deleteDigit() {
    if (isError || isServerError || isLocked) return
    setPin((p) => p.slice(0, -1))
  }

  function reset() {
    setPin('')
  }

  function clearError() {
    setPin('')
    setIsError(false)
    setIsServerError(false)
  }

  return {
    pin,
    attempts,
    isError,
    isServerError,
    isLocked,
    appendDigit,
    deleteDigit,
    reset,
    clearError,
  }
}
