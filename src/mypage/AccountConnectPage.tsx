import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'
import useGetMydataInstitutions from './hooks/useGetMydataInstitutions'
import usePostMydataInstitutionConnect from './hooks/usePostMydataInstitutionConnect'
import type { MydataInstitution } from './types/mypage'
import LOGO_MAP from './utils/institutionLogos'

function InstitutionBadge({
  id,
  label,
  brandColor,
  labelColor,
}: Pick<MydataInstitution, 'id' | 'label' | 'brandColor' | 'labelColor'>) {
  const [imgFailed, setImgFailed] = useState(false)
  const logo = LOGO_MAP[id]

  const handleError = useCallback(() => setImgFailed(true), [])

  if (logo && !imgFailed) {
    return (
      <div className="flex size-[42px] shrink-0 items-center justify-center rounded-[12px] bg-white overflow-hidden">
        <img src={logo} alt={label} className="size-9 object-contain" onError={handleError} />
      </div>
    )
  }
  return (
    <div
      className="flex size-[42px] shrink-0 items-center justify-center rounded-[12px]"
      style={{ background: brandColor }}
    >
      <span className="text-sub font-extrabold" style={{ color: labelColor }}>
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

  const { data: institutions, isPending: isLoadingInstitutions, isError: isInstitutionsError } = useGetMydataInstitutions()
  const { mutate: connectInstitutions, isPending } = usePostMydataInstitutionConnect()

  const connectedList = (institutions ?? []).filter((i) => i.connected)

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const available = (institutions ?? []).filter((i) => !i.connected && i.name.toLowerCase().includes(q))
    return {
      banks: available.filter((i) => i.type === 'bank'),
      securities: available.filter((i) => i.type === 'securities'),
    }
  }, [query, institutions])

  const hasSelection = selected.size > 0

  const handleConnect = () => {
    connectInstitutions([...selected], {
      onSuccess: () => {
        setShowToast(true)
        timerRef.current = setTimeout(() => navigate('/mypage', { replace: true }), 2000)
      },
    })
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
        {connectedList.length > 0 && (
          <div className="px-6 pt-5 flex flex-col gap-0.5">
            <p className="text-caption font-semibold text-ink-hint">이미 연결된 기관</p>
            {connectedList.map((inst) => (
              <div key={inst.id} className="flex items-center gap-3 py-[14px]">
                <InstitutionBadge
                  id={inst.id}
                  label={inst.label}
                  brandColor={inst.brandColor}
                  labelColor={inst.labelColor}
                />
                <div className="flex flex-1 min-w-0 flex-col gap-0.5">
                  <p className="text-body font-bold text-ink">{inst.name}</p>
                  <p className="text-caption font-medium text-ink-hint">
                    {inst.accountNumbers?.join(' · ')} 연동 중
                  </p>
                </div>
                <span className="bg-success-bg text-success text-caption font-bold px-[9px] py-[3px] rounded-badge shrink-0">
                  연결됨
                </span>
              </div>
            ))}
          </div>
        )}

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
                  <InstitutionBadge
                    id={bank.id}
                    label={bank.label}
                    brandColor={bank.brandColor}
                    labelColor={bank.labelColor}
                  />
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
                  <InstitutionBadge
                    id={sec.id}
                    label={sec.label}
                    brandColor={sec.brandColor}
                    labelColor={sec.labelColor}
                  />
                  <p className="flex-1 min-w-0 text-body font-bold text-ink">{sec.name}</p>
                  <SelectCircle selected={selected.has(sec.id)} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 로딩 / 에러 / 빈 결과 */}
        {isLoadingInstitutions ? (
          <div className="flex flex-col gap-3 px-6 pt-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-[14px]">
                <div className="size-[42px] shrink-0 animate-pulse rounded-[12px] bg-surface-muted" />
                <div className="h-4 flex-1 animate-pulse rounded bg-surface-muted" />
              </div>
            ))}
          </div>
        ) : isInstitutionsError ? (
          <div className="flex flex-col items-center gap-2 py-10">
            <p className="text-md font-medium text-ink">기관 목록을 불러오지 못했어요</p>
            <p className="text-sub text-ink-hint">잠시 후 다시 시도해주세요</p>
          </div>
        ) : filtered.banks.length === 0 && filtered.securities.length === 0 && (
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
        <Button disabled={!hasSelection || isPending} onClick={handleConnect}>
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
