// GET /api/user/asset/hub 응답 원형 (BE AssetHubResponse)
export type LifeStabilityGrade = 'STABLE' | 'NEED_COMPLEMENT' | 'NEED_IMPROVEMENT'

// POST /api/user/mydata/mock/connect (및 /sync) 응답 (BE MydataSyncResponse)
export type MydataAssetGroup = {
  category: string
  amount: number
}

export type MydataAssetSummary = {
  totalAsset: number
  totalDebt: number
  netAsset: number
  assetGroups: MydataAssetGroup[]
}

export type MydataConnectResponse = {
  connectedInstitutions: number
  syncedAt: string
  message: string
  assetSummary: MydataAssetSummary
}

export type AssetHubAllocationItem = {
  category: string
  ratio: number // 정수 % (합 100 보정)
}

export type AssetHubSalaryMaking = {
  achievementRate: number | null
  targetAmount: number | null
  currentAmount: number | null
  hasActivePlan: boolean
}

export type AssetHubLifeStability = {
  // 아직 생활 안정도가 산출되지 않은 사용자는 필드가 null로 내려온다.
  grade: LifeStabilityGrade | null
  gradeLabel: string | null
  coverageRate: number | null
}

export type AssetHubMenus = {
  salaryMaking: AssetHubSalaryMaking | null
  lifeStability: AssetHubLifeStability | null
  investmentCheck: { cashflowAssetRatio: number | null } | null
  pensionDefer: { deferYears: number | null; lifetimeIncrease: number | null } | null
  retirementSim: { available: boolean } | null
  monthlyReport: { isNew: boolean | null; month: string | null } | null
}

export type EtfHoldingItem = {
  ticker: string
  quantity: number
}

export type AssetHubResponse = {
  totalAsset: number
  changeAmount: number | null // 월간 스냅샷 도입 전까지 null
  changeDirection: 'UP' | 'DOWN' | 'FLAT'
  allocation: AssetHubAllocationItem[]
  monthlyIncome: number
  monthlyExpense: number
  etfHoldings: EtfHoldingItem[]
  etfSnapshotAmount: number
  menus: AssetHubMenus
}
