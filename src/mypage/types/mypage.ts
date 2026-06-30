export type UserProfile = {
  name: string
  age: number
  status: string
  pensionStatus: string
  monthlyTargetKrw: number
  // 이번 프로필 수정으로 ACTIVE 월급 설계안이 비활성화됐는지(목표 변경 시). 조회 응답에선 항상 false.
  activePlanSuperseded?: boolean
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
  accountNumbers?: string[]
  totalAmountKrw?: number
}

export type InstitutionCategory =
  | 'BANK'
  | 'SECURITIES'
  | 'PENSION'
  | 'INSURANCE'
  | 'CARD'
  | 'LOAN'

// 연결된 기관 1곳(BE #211). 진실 소스는 AssetConnection이라 카탈로그(/institutions)에
// 없는 연금·보험·카드도 포함된다. 표시 메타(label/색)는 BE가 폴백까지 채워서 내려준다.
export type ConnectedInstitution = {
  name: string
  category: InstitutionCategory
  status: string // 현재는 모두 'CONNECTED', 추후 연결 실패 표현 대비
  label: string
  brandColor: string
  labelColor: string
}

// 목록 + 카운트 동봉. connectedInstitutionCount === institutions.length 가 BE에서 보장된다.
export type ConnectedInstitutionsResponse = {
  connectedInstitutionCount: number
  institutions: ConnectedInstitution[]
}

export type TermAgreement = {
  id: string
  label: string
  required: boolean
  agreed: boolean
  agreedAt: string | null
}

export type OptionalTermsResponse = {
  thirdParty: { agreed: boolean; agreedAt: string | null }
  marketing: { agreed: boolean; agreedAt: string | null }
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
