import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'

type AccountCheckResponse = {
  needsAccount: boolean
  reason: 'HAS_DON_WORRY' | 'HAS_SHINHAN_BOTH' | 'NEEDS_ACCOUNT'
}

const useGetAccountCheck = () =>
  useQuery({
    queryKey: ['account-check'],
    queryFn: () =>
      client
        .get<ApiResponse<AccountCheckResponse>>('/api/user/account-open/check')
        .then((res) => res.data.data),
  })

export default useGetAccountCheck
