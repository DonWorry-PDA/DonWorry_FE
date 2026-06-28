// src/asset/types/assetAnalysis.ts

// ── 자산 구성 ────────────────────────────────────────────────
export type AssetHolding = {
  productName: string
  tickerCode: string | null
  quantity: number | null
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
  type: 'ETF_DIVIDEND' | 'DEPOSIT_INTEREST' | 'DEPOSIT_MATURITY' | 'DEBT_MATURITY' | (string & {})
  label: string
  amount: number | null
  estimated: boolean
}

export type AssetScheduleResponse = {
  events: ScheduleEvent[]
}

// ── 연금 재원 ─────────────────────────────────────────────────
export type PensionItem = {
  type: string
  label: string
  institutionName: string | null
  startAge: number
  currentBalance: number | null    // 국민연금은 null (잔액 개념 없음)
  retirementAmount: number | null  // IRP 퇴직급여 금액
  personalAmount: number | null    // IRP/연금저축 개인 납입금
  expectedMonthlyGross: number     // 세전 월 수령 예상액
  expectedMonthlyNet: number       // 세후 월 수령 예상액 (실수령액)
  effectiveTaxRate: number         // 유효세율 (e.g. 0.0508)
  taxBenefitLimit: number | null
  estimated: boolean
  payoutMonths: number | null      // estimated=true 항목만: 수령 개시~기대수명(83세) 개월 수
  yearsEnrolled: number | null     // IRP 가입기간 (년)
}

export type AssetPensionResponse = {
  totalMonthlyPension: number      // 세전 총합
  totalMonthlyPensionNet: number   // 세후 총합
  pensions: PensionItem[]
}
