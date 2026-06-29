import { useMutation } from '@tanstack/react-query'
import client from '@/common/api/client'
import type { ApiResponse } from '@/common/types/api'
import type { AccountOpenRequest, AccountOpenResponse } from '../types/accountOpen'

const usePostAccountOpen = () =>
  useMutation({
    mutationFn: async (body: AccountOpenRequest) => {
      await client.post<ApiResponse<void>>('/api/user/account-open/terms', {
        agreedTermIds: body.agreedTermIds,
      })

      return client
        .post<ApiResponse<AccountOpenResponse>>('/api/user/account-open', body)
        .then((res) => res.data.data)
    },
  })

export default usePostAccountOpen
