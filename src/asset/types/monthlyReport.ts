export type MonthlyReportResponse = {
  month: string
  summary: string[]
  assetChange: {
    changeAmount: number | null
    previousTotal: number | null
    currentTotal: number
  }
  income: {
    pensionAmount: number
    dividendAmount: number
    dividendChangeRate: number | null
    interestAmount: number
  }
  spending: {
    expenseAmount: number
    incomeAmount: number
    judgment: '적정' | '주의' | '과다'
    spendingRatio: number
  }
  nextMonthPreview: {
    incomingTotal: number
    pensionAmount: number
    dividendAmount: number
    interestAmount: number
    outgoingTotal: number
    balanceSufficient: boolean
  }
}
