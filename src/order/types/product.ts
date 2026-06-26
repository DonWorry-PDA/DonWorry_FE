export type ProductType = 'ETF' | 'DEPOSIT' | 'PENSION_SAVING'

export type EtfDetailDto = {
  tickerCode: string
  assetManager: string
  brandName: string
  riskGrade: number
  annualDividendRate: number
  latestDividendRate: number
  distributionCycle: string
  distributionIntervalMonths: number
  high52w: number
  low52w: number
  retirementPensionLimit: string
  personalPensionAvailable: boolean
  closingPrice: number
  priceChange: number
  changeRate: number
  nav: number
  netAssetTotal: number
  prospectus_url: string | null
  simplified_url: string | null
  fund_rules_url: string | null
}

export type DepositDetailDto = {
  interestRate: number
  maturityMonths: number
  subscriptionLimit: number
  depositInsurance: boolean
}

export type PensionSavingDetailDto = {
  pensionSavingType: string
  detailType: string
  avgReturnRate: number
  returnRate1Year: number
  returnRate2Year: number
  returnRate3Year: number
  subscriptionMethod: string
  providerName: string
}

export type ProductDetailResponse = {
  productId: number
  productName: string
  productType: ProductType
  etfDetail: EtfDetailDto | null
  depositDetail: DepositDetailDto | null
  pensionSavingDetail: PensionSavingDetailDto | null
}

export type EtfPricePayload = {
  ticker: string
  currentPrice: number
  changePrice: number
  changeRate: number
  sign: string // '2'=상승 '3'=보합 '5'=하락
}
