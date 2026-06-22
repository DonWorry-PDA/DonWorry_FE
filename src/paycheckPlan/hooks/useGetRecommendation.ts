import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import { RecommendationResponse } from '../types/recommendation'

// 월급 플랜 3개 화면(목록·상세·비교)이 공유하는 추천 조회.
// 같은 queryKey라 화면 이동 시 캐시를 재사용한다.
const useGetRecommendation = () =>
  useQuery({
    queryKey: ['portfolio', 'recommendation'],
    queryFn: () =>
      client
        .get<ApiResponse<RecommendationResponse>>('/api/user/portfolio/recommendation')
        .then((res) => res.data.data),
  })

export default useGetRecommendation
