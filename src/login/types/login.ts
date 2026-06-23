export type LoginRequest = {
  pin: string
}

export type LoginData = {
  token: string
  onboardingCompleted: boolean
}

export type UsePinInputReturn = {
  pin: string
  attempts: number
  isError: boolean
  isServerError: boolean
  isLocked: boolean
  appendDigit: (digit: string) => void
  deleteDigit: () => void
  reset: () => void
  clearError: () => void
}
