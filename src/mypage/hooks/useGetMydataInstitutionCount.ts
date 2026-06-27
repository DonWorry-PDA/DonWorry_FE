import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'

type ConnectedInstitutionCount = { connectedInstitutionCount: number }

// 연결된 기관 수의 단일 출처(BE #204). 온보딩·마이페이지가 같은 값을 쓰도록
// GET /api/user/mydata/institutions/connected-count 만 호출한다.
const useGetMydataInstitutionCount = () =>
  useQuery({
    queryKey: ['mydataInstitutionCount'],
    queryFn: () =>
      client
        .get<ApiResponse<ConnectedInstitutionCount>>(
          '/api/user/mydata/institutions/connected-count',
        )
        .then((res) => res.data.data.connectedInstitutionCount),
  })

export default useGetMydataInstitutionCount
