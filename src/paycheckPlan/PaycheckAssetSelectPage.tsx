import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import Checkbox from '../common/components/Checkbox'
import StepProgress from './components/StepProgress'
import AssetGroupAccordion from './components/AssetGroupAccordion'
import { mockAssetCategories } from './mock/paycheckPlan'

const allItemIds = mockAssetCategories.flatMap((c) => c.items.map((i) => i.id))

function PaycheckAssetSelectPage() {
  const navigate = useNavigate()
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set(allItemIds))

  const allChecked = allItemIds.every((id) => checkedIds.has(id))

  const toggleAll = () => {
    if (allChecked) {
      setCheckedIds(new Set())
    } else {
      setCheckedIds(new Set(allItemIds))
    }
  }

  const toggleItem = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleGroup = (categoryId: string) => {
    const category = mockAssetCategories.find((c) => c.id === categoryId)
    if (!category) return
    const groupIds = category.items.map((i) => i.id)
    setCheckedIds((prev) => {
      const groupAllChecked = groupIds.every((id) => prev.has(id))
      const next = new Set(prev)
      groupIds.forEach((id) => (groupAllChecked ? next.delete(id) : next.add(id)))
      return next
    })
  }

  return (
    <div className="flex flex-col h-full">
      <AppBar title="월급 만들기" onBack={() => navigate(-1)} />
      <StepProgress current={1} total={2} />

      <div className="flex-1 overflow-y-auto px-5">
        <h2 className="text-heading font-bold text-ink mb-1">
          월급 재료로 쓰지 않을
          <br />
          자산을 빼주세요
        </h2>
        <p className="text-body text-ink-sub mb-6">연금 계좌나 오래 두고 싶은 자산은 그대로 지켜드려요.</p>

        <div className="border-b border-divider py-4">
          <Checkbox checked={allChecked} onChange={toggleAll} label="전체 선택" />
        </div>

        {mockAssetCategories.map((category) => (
          <AssetGroupAccordion
            key={category.id}
            category={category}
            checkedIds={checkedIds}
            onToggleItem={toggleItem}
            onToggleGroup={toggleGroup}
          />
        ))}
      </div>

      <div className="px-5 py-4 shrink-0">
        <Button
          onClick={() => navigate('/paycheck-plan/diagnosis')}
          disabled={checkedIds.size === 0}
        >
          월급 설계하기
        </Button>
      </div>
    </div>
  )
}

export default PaycheckAssetSelectPage
