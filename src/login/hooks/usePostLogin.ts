import { useMutation } from '@tanstack/react-query'
import client from '@/common/api/client'
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
      setAccessToken(token)
    },
  })

export default usePostLogin
