import { useMutation } from '@tanstack/react-query'
import client from '@/common/api/client'
import type { ApiResponse } from '@/common/types/api'

const usePostShinhanCertVerify = () =>
  useMutation({
    mutationFn: () =>
      client
        .post<ApiResponse<void>>('/api/user/account-open/shinhan-cert/verify')
        .then((res) => res.data),
  })

export default usePostShinhanCertVerify
