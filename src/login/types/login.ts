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
  isError: boolean
  isServerError: boolean
  appendDigit: (digit: string) => void
  deleteDigit: () => void
  reset: () => void
  clearError: () => void
}
