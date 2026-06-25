import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { ApiResponse } from '@/common/types/api'
import { ProductDetailResponse } from '../types/product'

const productClient = axios.create({
  baseURL: import.meta.env.VITE_PRODUCT_API_BASE_URL ?? import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

const useGetProductDetail = (productId: number | undefined) =>
  useQuery({
    queryKey: ['product', 'detail', productId],
    queryFn: () =>
      productClient
        .get<ApiResponse<ProductDetailResponse>>(`/api/product/products/${productId}`)
        .then((res) => res.data.data),
    enabled: productId != null,
  })

export default useGetProductDetail
