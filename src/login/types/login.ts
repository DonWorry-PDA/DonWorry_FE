export type LoginRequest = {
  userId: number
  pin: string
}

export type LoginData = {
  token: string
  onboardingCompleted: boolean
}

export type UsePinInputReturn = {
  pin: string
  isPending: boolean
  isError: boolean
  isServerError: boolean
  isShaking: boolean
  appendDigit: (digit: string) => void
  deleteDigit: () => void
  reset: () => void
  clearError: () => void
}
