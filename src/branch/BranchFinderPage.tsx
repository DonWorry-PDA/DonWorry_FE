import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AppBar from '@/common/components/AppBar'
import Button from '@/common/components/Button'
import StickyFooter from '@/common/components/StickyFooter'
import type { ConsultContext } from '@/paycheckPlan/constants/consultContext'
import useGeolocation from './hooks/useGeolocation'
import useGetNearbyBranches from './hooks/useGetNearbyBranches'
import { formatBranchName } from './utils/formatBranchName'
import { formatDistance } from './utils/formatDistance'
import type { Institution, NearbyBranch } from './types/branch'

// 탭 없이 두 기관을 한 리스트에 병합한다. 응답 본문엔 기관 구분이 없어 조회 시점의
// institution을 함께 들고 다니며(표시명 정규화·중복 id 구분용), 거리 오름차순으로 다시 정렬한다.
type MergedBranch = NearbyBranch & { institution: Institution }

// 기관별 id가 겹칠 수 있어 병합 리스트의 키는 기관+id 조합으로 만든다.
const branchKey = (b: MergedBranch) => `${b.institution}-${b.id}`

type LocationState = {
  context?: ConsultContext
  planId?: string | number | null
  // 진입점별 분기: 목적별 통장→SHINHAN_BANK, 월급 만들기·연금→SHINHAN_SECURITIES.
  // 없으면(직접 진입) 두 기관을 모두 보여준다.
  institution?: Institution
}

function BranchFinderPage() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state: LocationState | null }
  const { coords, status: geoStatus, request: requestLocation } = useGeolocation()

  const [query, setQuery] = useState('')
  const [pickedKey, setPickedKey] = useState<string | null>(null)

  // 진입점이 기관을 지정하면 그 기관만, 아니면 둘 다 조회·표시한다.
  const wantBank = state?.institution !== 'SHINHAN_SECURITIES'
  const wantSecurities = state?.institution !== 'SHINHAN_BANK'

  const bank = useGetNearbyBranches({
    lat: coords?.lat,
    lng: coords?.lng,
    institution: 'SHINHAN_BANK',
    enabled: wantBank,
  })
  const securities = useGetNearbyBranches({
    lat: coords?.lat,
    lng: coords?.lng,
    institution: 'SHINHAN_SECURITIES',
    enabled: wantSecurities,
  })

  const merged = useMemo<MergedBranch[]>(() => {
    const tag = (list: NearbyBranch[] | undefined, institution: Institution) =>
      (list ?? []).map((b) => ({ ...b, institution }))
    return [
      ...(wantBank ? tag(bank.data, 'SHINHAN_BANK') : []),
      ...(wantSecurities ? tag(securities.data, 'SHINHAN_SECURITIES') : []),
    ].sort((a, b) => a.distanceMeters - b.distanceMeters)
  }, [bank.data, securities.data, wantBank, wantSecurities])

  const filtered = useMemo(() => {
    if (!query) return merged
    // placeholder가 "지점명·지역 검색"을 안내하므로 region(지역명)도 매칭 대상에 포함한다.
    return merged.filter(
      (b) => b.name.includes(query) || b.address.includes(query) || !!b.region?.includes(query),
    )
  }, [merged, query])

  const isLoading = (wantBank && bank.isLoading) || (wantSecurities && securities.isLoading)
  // 한쪽만 성공하면 그 결과를 보여주되, 한쪽이라도 실패했는데 보여줄 데이터가 없으면
  // "지점 없음"이 아니라 오류(재시도)로 본다 — 부분 실패를 빈 결과로 오인하지 않도록.
  const isError =
    ((wantBank && bank.isError) || (wantSecurities && securities.isError)) && merged.length === 0

  // 사용자가 고른 항목이 현재 목록에 있으면 그걸, 없으면(초기·검색으로 사라짐) 가장 가까운
  // 첫 항목을 기본 선택으로 본다. effect 없이 렌더 시 파생해 동기화 비용을 없앤다.
  const selectedKey =
    pickedKey && filtered.some((b) => branchKey(b) === pickedKey)
      ? pickedKey
      : filtered.length > 0
        ? branchKey(filtered[0])
        : null

  const handleConfirm = () => {
    const selected = filtered.find((b) => branchKey(b) === selectedKey)
    if (!selected) return
    // 예약 POST가 쓸 실 DB id(branchId)와 표시 필드(name·address·distance), 기관 구분(institution)을
    // 함께 넘긴다. 합성키(branchKey)는 목록 선택용일 뿐, 다음 화면엔 숫자 branchId만 전달한다.
    navigate('/paycheck-plan/consult', {
      state: {
        ...state,
        branch: {
          branchId: selected.id,
          institution: selected.institution,
          name: formatBranchName(selected.name, selected.institution),
          address: selected.address,
          distance: formatDistance(selected.distanceMeters),
        },
      },
    })
  }

  return (
    <div className="flex h-dvh flex-col">
      <AppBar title="지점 선택" onBack={() => navigate(-1)} />

      {/* 검색바 — 고정 영역 */}
      <div className="shrink-0 px-5 pb-3 pt-3">
        <div className="flex h-12 items-center gap-2.5 rounded-[13px] bg-canvas px-3.5">
          <svg width="17" height="18" fill="none" viewBox="0 0 17 18" className="shrink-0 text-ink-hint">
            <circle cx="7.5" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11.5 13l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="지점명·지역 검색 (예: 서소문, 강남)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-[13.9px] text-ink outline-none placeholder:text-ink-hint"
          />
        </div>
      </div>

      <Body
        geoStatus={geoStatus}
        onRetryLocation={requestLocation}
        isLoading={isLoading}
        isError={isError}
        onRetryFetch={() => {
          bank.refetch()
          securities.refetch()
        }}
        branches={filtered}
        selectedKey={selectedKey}
        onSelect={setPickedKey}
      />

      <StickyFooter>
        <Button onClick={handleConfirm} disabled={!selectedKey}>
          선택한 지점으로 예약
        </Button>
      </StickyFooter>
    </div>
  )
}

type BodyProps = {
  geoStatus: ReturnType<typeof useGeolocation>['status']
  onRetryLocation: () => void
  isLoading: boolean
  isError: boolean
  onRetryFetch: () => void
  branches: MergedBranch[]
  selectedKey: string | null
  onSelect: (key: string) => void
}

function Body({
  geoStatus,
  onRetryLocation,
  isLoading,
  isError,
  onRetryFetch,
  branches,
  selectedKey,
  onSelect,
}: BodyProps) {
  // 1) 위치 권한/획득 단계
  if (geoStatus === 'prompting') {
    return <SkeletonList caption="현재 위치를 확인하고 있어요" />
  }
  // 미지원(unavailable)은 재시도해도 성공할 수 없으므로 안내만, 나머지(denied·일시 오류)는 재시도 동선 제공.
  if (geoStatus === 'unavailable') {
    return <Centered message="이 기기에서는 위치 정보를 사용할 수 없어요." />
  }
  if (geoStatus !== 'granted') {
    const message =
      geoStatus === 'denied'
        ? '위치 권한이 꺼져 있어요. 권한을 허용하면 가까운 지점을 찾아드려요.'
        : '위치를 가져오지 못했어요. 잠시 후 다시 시도해 주세요.'
    return <Centered message={message} actionLabel="위치 다시 시도" onAction={onRetryLocation} />
  }

  // 2) 지점 조회 단계 (좌표 확보됨)
  if (isLoading) {
    return <SkeletonList caption="가까운 지점을 찾고 있어요" />
  }
  if (isError) {
    return (
      <Centered
        message="지점을 불러오지 못했어요. 잠시 후 다시 시도해 주세요."
        actionLabel="다시 시도"
        onAction={onRetryFetch}
      />
    )
  }
  if (branches.length === 0) {
    return <Centered message="주변에 지점이 없어요." />
  }

  // 3) 결과 리스트
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="px-5 pb-2 pt-1 text-sub text-ink-hint">가까운 순 · {branches.length}곳</div>
      <ul>
        {branches.map((branch) => {
          const key = branchKey(branch)
          const selected = selectedKey === key
          return (
            <li key={key} className="border-t border-divider">
              <button
                className="flex w-full items-start gap-3 px-5 py-4 text-left"
                onClick={() => onSelect(key)}
                aria-pressed={selected}
              >
                {/* 지점 아이콘 */}
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[11px] bg-[#edf2ff]">
                  <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
                    <path
                      d="M9 2C6.24 2 4 4.24 4 7c0 3.93 5 9 5 9s5-5.07 5-9c0-2.76-2.24-5-5-5z"
                      stroke="#0046ff"
                      strokeWidth="1.3"
                    />
                    <circle cx="9" cy="7" r="1.75" fill="#0046ff" />
                  </svg>
                </div>

                {/* 지점 정보 — 뱃지 대신 표시명에 기관을 녹여 한 줄로 보여준다. */}
                <div className="min-w-0 flex-1">
                  <p className="mb-0.5 text-[14.5px] font-bold text-ink">
                    {formatBranchName(branch.name, branch.institution)}
                  </p>
                  <p className="mb-0.5 text-[12.2px] text-ink-sub">{branch.address}</p>
                  {branch.region && <span className="text-[11.7px] text-ink-hint">{branch.region}</span>}
                </div>

                {/* 거리 + 선택 버튼 */}
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="text-[12.6px] font-extrabold text-primary">
                    {formatDistance(branch.distanceMeters)}
                  </span>
                  <div
                    className={`flex size-6 items-center justify-center rounded-full ${
                      selected ? 'bg-primary' : 'border-2 border-[#d6dce3]'
                    }`}
                  >
                    {selected && (
                      <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
                        <path
                          d="M3 7l3 3 5-5"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function SkeletonList({ caption }: { caption: string }) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="px-5 pb-2 pt-1 text-sub text-ink-hint">{caption}</div>
      <ul>
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className="border-t border-divider px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="size-9 shrink-0 animate-pulse rounded-[11px] bg-surface-muted" />
              <div className="flex-1">
                <div className="mb-2 h-4 w-32 animate-pulse rounded bg-surface-muted" />
                <div className="mb-2 h-3 w-48 animate-pulse rounded bg-surface-muted" />
                <div className="h-3 w-20 animate-pulse rounded bg-surface-muted" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Centered({
  message,
  actionLabel,
  onAction,
}: {
  message: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-8 text-center">
      <p className="text-body text-ink-sub">{message}</p>
      {actionLabel && onAction && (
        <div className="mt-5 w-full max-w-[220px]">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  )
}

export default BranchFinderPage
