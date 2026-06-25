import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'

type Institution = {
  id: string
  name: string
  label: string
  bg: string
  color: string
}

const CONNECTED: Institution = {
  id: 'shinhan',
  name: '신한은행 · 신한투자증권',
  label: '신한',
  bg: '#0046ff',
  color: '#ffffff',
}

const BANKS: Institution[] = [
  { id: 'kb', name: 'KB국민은행', label: 'KB', bg: '#ffbc00', color: '#3a2e00' },
  { id: 'woori', name: '우리은행', label: '우리', bg: '#0067ac', color: '#ffffff' },
  { id: 'hana', name: '하나은행', label: '하나', bg: '#008375', color: '#ffffff' },
  { id: 'kakao', name: '카카오뱅크', label: 'kakao', bg: '#ffe300', color: '#3b1e1e' },
]

const SECURITIES: Institution[] = [
  { id: 'mirae', name: '미래에셋증권', label: '미래', bg: '#1f3a93', color: '#ffffff' },
  { id: 'samsung', name: '삼성증권', label: '삼성', bg: '#1428a0', color: '#ffffff' },
]

function InstitutionBadge({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <div
      className="flex size-[42px] shrink-0 items-center justify-center rounded-[12px]"
      style={{ background: bg }}
    >
      <span className="text-sub font-extrabold" style={{ color }}>
        {label}
      </span>
    </div>
  )
}

function SelectCircle({ selected }: { selected: boolean }) {
  return (
    <div
      className={`flex size-[26px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
        selected ? 'border-primary bg-primary' : 'border-[#d6dce3] bg-white'
      }`}
    >
      {selected && (
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
          <path
            d="M1.5 5L4.5 8L10.5 2"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  )
}

function AccountConnectPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showToast, setShowToast] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return { banks: BANKS, securities: SECURITIES }
    return {
      banks: BANKS.filter((b) => b.name.toLowerCase().includes(q)),
      securities: SECURITIES.filter((s) => s.name.toLowerCase().includes(q)),
    }
  }, [query])

  const hasSelection = selected.size > 0

  const handleConnect = () => {
    setShowToast(true)
    timerRef.current = setTimeout(() => navigate('/mypage', { replace: true }), 2000)
  }

  return (
    <div className="relative flex h-dvh flex-col bg-white">
      <AppBar title="계좌 더 연결하기" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto">
        {/* 헤더 */}
        <div className="px-6 pt-6 pb-1 flex flex-col gap-[8.8px]">
          <h2 className="text-heading font-extrabold text-ink leading-[1.43]">
            빠진 자산,
            <br />
            한 번에 연결해요
          </h2>
          <p className="text-sub text-ink-hint leading-[1.66]">
            은행·증권사를 선택하면 잔액과 보유내역을 불러와 월급과 안정도에 반영해드려요.
          </p>
        </div>

        {/* 검색 */}
        <div className="px-6 pt-4">
          <div className="bg-surface-muted flex h-12 items-center gap-[9px] rounded-[13px] px-[14px]">
            <svg width="17" height="18" viewBox="0 0 17 18" fill="none" className="shrink-0">
              <circle cx="7.5" cy="7.5" r="6" stroke="#9BA4AE" strokeWidth="1.8" />
              <path d="M12 12.5L15.5 16" stroke="#9BA4AE" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="기관 이름 검색"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 min-w-0 bg-transparent text-body text-ink placeholder:text-ink-hint"
            />
          </div>
        </div>

        {/* 이미 연결된 기관 */}
        <div className="px-6 pt-5 flex flex-col gap-0.5">
          <p className="text-caption font-semibold text-ink-hint">이미 연결된 기관</p>
          <div className="flex items-center gap-3 py-[14px]">
            <InstitutionBadge label={CONNECTED.label} bg={CONNECTED.bg} color={CONNECTED.color} />
            <div className="flex flex-1 min-w-0 flex-col gap-0.5">
              <p className="text-body font-bold text-ink">{CONNECTED.name}</p>
              <p className="text-caption font-medium text-ink-hint">예금 · ETF · IRP 연동 중</p>
            </div>
            <span className="bg-success-bg text-success text-caption font-bold px-[9px] py-[3px] rounded-badge shrink-0">
              연결됨
            </span>
          </div>
        </div>

        {/* 은행 섹션 */}
        {filtered.banks.length > 0 && (
          <div className="px-6 pt-4">
            <p className="text-caption font-semibold text-ink-hint">은행</p>
            {filtered.banks.map((bank, i) => (
              <div key={bank.id}>
                {i > 0 && <div className="h-px bg-divider" />}
                <button
                  className="flex w-full items-center gap-3 py-[14px] text-left"
                  onClick={() => toggle(bank.id)}
                >
                  <InstitutionBadge label={bank.label} bg={bank.bg} color={bank.color} />
                  <p className="flex-1 min-w-0 text-body font-bold text-ink">{bank.name}</p>
                  <SelectCircle selected={selected.has(bank.id)} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 증권사 섹션 */}
        {filtered.securities.length > 0 && (
          <div className="px-6 pt-4">
            <p className="text-caption font-semibold text-ink-hint">증권사</p>
            {filtered.securities.map((sec, i) => (
              <div key={sec.id}>
                {i > 0 && <div className="h-px bg-divider" />}
                <button
                  className="flex w-full items-center gap-3 py-[14px] text-left"
                  onClick={() => toggle(sec.id)}
                >
                  <InstitutionBadge label={sec.label} bg={sec.bg} color={sec.color} />
                  <p className="flex-1 min-w-0 text-body font-bold text-ink">{sec.name}</p>
                  <SelectCircle selected={selected.has(sec.id)} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 검색 결과 없음 */}
        {filtered.banks.length === 0 && filtered.securities.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-10">
            <p className="text-md font-medium text-ink">검색 결과가 없어요</p>
            <p className="text-sub text-ink-hint">다른 기관 이름으로 검색해보세요</p>
          </div>
        )}

        {/* 안내 문구 */}
        <div className="px-6 pt-[18px] pb-4">
          <div className="bg-[#f1f5fb] rounded-card px-4 py-[14px]">
            <p className="text-caption text-ink-sub leading-[1.65]">
              기관을 연결하면 자산정보 조회에 동의하게 돼요. 연결은 마이페이지에서 언제든 해제할 수 있어요.
            </p>
          </div>
        </div>
      </main>

      <StickyFooter>
        <Button disabled={!hasSelection} onClick={handleConnect}>
          {hasSelection ? `${selected.size}개 기관 연결하기` : '기관을 선택해주세요'}
        </Button>
      </StickyFooter>

      {/* 연결 완료 토스트 */}
      <div
        className={`absolute bottom-[14px] left-5 right-5 z-50 flex items-center gap-[9px] rounded-[13px] bg-[#23282f] px-4 py-[15px] shadow-float transition-all duration-300 ${
          showToast ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
        }`}
      >
        <div className="flex size-5 shrink-0 items-center justify-center rounded-[10px] bg-primary">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-sub font-semibold text-white">
          {selected.size}개 기관이 연결됐어요
        </span>
      </div>
    </div>
  )
}

export default AccountConnectPage
