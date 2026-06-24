import axios from 'axios'
import { getAccessToken, getRefreshToken, setAccessToken, clearTokens } from './token'
import queryClient from './queryClient'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

client.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 동시에 여러 요청이 401을 받아도 토큰 갱신은 한 번만 수행 (single-flight)
let refreshPromise: Promise<string> | null = null

const refreshAccessToken = () => {
  const refreshToken = getRefreshToken()
  // TODO: 토큰 갱신 엔드포인트 확정 후 교체
  return axios
    .post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, { refreshToken })
    .then(({ data }) => {
      setAccessToken(data.accessToken)
      return data.accessToken as string
    })
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = getRefreshToken()
      if (!refreshToken) return Promise.reject(error)

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null
          })
        }

        const accessToken = await refreshPromise
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return client(originalRequest)
      } catch {
        clearTokens()
        queryClient.clear()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

export default client
