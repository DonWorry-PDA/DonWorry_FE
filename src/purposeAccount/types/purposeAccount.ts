export type AccountType = 'medical' | 'travel' | 'children' | 'gift' | 'emergency' | 'custom'

export interface Transaction {
  id: string
  label: string
  amount: number
  date: string
  isDeposit: boolean
}

export interface PurposeAccount {
  type: AccountType
  name: string
  goal: number
  current: number
  monthly: number
  nextDepositDate: string
  completionDate: string
  transactions: Transaction[]
}

export const ACCOUNT_META: Record<
  AccountType,
  {
    label: string
    sub: string
    /** CSS variable string — HTML inline style 용 */
    color: string
    /** 실제 hex — SVG attribute(stroke/fill) 전용 */
    hexColor: string
    bgColor: string
    textClass: string
  }
> = {
  medical: {
    label: '의료비',
    sub: '진단 권장 1,200만',
    color: 'var(--color-primary)',
    hexColor: '#0046FF',
    bgColor: 'var(--color-primary-tint)',
    textClass: 'text-primary',
  },
  travel: {
    label: '여행 자금',
    sub: '가족 여행 등',
    color: 'var(--color-success)',
    hexColor: '#069A53',
    bgColor: 'var(--color-success-bg)',
    textClass: 'text-success',
  },
  children: {
    label: '자녀·손주',
    sub: '용돈·학자금',
    color: 'var(--color-card-blue)',
    hexColor: '#3845AD',
    bgColor: 'var(--color-primary-faint)',
    textClass: 'text-card-blue',
  },
  gift: {
    label: '경조사',
    sub: '축의·부조',
    color: 'var(--color-card-coral)',
    hexColor: '#F65035',
    bgColor: 'var(--color-danger-bg)',
    textClass: 'text-card-coral',
  },
  emergency: {
    label: '비상금',
    sub: '갑작스러운 일',
    color: 'var(--color-violet)',
    hexColor: '#7C3AED',
    bgColor: 'var(--color-violet-bg)',
    textClass: 'text-violet',
  },
  custom: {
    label: '직접 만들기',
    sub: '이름 직접 입력',
    color: 'var(--color-ink-sub)',
    hexColor: '#5B6573',
    bgColor: 'var(--color-surface-muted)',
    textClass: 'text-ink-sub',
  },
}
