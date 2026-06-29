import { PurposeAccount } from '../types/purposeAccount'

export const MOCK_ACCOUNTS: PurposeAccount[] = [
  {
    type: 'medical',
    name: '의료비 통장',
    goal: 12_000_000,
    current: 6_000_000,
    monthly: 200_000,
    nextDepositDate: '7월 15일',
    completionDate: '2028년 3월',
    transactions: [
      { id: '1', label: '자동 적립', amount: 200_000, date: '07.15', isDeposit: true },
      { id: '2', label: '자동 적립', amount: 200_000, date: '06.15', isDeposit: true },
      { id: '3', label: '병원비 사용', amount: 150_000, date: '05.20', isDeposit: false },
      { id: '4', label: '자동 적립', amount: 200_000, date: '05.15', isDeposit: true },
    ],
  },
  {
    type: 'travel',
    name: '여행 통장',
    goal: 3_000_000,
    current: 800_000,
    monthly: 150_000,
    nextDepositDate: '7월 15일',
    completionDate: '2027년 8월',
    transactions: [
      { id: '1', label: '자동 적립', amount: 150_000, date: '07.15', isDeposit: true },
      { id: '2', label: '자동 적립', amount: 150_000, date: '06.15', isDeposit: true },
      { id: '3', label: '여행 경비 사용', amount: 300_000, date: '06.02', isDeposit: false },
    ],
  },
  {
    type: 'emergency',
    name: '비상금 통장',
    goal: 6_000_000,
    current: 1_200_000,
    monthly: 100_000,
    nextDepositDate: '7월 15일',
    completionDate: '2030년 5월',
    transactions: [
      { id: '1', label: '자동 적립', amount: 100_000, date: '07.15', isDeposit: true },
      { id: '2', label: '자동 적립', amount: 100_000, date: '06.15', isDeposit: true },
      { id: '3', label: '자동 적립', amount: 100_000, date: '05.15', isDeposit: true },
    ],
  },
]

export const TOTAL_DISTRIBUTION = 550_000
export const USED_DISTRIBUTION = 450_000
export const NEXT_DISTRIBUTION_DATE = '7월 15일'
