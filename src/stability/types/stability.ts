export type StabilityStatus = 'stable' | 'warning' | 'danger'

export type StabilityItem = {
  id: number
  label: string
  status: StabilityStatus
}

export type StabilityData = {
  percentage: number
  status: StabilityStatus
  monthlyShortfallKrw: number | null
  items: StabilityItem[]
}
