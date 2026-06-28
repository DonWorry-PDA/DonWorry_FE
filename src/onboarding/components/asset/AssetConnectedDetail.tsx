import { useMemo, useState, useCallback } from 'react'
import useGetConnectedInstitutions from '@/mypage/hooks/useGetConnectedInstitutions'
import useGetMydataInstitutions from '@/mypage/hooks/useGetMydataInstitutions'
import type { ConnectedInstitution } from '@/mypage/types/mypage'
import LOGO_MAP, { getLogoByName } from '@/mypage/utils/institutionLogos'

interface Props {
  onClose: () => void
}

function AssetConnectedDetail({ onClose }: Props) {
  // 목록·카운트는 단일 출처(BE #211)에서 한 번에 받는다 → 카운트와 리스트가 항상 정합.
  const { data, isPending, isError } = useGetConnectedInstitutions()
  // 카탈로그는 로고 이미지 해석(기관명 → id → LOGO_MAP)에만 쓰는 best-effort 소스.
  // 미도착·미매칭이면 brandColor+label 폴백 배지로 떨어지므로 목록 렌더를 막지 않는다.
  const { data: catalog } = useGetMydataInstitutions()

  const logoByName = useMemo(() => {
    const map: Record<string, string> = {}
    for (const inst of catalog ?? []) {
      const logo = LOGO_MAP[inst.id]
      if (logo) map[inst.name] = logo
    }
    return map
  }, [catalog])

  const institutions = data?.institutions ?? []
  const count = data?.connectedInstitutionCount ?? 0

  return (
    <div className="flex h-dvh flex-col bg-white">
      {/* AppBar */}
      <div className="flex items-center justify-between px-6 pt-12 pb-4">
        <h2 className="text-card font-bold text-ink">자산 연결 결과</h2>
        <button type="button" onClick={onClose} aria-label="닫기" className="text-ink">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col items-center px-6 pt-6">
        {/* 체크 아이콘 */}
        <div className="flex size-14 items-center justify-center rounded-full bg-primary">
          <svg width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true">
            <path d="M2 9L8.5 15.5L22 2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="mt-4 text-heading font-bold text-ink">자산정보 연결결과</h1>

        {/* 요약 — 카드·보험·연금이 포함되므로 '자산' 대신 '금융기관'으로 표기 */}
        <div className="mt-4 flex w-full items-center gap-2">
          <span className="rounded-badge border border-primary px-2.5 py-0.5 text-sub font-bold text-primary">
            마이데이터
          </span>
          <p className="text-body text-ink">
            {isPending ? (
              <span className="inline-block h-4 w-6 animate-pulse rounded bg-surface-muted align-middle" />
            ) : isError ? (
              '연결 기관 수를 확인하지 못했어요.'
            ) : (
              <>
                <span className="font-bold text-primary">{count}</span>개 금융기관을 연결했어요.
              </>
            )}
          </p>
        </div>

        <div className="mt-3 w-full border-b border-line" />
      </div>

      {/* 기관 목록 */}
      {isPending ? (
        <ul className="flex-1 overflow-y-auto px-6">
          {[...Array(3)].map((_, i) => (
            <li key={i} className="flex items-center gap-4 border-b border-divider py-4">
              <div className="size-10 shrink-0 animate-pulse rounded-full bg-surface-muted" />
              <div className="h-4 flex-1 animate-pulse rounded bg-surface-muted" />
            </li>
          ))}
        </ul>
      ) : isError ? (
        <p className="flex-1 px-6 py-6 text-sub text-ink-hint">연결 기관 정보를 불러오지 못했어요</p>
      ) : institutions.length === 0 ? (
        <p className="flex-1 px-6 py-6 text-sub text-ink-hint">연결된 금융기관이 없어요</p>
      ) : (
        <ul className="flex-1 overflow-y-auto px-6">
          {institutions.map((inst) => (
            <InstitutionRow key={inst.name} institution={inst} logo={logoByName[inst.name] ?? getLogoByName(inst.name)} />
          ))}
        </ul>
      )}
    </div>
  )
}

function InstitutionRow({
  institution,
  logo,
}: {
  institution: ConnectedInstitution
  logo?: string
}) {
  const [imgFailed, setImgFailed] = useState(false)
  const handleError = useCallback(() => setImgFailed(true), [])
  const isConnected = institution.status === 'CONNECTED'

  return (
    <li className="flex items-center gap-4 border-b border-divider py-4">
      {logo && !imgFailed ? (
        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
          <img src={logo} alt={institution.name} className="size-8 object-contain" onError={handleError} />
        </div>
      ) : (
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: institution.brandColor }}
        >
          <span className="text-caption font-bold" style={{ color: institution.labelColor }}>
            {institution.label}
          </span>
        </div>
      )}

      <span className="min-w-0 flex-1 truncate text-body font-medium text-ink">{institution.name}</span>

      <span className={`shrink-0 text-sub ${isConnected ? 'text-success' : 'text-danger'}`}>
        {isConnected ? '연결됨' : '오류'}
      </span>
    </li>
  )
}

export default AssetConnectedDetail
