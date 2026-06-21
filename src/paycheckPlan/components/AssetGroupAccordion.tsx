import { useState } from 'react'
import Checkbox from '../../common/components/Checkbox'
import type { AssetCategory } from '../types/paycheckPlan'

type AssetGroupAccordionProps = {
  category: AssetCategory
  checkedIds: Set<string>
  onToggleItem: (id: string) => void
  onToggleGroup: (categoryId: string) => void
}

function AssetGroupAccordion({ category, checkedIds, onToggleItem, onToggleGroup }: AssetGroupAccordionProps) {
  const [open, setOpen] = useState(true)

  const allChecked = category.items.every((item) => checkedIds.has(item.id))
  const someChecked = category.items.some((item) => checkedIds.has(item.id))

  return (
    <div className="border-b border-divider">
      <div className="flex items-center justify-between py-4">
        <Checkbox
          checked={allChecked || someChecked}
          onChange={() => onToggleGroup(category.id)}
          label={category.name}
        />
        <button onClick={() => setOpen((o) => !o)} aria-label={open ? '접기' : '펼치기'} className="p-1">
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
          {category.items.map((item) => (
            <Checkbox
              key={item.id}
              checked={checkedIds.has(item.id)}
              onChange={() => onToggleItem(item.id)}
              label={item.name}
              subLabel={item.subLabel || undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default AssetGroupAccordion
