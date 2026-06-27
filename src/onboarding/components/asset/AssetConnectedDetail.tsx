import { useState, useCallback } from 'react'
import useGetMydataInstitutions from '@/mypage/hooks/useGetMydataInstitutions'
import useGetMydataInstitutionCount from '@/mypage/hooks/useGetMydataInstitutionCount'
import type { MydataInstitution } from '@/mypage/types/mypage'
import LOGO_MAP from '@/mypage/utils/institutionLogos'

interface Props {
  onClose: () => void
}

function AssetConnectedDetail({ onClose }: Props) {
  const { data: institutions, isPending, isError } = useGetMydataInstitutions()
  const { data: institutionCount, isPending: isCountPending } = useGetMydataInstitutionCount()

  const connected = (institutions ?? []).filter((i) => i.connected)
  // 연결 기관 수는 BE의 단일 출처(connected-count)를 우선 쓰고, 미도착 시 목록 길이로 채운다.
  const count = institutionCount ?? connected.length
  // 두 쿼리가 모두 도착하기 전에는 0이 잠깐 노출되므로 숫자를 스켈레톤으로 가린다.
  const isCountReady = !isPending && !isCountPending

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

        {/* 요약 */}
        <div className="mt-4 flex w-full items-center gap-2">
          <span className="rounded-badge border border-primary px-2.5 py-0.5 text-sub font-bold text-primary">
            마이데이터
          </span>
          <p className="text-body text-ink">
            {isCountReady ? (
              <span className="font-bold text-primary">{count}</span>
            ) : (
              <span className="inline-block h-4 w-6 animate-pulse rounded bg-surface-muted align-middle" />
            )}
            개 기관의 자산을 연결했어요.
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
      ) : (
        <ul className="flex-1 overflow-y-auto px-6">
          {connected.map((inst) => (
            <InstitutionRow key={inst.id} institution={inst} />
          ))}
        </ul>
      )}
    </div>
  )
}

function InstitutionRow({ institution }: { institution: MydataInstitution }) {
  const [imgFailed, setImgFailed] = useState(false)
  const handleError = useCallback(() => setImgFailed(true), [])
  const logo = LOGO_MAP[institution.id]

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

      <span className="flex-1 text-body font-medium text-ink">{institution.name}</span>

      <span className="text-sub text-success">연결됨</span>
    </li>
  )
}

export default AssetConnectedDetail
