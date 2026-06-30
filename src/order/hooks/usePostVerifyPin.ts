import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'

const usePostVerifyPin = () =>
  useMutation({
    mutationFn: (pin: string) =>
      client
        .post<ApiResponse<null>>('/api/user/auth/verify-pin', { pin })
        .then((res) => res.data),
    onError: (error) => {
      if (!isAxiosError(error)) throw error
    },
  })

export default usePostVerifyPin
