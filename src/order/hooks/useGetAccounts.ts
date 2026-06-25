import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import { MydataAccount } from '../types/account'

const useGetAccounts = () =>
  useQuery({
    queryKey: ['mydata-accounts'],
    queryFn: () =>
      client
        .get<ApiResponse<MydataAccount[]>>('/api/user/mydata/accounts')
        .then((res) => res.data.data),
  })

export default useGetAccounts
