import { useState } from 'react'
import Checkbox from '../../common/components/Checkbox'
import type { SalaryAssetGroup } from '../types/paycheckPlan'

type AssetGroupAccordionProps = {
  group: SalaryAssetGroup
  checkedIds: Set<string>
  onToggleItem: (assetKey: string) => void
  onToggleGroup: (category: string) => void
}

function AssetGroupAccordion({ group, checkedIds, onToggleItem, onToggleGroup }: AssetGroupAccordionProps) {
  const [open, setOpen] = useState(true)

  const allChecked = group.items.every((item) => checkedIds.has(item.assetKey))

  return (
    <div className="border-b border-divider">
      <div className="flex items-center justify-between py-4">
        <Checkbox
          checked={allChecked}
          onChange={() => onToggleGroup(group.category)}
          label={group.categoryLabel}
        />
        <button type="button" onClick={() => setOpen((o) => !o)} aria-label={open ? '접기' : '펼치기'} className="p-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={`text-ink-hint transition-transform ${open ? 'rotate-180' : ''}`}
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="pb-2 pl-9 flex flex-col gap-3">
          {group.items.map((item) => (
            <Checkbox
              key={item.assetKey}
              checked={checkedIds.has(item.assetKey)}
              onChange={() => onToggleItem(item.assetKey)}
              label={item.name}
              subLabel={item.description || undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default AssetGroupAccordion
