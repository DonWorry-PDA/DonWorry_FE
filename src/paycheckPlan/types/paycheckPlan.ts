export type AssetCategory = {
  id: string
  name: string
  items: AssetItem[]
}

export type AssetItem = {
  id: string
  name: string
  subLabel: string
}

export type SalaryAssetItem = {
  assetKey: string
  name: string
  description: string
  amount: number
  excluded: boolean
}

export type SalaryAssetGroup = {
  category: string
  categoryLabel: string
  items: SalaryAssetItem[]
}

export type SalaryAssetListResponse = {
  assetGroups: SalaryAssetGroup[]
}

export type SalaryAssetExclusionRequest = {
  excludedAssetKeys: string[]
}

export type CashFlowDiagnosisResponse = {
  monthlyCashFlow: number
  nationalPension: number
  dividendIncome: number
  targetMonthlyLivingCost: number
  monthlyShortfall: number
  shortfallExists: boolean
}

export type Analysis = {
  securedCashflow: number
  breakdown: CashflowItem[]
  targetExpense: number
  additionalNeededCashflow: number
}

export type CashflowItem = {
  label: string
  value: number | null
  valueLabel?: string
}

export type PlanType = 'stable' | 'balanced' | 'growth'

export type PlanStatus = 'available' | 'recommended' | 'selected' | 'locked'

export type Plan = {
  planId: string
  type: PlanType
  name: string
  tagline: string
  badge?: string
  status: PlanStatus
  expectedIncome: number
  coverage: number | null // 연금초과(충당 무의미)면 null → '충분' 표기
  riskLevel: '낮음' | '중간' | '높음'
  lockedReason?: string
}

export type ComparisonRow = {
  label: string
  left: string
  right: string
  leftTone?: 'default' | 'warning' | 'success'
  rightTone?: 'default' | 'warning' | 'success'
  isBadge?: boolean
}

export type ComparisonTable = {
  leftPlanId: string
  rightPlanId: string
  leftPlanName: string
  rightPlanName: string
  rows: ComparisonRow[]
  notice: string
}

export type AllocationItem = {
  label: string
  ratio: number
  detail: string
  color: string
}

export type PlanDetail = {
  planId: string
  planName: string
  expectedMonthlyIncome: number
  afterTaxIncome: number
  coverageFrom: number
  coverageTo: number
  shortfallFrom: number
  shortfallTo: number
  allocations: AllocationItem[]
  monthlyIncome: number
  principalValue: number
  notice: string
}

export type ExecutionItem = {
  id: string
  action: 'buy' | 'sell'
  name: string
  description: string
  amount: number
  ticker?: string
  productName?: string
}

export type ExecutionSummary = {
  planName: string
  planType: PlanType
  coverageFrom: number
  coverageTo: number
  cashflowFrom: number
  cashflowTo: number
  items: ExecutionItem[]
  estimatedFee: number
  notice: string
}

export type ConsultType = 'pb' | 'insurance'

export type ConsultCard = {
  type: ConsultType
  title: string
  subtitle: string
  description: string
  badge?: string
  hasSendToggle?: boolean
}

export type TimeSlot = {
  time: string
  period: '오전' | '오후'
}
