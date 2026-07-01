import type {
  AssetCategory,
  Analysis,
  Plan,
  ComparisonTable,
  PlanDetail,
  ExecutionSummary,
  TimeSlot,
} from '../types/paycheckPlan'

export const mockAssetCategories: AssetCategory[] = [
  {
    id: 'pension',
    name: '연금',
    items: [
      { id: 'irp', name: 'IRP', subLabel: '연금 계좌' },
      { id: 'pension-savings', name: '연금저축', subLabel: '세액공제 계좌' },
    ],
  },
  {
    id: 'deposit',
    name: '예금',
    items: [{ id: 'shinhan-deposit', name: '신한은행 정기예금', subLabel: '' }],
  },
  {
    id: 'investment',
    name: '투자',
    items: [
      { id: 'dividend-etf', name: '배당 ETF', subLabel: '월 분배금' },
      { id: 'domestic-stock', name: '국내 주식', subLabel: '배당 적음' },
    ],
  },
]

export const mockAnalysis: Analysis = {
  securedCashflow: 130,
  breakdown: [
    { label: '국민연금', value: 120 },
    { label: '배당 ETF 분배금', value: 10 },
    { label: '예금 이자 (만기 일시)', value: null, valueLabel: '월 환산 제외' },
  ],
  targetExpense: 220,
  additionalNeededCashflow: 90,
}

export const mockPlans: Plan[] = [
  {
    planId: 'stable',
    type: 'stable',
    name: '안정 월급형',
    tagline: '예금 · 배당주 · 월배당 ETF 중심',
    badge: '변동 가장 적음',
    status: 'selected',
    expectedIncome: 170,
    incrementalIncome: 40,
    coverage: 77,
    riskLevel: '낮음',
    riskScore: 2,
    riskDesc: '환위험 없는 배당주 중심',
  },
  {
    planId: 'balanced',
    type: 'balanced',
    name: '균형 월급형',
    tagline: '예금 · 채권형 · 배당 ETF 절충',
    status: 'available',
    expectedIncome: 185,
    incrementalIncome: 55,
    coverage: 84,
    riskLevel: '중간',
    riskScore: 3,
    riskDesc: '국내외 배당주 혼합',
  },
  {
    planId: 'growth',
    type: 'growth',
    name: '여유자금 성장형',
    tagline: '생활비는 안전하게 지키고, 남는 여유자금만 성장에 써요.',
    status: 'locked',
    expectedIncome: 195,
    incrementalIncome: 65,
    coverage: 89,
    riskLevel: '높음',
    riskScore: 3,
    riskDesc: '성장형 ETF 중심',
    lockedReason: '지금은 제한',
  },
]

// 3개 모두 열린 케이스 (맞춤운용등급 상위)
export const mockPlansUnlocked: Plan[] = [
  {
    planId: 'stable',
    type: 'stable',
    name: '안정 월급형',
    tagline: '',
    status: 'available',
    expectedIncome: 170,
    incrementalIncome: 40,
    coverage: 112,
    riskLevel: '낮음',
    riskScore: 2,
    riskDesc: '환위험 없는 배당주 중심',
  },
  {
    planId: 'balanced',
    type: 'balanced',
    name: '균형 월급형',
    tagline: '',
    badge: '추천 조합',
    status: 'recommended',
    expectedIncome: 185,
    incrementalIncome: 55,
    coverage: 120,
    riskLevel: '중간',
    riskScore: 3,
    riskDesc: '국내외 배당주 혼합',
  },
  {
    planId: 'growth',
    type: 'growth',
    name: '여유자금 성장형',
    tagline: '생활비는 안전하게 지키고, 남는 여유자금만 성장에 써요.',
    badge: '열림',
    status: 'available',
    expectedIncome: 195,
    incrementalIncome: 65,
    coverage: 89,
    riskLevel: '높음',
    riskScore: 3,
    riskDesc: '성장형 ETF 중심',
  },
]

export const mockComparisonTable: ComparisonTable = {
  leftPlanId: 'stable',
  rightPlanId: 'balanced',
  leftPlanName: '안정 월급형',
  rightPlanName: '균형 월급형',
  rows: [
    { label: '예상 월수입', left: '170만원', right: '185만원' },
    { label: '생활비 충당', left: '77%', right: '84%' },
    { label: '세후 실수령', left: '166만원', right: '179만원' },
    { label: '시장이 10% 내리면', left: '월급 그대로', right: '월급 −4만원' },
    { label: '중도 해지', left: '일부 만기 제약', right: '언제든 가능' },
    { label: '수수료 (연)', left: '0.18%', right: '0.31%' },
    {
      label: '2년 내 큰돈',
      left: '대비됨',
      right: '대비됨',
      leftTone: 'success',
      rightTone: 'success',
      isBadge: true,
    },
    {
      label: '생활 안정도',
      left: '보완 필요 유지',
      right: '안정으로 상승',
      leftTone: 'warning',
      rightTone: 'success',
      isBadge: true,
    },
  ],
  notice:
    '월급(분배금·배당)은 약속된 금액이 아니에요. 시장에 따라 달라질 수 있고, 줄어들면 미리 알려드려요.',
}

export const mockPlanDetails: Record<string, PlanDetail> = {
  stable: {
    planId: 'stable',
    planName: '안정 월급형',
    expectedMonthlyIncome: 170,
    currentCashFlow: 130,
    incrementalIncome: 40,
    inheritance: 5200,
    sustainableCoverage: 70,
    afterTaxIncome: 166,
    coverageFrom: 59,
    coverageTo: 77,
    shortfallFrom: 90,
    shortfallTo: 50,
    allocations: [
      { label: '예금 (만기 분산)', ratio: 50, detail: '이자 월 8만', color: '#0046FF' },
      { label: '배당주', ratio: 30, detail: '배당 월 12만', color: '#4A90E2' },
      { label: '월배당 ETF', ratio: 20, detail: '분배 월 10만', color: '#A8C4F0' },
    ],
    principalValue: 8500,
    notice:
      '월급이 보장되는 건 아니에요. 분배금·배당이 줄면 알림으로 알려드리고, 다시 조정하도록 도와드려요.',
  },
  balanced: {
    planId: 'balanced',
    planName: '균형 월급형',
    expectedMonthlyIncome: 185,
    currentCashFlow: 130,
    incrementalIncome: 55,
    inheritance: 4600,
    sustainableCoverage: 78,
    afterTaxIncome: 179,
    coverageFrom: 59,
    coverageTo: 84,
    shortfallFrom: 90,
    shortfallTo: 35,
    allocations: [
      { label: '예금 (만기 분산)', ratio: 40, detail: '이자 월 9만', color: '#0046FF' },
      { label: '채권형·월배당 ETF', ratio: 45, detail: '분배 월 31만', color: '#4A90E2' },
      { label: '배당주', ratio: 15, detail: '배당 월 15만', color: '#A8C4F0' },
    ],
    principalValue: 8500,
    notice:
      '월급이 보장되는 건 아니에요. 분배금·배당이 줄면 알림으로 알려드리고, 다시 조정하도록 도와드려요.',
  },
  growth: {
    planId: 'growth',
    planName: '여유자금 성장형',
    expectedMonthlyIncome: 195,
    currentCashFlow: 130,
    incrementalIncome: 65,
    inheritance: 4100,
    sustainableCoverage: 82,
    afterTaxIncome: 188,
    coverageFrom: 59,
    coverageTo: 89,
    shortfallFrom: 90,
    shortfallTo: 25,
    allocations: [
      { label: '성장형 ETF', ratio: 50, detail: '분배 월 20만', color: '#0046FF' },
      { label: '채권형', ratio: 30, detail: '이자 월 12만', color: '#4A90E2' },
      { label: '예금', ratio: 20, detail: '이자 월 5만', color: '#A8C4F0' },
    ],
    principalValue: 8500,
    notice:
      '월급이 보장되는 건 아니에요. 시장 변동에 따라 수익이 크게 달라질 수 있으니 주의하세요.',
  },
}

export const mockPlanDetail = mockPlanDetails['balanced']

export const mockExecutionSummary: ExecutionSummary = {
  planName: '균형 월급형',
  planType: 'balanced',
  coverageFrom: 59,
  coverageTo: 84,
  cashflowFrom: 130,
  cashflowTo: 185,
  items: [
    {
      id: '1',
      action: 'sell',
      name: '국내주식 팔기',
      description: '배당이 거의 없어 정리해요',
      amount: 2000,
    },
    {
      id: '2',
      action: 'buy',
      name: '월지급식 ETF 사기',
      description: '매달 분배금이 들어와요',
      amount: 2000,
    },
    {
      id: '3',
      action: 'buy',
      name: '배당 ETF 더 사기',
      description: '기존 보유분에 추가',
      amount: 1000,
    },
  ],
  notice: '주문은 장중에 시장가로 체결돼요. 지금은 거래 시간이라 바로 진행됩니다.',
}

export const mockTimeSlots: TimeSlot[] = [
  { time: '10:30', period: '오전' },
  { time: '2:00', period: '오후' },
  { time: '4:30', period: '오후' },
]
