import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import useGetSurvey from '@/survey/hooks/useGetSurvey'
import { formatWon } from '../common/utils/formatKrw'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'
import Checkbox from '../common/components/Checkbox'
import StepProgress from './components/StepProgress'
import useGetSalaryAssets from './hooks/useGetSalaryAssets'
import usePutSalaryAssetExclusions from './hooks/usePutSalaryAssetExclusions'
import { NavHomeIc } from '../common/assets/icons'
import type { SalaryAssetItem } from './types/paycheckPlan'

// 선택 가능(FREE) 판정 — 시스템 고정(정기예금·연금·개별주)이 아닌 자산만 사용자가 토글한다.
// 미상/누락(undefined)은 안전하게 선택 가능으로 본다(BE additive 하위호환).
const isSelectable = (item: SalaryAssetItem) =>
  item.deployability !== 'PINNED_SAFE' &&
  item.deployability !== 'RESTRICTED_PENSION' &&
  item.deployability !== 'EXCLUDED_STOCK'

function PaycheckAssetSelectPage() {
  const navigate = useNavigate()
  // 월급 설계 추천은 투자성향 설문이 선행돼야 한다. 미완료(404)면 설문으로 보낸다(#161).
  const { isLoading: isSurveyLoading, error: surveyError, refetch: refetchSurvey } = useGetSurvey()
  const surveyMissing = isAxiosError(surveyError) && surveyError.response?.status === 404
  // 설문이 정상 확인(200)된 뒤에만 자산을 조회한다(미완료/오류 시 선조회 방지).
  const surveyReady = !isSurveyLoading && !surveyError
  const { data, isLoading, isError } = useGetSalaryAssets({ enabled: surveyReady })
  const { mutate: saveExclusions, isPending } = usePutSalaryAssetExclusions()

  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())
  const [submitError, setSubmitError] = useState(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (surveyMissing) navigate('/survey', { replace: true })
  }, [surveyMissing, navigate])

  // 선택 가능(FREE) 자산만 초기 체크. 시스템 고정 자산은 토글 대상이 아니라 set에 넣지 않는다.
  useEffect(() => {
    if (!data || initialized.current) return
    initialized.current = true
    const includedKeys = data.assetGroups
      .flatMap((g) => g.items)
      .filter(isSelectable)
      .filter((item) => !item.excluded)
      .map((item) => item.assetKey)
    setCheckedIds(new Set(includedKeys))
  }, [data])

  const allItems = data?.assetGroups.flatMap((g) => g.items) ?? []
  // deployability 4계층 분기 — 연금(RESTRICTED_PENSION)은 미노출(별도 연금 트랙).
  const selectableItems = allItems.filter(isSelectable)
  const pinnedItems = allItems.filter((i) => i.deployability === 'PINNED_SAFE')
  const stockItems = allItems.filter((i) => i.deployability === 'EXCLUDED_STOCK')

  const selectableKeys = selectableItems.map((i) => i.assetKey)
  const allChecked = selectableKeys.length > 0 && selectableKeys.every((key) => checkedIds.has(key))

  const toggleAll = () => {
    setCheckedIds(allChecked ? new Set() : new Set(selectableKeys))
  }

  const toggleItem = (assetKey: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev)
      if (next.has(assetKey)) {
        next.delete(assetKey)
      } else {
        next.add(assetKey)
      }
      return next
    })
  }

  const handleSubmit = () => {
    // 시스템 고정 자산은 제외 대상에 넣지 않는다(끄면 연금 income 트랙만 손해 — FREE만 의미 있음).
    const excludedKeys = selectableKeys.filter((key) => !checkedIds.has(key))
    saveExclusions(
      { excludedAssetKeys: excludedKeys },
      {
        onSuccess: () => navigate('/paycheck-plan/diagnosis'),
        onError: () => setSubmitError(true),
      },
    )
  }

  // 설문 확인 중·미완료(설문으로 리다이렉트 중)엔 자산 화면을 띄우지 않는다.
  if (isSurveyLoading || surveyMissing) {
    return (
      <div role="status" aria-live="polite" className="flex flex-col h-dvh">
        <AppBar title="월급 만들기" onBack={() => navigate(-1)} rightAction={<HomeButton />} />
        <span className="sr-only">투자성향 설문 확인 중입니다.</span>
        <div className="flex-1 px-6 pt-6 flex flex-col gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-[64px] animate-pulse rounded-card bg-surface-muted" />
          ))}
        </div>
      </div>
    )
  }

  // 설문 상태 확인 실패(404 외 네트워크/서버 오류) — 게이트 우회 방지 위해 진행 차단·재시도 유도.
  if (surveyError) {
    return (
      <div className="flex flex-col h-dvh">
        <AppBar title="월급 만들기" onBack={() => navigate(-1)} rightAction={<HomeButton />} />
        <div className="flex-1 px-6 flex flex-col items-center justify-center gap-4">
          <p className="text-body text-ink-sub text-center">설문 상태를 확인하지 못했어요.</p>
          <button
            type="button"
            onClick={() => refetchSurvey()}
            className="rounded-btn border border-line px-5 py-2.5 text-body font-semibold text-ink"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  // 선택 가능한 자산이 하나도 없으면(예금·연금만 연결) 체크 없이도 진행 가능해야 한다.
  const submitDisabled =
    (selectableKeys.length > 0 && checkedIds.size === 0) || isLoading || isPending

  return (
    <div className="flex flex-col h-dvh">
      <AppBar title="월급 만들기" onBack={() => navigate(-1)} rightAction={<HomeButton />} />
      <StepProgress current={1} total={2} />

      <div className="flex-1 min-h-0 overflow-y-auto px-6">
        <h2 className="text-heading font-bold text-ink mb-1">
          어떤 자산으로
          <br />
          월급을 만들까요?
        </h2>
        <p className="text-body text-ink-sub mb-4">체크한 자산으로 매달 받을 월급을 설계해요.</p>

        <AssetGuide />

        {isLoading ? (
          <div className="flex flex-col gap-3 pt-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-[64px] animate-pulse rounded-card bg-surface-muted" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-body text-danger text-center pt-10">자산 목록을 불러오지 못했어요.</p>
        ) : allItems.length === 0 ? (
          <p className="text-body text-ink-hint text-center pt-10">연결된 자산이 없어요.</p>
        ) : (
          <>
            {/* ① 운용할 자산(FREE) — 사용자가 직접 고른다 */}
            {selectableItems.length > 0 && (
              <section>
                <div className="border-b border-divider py-4">
                  <Checkbox checked={allChecked} onChange={toggleAll} label="월급 만들 자산 전체 선택" />
                </div>
                <ul className="flex flex-col pb-2">
                  {selectableItems.map((item) => (
                    <SelectableRow
                      key={item.assetKey}
                      item={item}
                      checked={checkedIds.has(item.assetKey)}
                      onToggle={() => toggleItem(item.assetKey)}
                    />
                  ))}
                </ul>
              </section>
            )}

            {/* ② 그대로 두는 자산 — 정기예금(유지·기여 중)·개별주(성장 자산). 읽기 전용. */}
            {(pinnedItems.length > 0 || stockItems.length > 0) && (
              <section className="mt-6 pt-1">
                <p className="text-sub font-semibold text-ink-sub mb-1">그대로 두는 자산</p>
                <p className="text-caption text-ink-hint mb-3">
                  아래 자산은 성격상 월급 재료에서 자동으로 분류돼요. 선택하지 않아도 돼요.
                </p>
                <ul className="flex flex-col gap-2.5">
                  {pinnedItems.map((item) => (
                    <KeptRow
                      key={item.assetKey}
                      item={item}
                      chipLabel="유지"
                      chipClass="bg-success-bg text-success"
                      note="건드리지 않고 만기까지 안전 수익으로 월급에 기여하고 있어요."
                    />
                  ))}
                  {stockItems.map((item) => (
                    <KeptRow
                      key={item.assetKey}
                      item={item}
                      chipLabel="성장"
                      chipClass="bg-surface-muted text-ink-sub"
                      note="시세차익을 노리는 성장 자산이라 월급 재료에서 빠져요. 투자 건강검진에서 따로 살펴봐요."
                    />
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>

      <StickyFooter>
        {submitError && (
          <p className="text-sub text-danger text-center mb-3">저장에 실패했어요. 다시 시도해 주세요.</p>
        )}
        <Button onClick={handleSubmit} disabled={submitDisabled}>
          월급 설계하기
        </Button>
      </StickyFooter>
    </div>
  )
}

function CheckMark() {
  return (
    <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
      <path d="M1.5 5L5 8.5L11.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// 선택 가능(FREE) 자산 행 — 체크박스 토글.
function SelectableRow({
  item,
  checked,
  onToggle,
}: {
  item: SalaryAssetItem
  checked: boolean
  onToggle: () => void
}) {
  return (
    <li>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={onToggle}
        className="flex items-center gap-3 text-left w-full py-3"
      >
        <span
          className={`shrink-0 size-6 rounded-[6px] flex items-center justify-center transition-colors ${
            checked ? 'bg-primary' : 'bg-white border-2 border-line'
          }`}
        >
          {checked && <CheckMark />}
        </span>
        <span className="flex items-center justify-between flex-1 min-w-0 gap-2">
          <span className="min-w-0">
            <span className="block text-body text-ink truncate">{item.name}</span>
            {item.description && (
              <span className="block text-caption text-ink-hint line-clamp-2">{item.description}</span>
            )}
          </span>
          <span className={`font-inter text-md font-semibold shrink-0 ${checked ? 'text-ink' : 'text-ink-sub'}`}>
            {formatWon(item.amount)}
          </span>
        </span>
      </button>
    </li>
  )
}

// 시스템 고정 자산 행 — 읽기 전용. 토글 없이 "왜 못 고르는지" 뉘앙스 칩+설명만.
function KeptRow({
  item,
  chipLabel,
  chipClass,
  note,
}: {
  item: SalaryAssetItem
  chipLabel: string
  chipClass: string
  note: string
}) {
  return (
    <li className="rounded-card bg-surface p-4">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="flex items-center gap-2 min-w-0">
          <span className={`shrink-0 rounded-badge px-1.5 py-0.5 text-caption font-semibold ${chipClass}`}>
            {chipLabel}
          </span>
          <span className="text-body font-medium text-ink-sub truncate">{item.name}</span>
        </span>
        <span className="font-inter text-md font-semibold text-ink-sub shrink-0">{formatWon(item.amount)}</span>
      </div>
      <p className="text-caption text-ink-hint leading-relaxed">{note}</p>
    </li>
  )
}

// 월급 재료 개념 안내 — 포함/제외가 결과에 어떻게 반영되는지 설명(#280)
function AssetGuide() {
  return (
    <div className="rounded-card bg-surface-muted p-4 mb-5">
      <p className="text-body font-semibold text-ink mb-2.5">월급 재료가 뭔가요?</p>
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <GuideMark variant="include" />
          <p className="text-sub text-ink-sub leading-relaxed">
            <span className="font-semibold text-ink">체크한 자산</span>을 활용해서 매달 월급(분배금·배당)을 만들어요.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <GuideMark variant="exclude" />
          <p className="text-sub text-ink-sub leading-relaxed">
            <span className="font-semibold text-ink">뺀 자산</span>은 건드리지 않고 그대로 둬요.
          </p>
        </div>
      </div>
      <p className="text-caption text-ink-hint mt-2.5 pt-2.5 border-t border-divider">
        정기예금·개별주·연금은 성격에 맞게 자동으로 분류돼요.
      </p>
    </div>
  )
}

function HomeButton() {
  const navigate = useNavigate()
  return (
    <button type="button" onClick={() => navigate('/home')} aria-label="홈으로" className="text-ink-sub">
      <NavHomeIc width={22} height={22} />
    </button>
  )
}

function GuideMark({ variant }: { variant: 'include' | 'exclude' }) {
  const include = variant === 'include'
  return (
    <span
      aria-hidden="true"
      className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full ${
        include ? 'bg-primary' : 'bg-line'
      }`}
    >
      {include ? (
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.5L3.3 5.8L8 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="7" height="2" viewBox="0 0 7 2" fill="none">
          <path d="M1 1H6" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )}
    </span>
  )
}

export default PaycheckAssetSelectPage
