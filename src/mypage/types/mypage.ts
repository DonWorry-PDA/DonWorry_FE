export type UserProfile = {
  name: string
  age: number
  status: string
  monthlyTargetKrw: number
}

export type LinkedAccount = {
  id: string
  name: string
  detail: string
  amountKrw: number
}

export type ConsultStatus = 'reserved' | 'completed'

export type ConsultRecord = {
  id: string
  title: string
  status: ConsultStatus
  dateTime: string
  location: string
  actionLabel?: string
}
