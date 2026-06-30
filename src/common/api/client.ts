import axios from 'axios'
import { getAccessToken, getRefreshToken, setAccessToken, clearTokens } from './token'
import { dispatchAuthFailure } from './authEvents'

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

const redirectToLogin = () => {
  clearTokens()
  dispatchAuthFailure()
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401) {
      // 이미 retry한 요청이 또 401 → 세션 만료, 로그인으로
      if (originalRequest._retry) {
        redirectToLogin()
        return Promise.reject(error)
      }

      originalRequest._retry = true

      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        redirectToLogin()
        return Promise.reject(error)
      }

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
        redirectToLogin()
      }
    }

    return Promise.reject(error)
  },
)

export default client
