import { useQuery } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import { ProductDetailResponse } from '../types/product'

const useGetProductDetail = (productId: number | undefined) =>
  useQuery({
    queryKey: ['product', 'detail', productId],
    queryFn: () =>
      client
        .get<ApiResponse<ProductDetailResponse>>(`/api/product/products/${productId}`)
        .then((res) => res.data.data),
    enabled: productId != null,
  })

export default useGetProductDetail
