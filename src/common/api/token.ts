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
