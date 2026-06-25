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
export type GrowthAsset = {
  amount: number // 개별주 평가액 합
  topStockName: string // 최대 비중 종목명
  concentrationRatio: number // 최대종목 / 개별주합 %
  concentrationLevel: string // 낮음 / 보통 / 높음
  suggestion: string // 정성적 재배치 유도 멘트(숫자·현재배당 단정 없음)
}

export type InvestmentCheckResponse = {
  cashflowAssetRatio: number // 헤드라인 % = 비연금·비STOCK 보유 / 순자산. 자산 없으면 0
  totalAsset: number // 순자산(grossTotal) = 4역할 금액의 합
  roles: RoleContribution[] // 금액 0인 역할은 제외, ratio 합 = 100
  growthAsset: GrowthAsset | null // 개별주 보유 없으면 null
}
