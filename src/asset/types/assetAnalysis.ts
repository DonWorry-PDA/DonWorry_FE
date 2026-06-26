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

export type AssetAllocationItem = {
  category: string
  ratio: number
}

export type AssetGroupItem = {
  category: string
  label: string
  totalAmount: number
  accounts: AssetAccount[]
}

export type AssetCompositionResponse = {
  totalAsset: number
  totalDebt: number
  netWorth: number
  allocation: AssetAllocationItem[]
  groups: AssetGroupItem[]
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
  totalUnrealizedGainLoss: number // 평가손익 — BE income endpoint includes portfolio valuation
  sources: IncomeSource[]
}

// ── 현금 일정 ─────────────────────────────────────────────────
export type ScheduleEvent = {
  date: string
  type: 'income' | 'maturity' | (string & {})
  label: string
  amount: number
  estimated: boolean
}

export type AssetScheduleResponse = {
  events: ScheduleEvent[]
}

// ── 연금 재원 ─────────────────────────────────────────────────
export type PensionItem = {
  type: string
  label: string
  institutionName: string
  startAge: number
  currentBalance: number
  expectedMonthly: number
  taxBenefitLimit: number
  estimated: boolean
}

export type AssetPensionResponse = {
  totalMonthlyPension: number
  pensions: PensionItem[]
}
