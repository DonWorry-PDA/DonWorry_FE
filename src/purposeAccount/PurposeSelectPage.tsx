import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '@/common/components/AppBar'
import { AccountType, ACCOUNT_META } from './types/purposeAccount'

const ICONS: Record<AccountType, React.ReactNode> = {
  medical: (
    <svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <path d="M11 4v14M4 11h14" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
    </svg>
  ),
  travel: (
    <svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <path d="M3 14l5-9 3 5 2-3 3 7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 18h18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  ),
  children: (
    <svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <circle cx={8} cy={7} r={2.5} stroke="currentColor" strokeWidth={2} />
      <circle cx={14} cy={7} r={2.5} stroke="currentColor" strokeWidth={2} />
      <path d="M2 18c0-3.314 2.686-6 6-6h6c3.314 0 6 2.686 6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  ),
  gift: (
    <svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <rect x={3} y={9} width={16} height={2} rx={1} stroke="currentColor" strokeWidth={2} />
      <rect x={5} y={11} width={12} height={8} rx={1} stroke="currentColor" strokeWidth={2} />
      <path d="M11 9V5c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2h-2zM11 9V5c0-1.105-.895-2-2-2S7 3.895 7 5s.895 2 2 2h2z" stroke="currentColor" strokeWidth={1.5} />
    </svg>
  ),
  emergency: (
    <svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <path d="M11 3C7.134 3 4 6.134 4 10c0 3 1.5 5 3 6h8c1.5-1 3-3 3-6 0-3.866-3.134-7-7-7z" stroke="currentColor" strokeWidth={2} />
      <path d="M11 16v3M8 19h6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  ),
  custom: (
    <svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <path d="M11 4v14M4 11h14" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
    </svg>
  ),
}

const CATEGORY_ORDER: AccountType[] = ['medical', 'travel', 'children', 'gift', 'emergency', 'custom']

export default function PurposeSelectPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Set<AccountType>>(new Set(['medical', 'travel']))

  const toggle = (type: AccountType) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }

  const count = selected.size

  return (
    <div className="flex flex-col h-dvh bg-white">
      <AppBar title="목적 선택" onBack={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-4">
        <h1 className="text-heading font-bold text-ink">
          어떤 목적으로
          <br />
          모을까요?
        </h1>
        <p className="text-body text-ink-sub mt-2">여러 개 골라도 돼요. 나중에 더 만들 수 있어요.</p>

        <div className="grid grid-cols-2 gap-3 mt-6">
          {CATEGORY_ORDER.map((type) => {
            const meta = ACCOUNT_META[type]
            const isSelected = selected.has(type)
            return (
              <button
                key={type}
                onClick={() => toggle(type)}
                aria-pressed={isSelected}
                className={[
                  'flex flex-col gap-2 p-4 rounded-card-lg border-2 text-left transition-colors',
                  isSelected ? 'border-primary bg-primary-tint' : 'border-line bg-white',
                ].join(' ')}
              >
                <span style={{ color: isSelected ? 'var(--color-primary)' : 'var(--color-ink-sub)' }}>
                  {ICONS[type]}
                </span>
                <div>
                  <p
                    className="text-body font-semibold"
                    style={{ color: isSelected ? 'var(--color-primary)' : 'var(--color-ink)' }}
                  >
                    {meta.label}
                  </p>
                  <p className="text-sub text-ink-hint mt-0.5">{meta.sub}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="shrink-0 bg-white px-6 pb-10 pt-3">
        <button
          disabled={count === 0}
          onClick={() => navigate('/purpose-account/setup', { state: { selected: [...selected] } })}
          className="w-full bg-primary text-white rounded-btn text-btn font-bold py-4 disabled:opacity-40"
        >
          {count > 0 ? `${count}개 선택 · 다음` : '선택해 주세요'}
        </button>
      </div>
    </div>
  )
}
