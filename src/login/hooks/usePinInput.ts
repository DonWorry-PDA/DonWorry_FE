import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import usePostLogin from './usePostLogin'
import { UsePinInputReturn } from '../types/login'

export function usePinInput(userId: number): UsePinInputReturn {
  const navigate = useNavigate()
  const { mutate: postLogin, isPending } = usePostLogin()

  const [pin, setPin] = useState('')
  const [isError, setIsError] = useState(false)
  const [isServerError, setIsServerError] = useState(false)
  const [isShaking, setIsShaking] = useState(false)

  function appendDigit(digit: string) {
    if (isPending || isShaking) return

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

    setPin(next)
    postLogin(
      { userId, pin: next },
      {
        onSuccess: ({ onboardingCompleted }) => {
          navigate(onboardingCompleted ? '/home' : '/onboarding')
        },
        onError: (error) => {
          if (isAxiosError(error) && error.response?.status === 401) {
            setIsError(true)
            setIsShaking(true)
            setTimeout(() => {
              setPin('')
              setIsShaking(false)
            }, 600)
          } else {
            setPin('')
            setIsServerError(true)
          }
        },
      }
    )
  }

  function deleteDigit() {
    if (isPending || isError || isServerError) return
    setPin((p) => p.slice(0, -1))
  }

  function reset() {
    if (isPending) return
    setPin('')
  }

  function clearError() {
    setPin('')
    setIsError(false)
    setIsServerError(false)
  }

  return {
    pin,
    isPending,
    isError,
    isServerError,
    isShaking,
    appendDigit,
    deleteDigit,
    reset,
    clearError,
  }
}
