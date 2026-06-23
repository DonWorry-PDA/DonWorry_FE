import { useMutation } from '@tanstack/react-query'
import client from '@/common/api/client'
import queryClient from '@/common/api/queryClient'
import { ApiResponse } from '@/common/types/api'
import { setAccessToken } from '@/common/api/token'
import { LoginRequest, LoginData } from '../types/login'

const usePostLogin = () =>
  useMutation({
    mutationFn: (body: LoginRequest) =>
      client
        .post<ApiResponse<LoginData>>('/api/user/auth/login', body)
        .then((res) => res.data.data),
    onSuccess: ({ token }) => {
      // 이전 user의 잔여 캐시를 제거한 뒤 새 토큰을 저장한다
      queryClient.clear()
      setAccessToken(token)
    },
  })

export default usePostLogin
