const ACCESS_KEY = 'token'
const REFRESH_KEY = 'refresh'

export const getAccessToken = () => sessionStorage.getItem(ACCESS_KEY)
export const setAccessToken = (token: string) => sessionStorage.setItem(ACCESS_KEY, token)

export const getRefreshToken = () => sessionStorage.getItem(REFRESH_KEY)
export const setRefreshToken = (token: string) => sessionStorage.setItem(REFRESH_KEY, token)

export const clearTokens = () => {
  sessionStorage.removeItem(ACCESS_KEY)
  sessionStorage.removeItem(REFRESH_KEY)
}

export const getUserIdFromToken = (): number | null => {
  const token = getAccessToken()
  if (!token) return null
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64))
    return payload.sub ? Number(payload.sub) : null
  } catch {
    return null
  }
}
