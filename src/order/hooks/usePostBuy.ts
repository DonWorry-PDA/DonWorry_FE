import { useMutation } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import { BuyRequest, BuyResponse } from '../types/trade'

const usePostBuy = () =>
  useMutation({
    mutationFn: (body: BuyRequest) =>
      client
        .post<ApiResponse<BuyResponse>>('/api/user/trade/buy', body)
        .then((res) => res.data.data),
  })

export default usePostBuy
