// GET /api/user/asset/investment-check 응답 원형 (BE InvestmentCheckResponse)
// 자산을 4역할(현금흐름·성장·잠자는 돈·연금)로 분해하고, 개별주 성장 블록을 반환한다.

export type AssetRole = 'CASHFLOW' | 'GROWTH' | 'IDLE' | 'PENSION'

// 자산 역할별 기여. monthlyCashflow는 CASHFLOW 역할만 추정액(> 0), 그 외는 0.
export type RoleContribution = {
  role: AssetRole
  label: string // 현금흐름 / 성장 / 잠자는 돈 / 연금
  amount: number
  ratio: number // 순자산 대비 %, 합 100
  monthlyCashflow: number // 월 현금흐름 추정액(CASHFLOW 역할만 > 0)
  note: string // 역할 설명 힌트(FE 오버라이드 가능)
}

// 개별주 "성장에 베팅한 자산" 블록. 개별주 보유가 없으면 null.
// 배당은 보유분 실배당(종목별 dividend_yield) 기반 사실값이다.
export type GrowthAsset = {
  amount: number // 개별주 평가액 합
  topStockName: string // 최대 비중 종목명
  concentrationRatio: number // 최대종목 / 개별주합 %
  concentrationLevel: string // 낮음 / 보통 / 높음
  topSector: string | null // 최대 비중 섹터명(섹터 산출 불가 시 null)
  sectorConcentrationRatio: number // 최대섹터 / 개별주합 % (단일종목 쏠림이 낮아도 섹터는 높을 수 있음)
  sectorConcentrationLevel: string // 낮음 / 보통 / 높음
  currentMonthlyDividend: number // 현재 개별주에서 나오는 월 배당(원)
  convertedMonthlyDividend: number // 전액 배당ETF로 옮겼을 때 월 배당(원)
  deltaMonthlyDividend: number // converted − current. 음수면 옮기면 손해
  suggestion: string // 델타 부호에 따라 BE가 분기한 멘트(이동 유도 / 보유 유지)
}

export type InvestmentCheckResponse = {
  cashflowAssetRatio: number // 헤드라인 % = 비연금·비STOCK 보유 / 순자산. 자산 없으면 0
  totalAsset: number // 순자산(grossTotal) = 4역할 금액의 합
  roles: RoleContribution[] // 금액 0인 역할은 제외, ratio 합 = 100
  growthAsset: GrowthAsset | null // 개별주 보유 없으면 null
}
