export type AccountOpenResult = {
  accountNumber: string
  openedAt: string
  returnTo?: string
  planId?: string
}

export type UserIdentityInfo = {
  name: string
  idNumberMasked: string
  phone: string
}
