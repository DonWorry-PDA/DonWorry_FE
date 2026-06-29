import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import usePostLogin from '../../login/hooks/usePostLogin'
import { getUserIdFromToken } from '@/common/api/token'
import { setAccessToken } from '@/common/api/token'

const useOrderPinInput = (planId: string | undefined) => {
  const navigate = useNavigate()
  const { mutate: postLogin, isPending } = usePostLogin()

  const [pin, setPin] = useState('')
  const [isError, setIsError] = useState(false)
  const [isServerError, setIsServerError] = useState(false)

  function appendDigit(digit: string) {
    if (isPending) return

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

    const userId = getUserIdFromToken()
    if (!userId) {
      setIsServerError(true)
      setPin('')
      return
    }

    setPin(next)
    postLogin(
      { userId, pin: next },
      {
        onSuccess: ({ token }) => {
          setAccessToken(token)
          navigate('/order/review', { state: { planId } })
        },
        onError: (error) => {
          setPin('')
          if (isAxiosError(error) && error.response?.status === 401) {
            setIsError(true)
          } else {
            setIsServerError(true)
          }
        },
      },
    )
  }

  function deleteDigit() {
    if (isError || isServerError) return
    setPin((p) => p.slice(0, -1))
  }

  function reset() {
    setPin('')
    setIsError(false)
    setIsServerError(false)
  }

  return { pin, isError, isServerError, isPending, appendDigit, deleteDigit, reset }
}

export default useOrderPinInput
