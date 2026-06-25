import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'
import Checkbox from '../common/components/Checkbox'
import StepProgress from './components/StepProgress'
import AssetGroupAccordion from './components/AssetGroupAccordion'
import useGetSalaryAssets from './hooks/useGetSalaryAssets'
import usePutSalaryAssetExclusions from './hooks/usePutSalaryAssetExclusions'

function PaycheckAssetSelectPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useGetSalaryAssets()
  const { mutate: saveExclusions, isPending } = usePutSalaryAssetExclusions()

  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())
  const [submitError, setSubmitError] = useState(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (!data || initialized.current) return
    initialized.current = true
    const includedKeys = data.assetGroups
      .flatMap((g) => g.items)
      .filter((item) => !item.excluded)
      .map((item) => item.assetKey)
    setCheckedIds(new Set(includedKeys))
  }, [data])

  const allItemKeys = data?.assetGroups.flatMap((g) => g.items.map((i) => i.assetKey)) ?? []
  const allChecked = allItemKeys.length > 0 && allItemKeys.every((key) => checkedIds.has(key))

  const toggleAll = () => {
    if (allChecked) {
      setCheckedIds(new Set())
    } else {
      setCheckedIds(new Set(allItemKeys))
    }
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

  const toggleGroup = (category: string) => {
    const group = data?.assetGroups.find((g) => g.category === category)
    if (!group) return
    const groupKeys = group.items.map((i) => i.assetKey)
    setCheckedIds((prev) => {
      const groupAllChecked = groupKeys.every((key) => prev.has(key))
      const next = new Set(prev)
      groupKeys.forEach((key) => (groupAllChecked ? next.delete(key) : next.add(key)))
      return next
    })
  }

  const handleSubmit = () => {
    const excludedKeys = allItemKeys.filter((key) => !checkedIds.has(key))
    saveExclusions(
      { excludedAssetKeys: excludedKeys },
      {
        onSuccess: () => navigate('/paycheck-plan/diagnosis'),
        onError: () => setSubmitError(true),
      },
    )
  }

  return (
    <div className="flex flex-col h-full">
      <AppBar title="월급 만들기" onBack={() => navigate(-1)} />
      <StepProgress current={1} total={2} />

      <div className="flex-1 overflow-y-auto px-6">
        <h2 className="text-heading font-bold text-ink mb-1">
          월급 재료로 쓰지 않을
          <br />
          자산을 빼주세요
        </h2>
        <p className="text-body text-ink-sub mb-6">연금 계좌나 오래 두고 싶은 자산은 그대로 지켜드려요.</p>

        {isLoading ? (
          <div className="flex flex-col gap-3 pt-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-[64px] animate-pulse rounded-card bg-surface-muted" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-body text-danger text-center pt-10">자산 목록을 불러오지 못했어요.</p>
        ) : data?.assetGroups.length === 0 ? (
          <p className="text-body text-ink-hint text-center pt-10">연결된 자산이 없어요.</p>
        ) : (
          <>
            <div className="border-b border-divider py-4">
              <Checkbox checked={allChecked} onChange={toggleAll} label="전체 선택" />
            </div>

            {data?.assetGroups.map((group) => (
              <AssetGroupAccordion
                key={group.category}
                group={group}
                checkedIds={checkedIds}
                onToggleItem={toggleItem}
                onToggleGroup={toggleGroup}
              />
            ))}
          </>
        )}
      </div>

      <StickyFooter>
        {submitError && (
          <p className="text-sub text-danger text-center mb-3">저장에 실패했어요. 다시 시도해 주세요.</p>
        )}
        <Button
          onClick={handleSubmit}
          disabled={checkedIds.size === 0 || isLoading || isPending}
        >
          월급 설계하기
        </Button>
      </StickyFooter>
    </div>
  )
}

export default PaycheckAssetSelectPage
