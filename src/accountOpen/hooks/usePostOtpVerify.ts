import { useMutation } from '@tanstack/react-query'
import client from '@/common/api/client'
import type { ApiResponse } from '@/common/types/api'

type OtpVerifyRequest = {
  phone: string
  otp: string
}

const usePostOtpVerify = () =>
  useMutation({
    mutationFn: (body: OtpVerifyRequest) =>
      client
        .post<ApiResponse<void>>('/api/user/account-open/otp/verify', body)
        .then((res) => res.data),
  })

export default usePostOtpVerify
