export type SavePlanHolding = {
  productId: number
  ticker: string
  productName: string
  weight: number
  targetAmount: number
}

export type SavePlanRequest = {
  planType: string
  monthlyIncome: number
  currentCoverageRate: number
  totalCoverageRate: number
  currentMonthlyShortfall: number
  residualMonthlyShortfall: number
  principalAmount: number
  holdings: SavePlanHolding[]
}

export type SavePlanResponse = {
  id: number
  savedAt: string
}

export type SavedPlanHolding = {
  productId: number
  ticker: string
  productName: string
  weight: number
  targetAmount: number
}

export type SavedPlanResponse = {
  id: number
  planType: string
  monthlyIncome: number
  currentCoverageRate: number
  totalCoverageRate: number
  currentMonthlyShortfall: number
  residualMonthlyShortfall: number
  principalAmount: number
  holdings: SavedPlanHolding[]
  savedAt: string
}
