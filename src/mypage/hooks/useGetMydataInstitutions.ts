import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import type { MydataInstitution } from '../types/mypage'

const useGetMydataInstitutions = () =>
  useQuery({
    queryKey: ['mydataInstitutions'],
    queryFn: () =>
      client
        .get<ApiResponse<MydataInstitution[]>>('/api/user/mydata/institutions')
        .then((res) => res.data.data),
  })

export default useGetMydataInstitutions
