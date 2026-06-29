import { useMutation } from '@tanstack/react-query'
import client from '@/common/api/client'
import type { ApiResponse } from '@/common/types/api'

const usePostOtpSend = () =>
  useMutation({
    mutationFn: (phone: string) =>
      client
        .post<ApiResponse<void>>('/api/user/account-open/otp/send', { phone })
        .then((res) => res.data),
  })

export default usePostOtpSend
