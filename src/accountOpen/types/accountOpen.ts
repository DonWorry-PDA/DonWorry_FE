export type AccountOpenResult = {
  accountNumber: string
  openedAt: string
  returnTo?: string
  planId?: string
}

export type AccountOpenRequest = {
  agreedTermIds: string[]
  phone: string
}

export type AccountOpenResponse = {
  accountNumber: string
  openedAt: string
}

export type UserIdentityInfo = {
  name: string
  idNumberMasked: string
  phone: string
}
