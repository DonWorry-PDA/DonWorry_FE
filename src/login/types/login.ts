export type LoginRequest = {
  userId: number
  pin: string
}

export type LoginData = {
  token: string
  onboardingCompleted: boolean
}
