import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import type { ConnectedInstitutionsResponse } from '../types/mypage'

// 연결된 기관 목록 + 카운트의 단일 출처(BE #211). 진실 소스가 AssetConnection이라
// 카탈로그에 없는 연금·보험·카드까지 포함되고, 목록 길이 === 카운트가 보장된다.
const useGetConnectedInstitutions = () =>
  useQuery({
    queryKey: ['connectedInstitutions'],
    queryFn: () =>
      client
        .get<ApiResponse<ConnectedInstitutionsResponse>>(
          '/api/user/mydata/institutions/connected',
        )
        .then((res) => res.data.data),
  })

export default useGetConnectedInstitutions
