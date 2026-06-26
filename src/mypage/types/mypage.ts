export type UserProfile = {
  name: string
  age: number
  status: string
  pensionStatus: string
  monthlyTargetKrw: number
}

export type LinkedAccount = {
  id: string
  name: string
  detail: string
  amountKrw: number
}

export type MydataInstitution = {
  id: string
  name: string
  type: 'bank' | 'securities'
  label: string
  brandColor: string
  labelColor: string
  connected: boolean
  connectedProducts: string[]
}

export type TermAgreement = {
  id: string
  label: string
  required: boolean
  agreed: boolean
  agreedAt: string | null
}

export type ConsultStatus = 'reserved' | 'completed'

export type ConsultRecord = {
  id: string
  title: string
  status: ConsultStatus
  dateTime: string
  location: string
  counselor?: string
  actionLabel?: string
  actionPath?: string
}
