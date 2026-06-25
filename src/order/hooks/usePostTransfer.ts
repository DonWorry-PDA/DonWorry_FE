import { useMutation } from '@tanstack/react-query'
import client from '@/common/api/client'
import { ApiResponse } from '@/common/types/api'
import { TransferRequest, TransferResponse } from '../types/trade'

const usePostTransfer = () =>
  useMutation({
    mutationFn: (body: TransferRequest) =>
      client
        .post<ApiResponse<TransferResponse>>('/api/user/trade/transfer', body)
        .then((res) => res.data.data),
  })

export default usePostTransfer
