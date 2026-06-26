// src/asset/types/assetAnalysis.ts

// ── 자산 구성 ────────────────────────────────────────────────
export type AssetHolding = {
  productName: string
  evaluationAmount: number
}

export type AssetAccount = {
  accountId: number
  institutionName: string
  accountType: string
  balance: number
  interestRate: number | null
  maturityDate: string | null
  holdings: AssetHolding[]
}

export type AssetAllocation = {
  category: string
  label: string
  totalAmount: number
  accounts: AssetAccount[]
}

export type AssetCompositionResponse = {
  totalAsset: number
  totalDebt: number
  netWorth: number
  allocation: AssetAllocation[]
}

// ── 월 수입 ──────────────────────────────────────────────────
export type IncomeSource = {
  type: string
  label: string
  amount: number
  locked: boolean
}

export type AssetIncomeResponse = {
  totalMonthlyIncome: number
  accessibleIncome: number
  lockedIncome: number
  totalUnrealizedGainLoss: number
  sources: IncomeSource[]
}

// ── 현금 일정 ─────────────────────────────────────────────────
export type ScheduleEvent = {
  date: string
  type: 'income' | 'maturity' | string
  label: string
  amount: number
  estimated: boolean
}

export type AssetScheduleResponse = {
  events: ScheduleEvent[]
}

// ── 연금 재원 ─────────────────────────────────────────────────
// Task 7에서 BE PensionResourceResponse 확인 후 필드 추가 가능
export type PensionItem = {
  label: string
  amountKrw: number
}

export type AssetPensionResponse = {
  items: PensionItem[]
}
