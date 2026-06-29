import { useState } from 'react'
import { formatWon } from '../../common/utils/formatKrw'
import type { SalaryAssetGroup } from '../types/paycheckPlan'

type AssetGroupAccordionProps = {
  group: SalaryAssetGroup
  checkedIds: Set<string>
  onToggleItem: (assetKey: string) => void
  onToggleGroup: (category: string) => void
}

function CheckMark() {
  return (
    <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
      <path
        d="M1.5 5L5 8.5L11.5 1.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckBox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`shrink-0 size-6 rounded-[6px] flex items-center justify-center transition-colors ${
        checked ? 'bg-primary' : 'bg-white border-2 border-line'
      }`}
    >
      {checked && <CheckMark />}
    </span>
  )
}

function AssetGroupAccordion({ group, checkedIds, onToggleItem, onToggleGroup }: AssetGroupAccordionProps) {
  const [open, setOpen] = useState(true)

  const allChecked = group.items.every((item) => checkedIds.has(item.assetKey))

  return (
    <div className="border-b border-divider">
      <div className="flex items-center justify-between py-4">
        <button
          type="button"
          role="checkbox"
          aria-checked={allChecked}
          aria-label={group.categoryLabel}
          onClick={() => onToggleGroup(group.category)}
          className="flex items-center gap-3 text-left"
        >
          <CheckBox checked={allChecked} />
          <span className="text-md font-semibold text-ink">{group.categoryLabel}</span>
        </button>
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
        <div className="pb-3 pl-9 flex flex-col">
          {group.items.map((item) => {
            const checked = checkedIds.has(item.assetKey)
            return (
              <button
                key={item.assetKey}
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => onToggleItem(item.assetKey)}
                className={`flex items-center gap-3 text-left w-full py-2.5 transition-opacity ${
                  checked ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <CheckBox checked={checked} />
                <span className="flex flex-col gap-0.5">
                  <span className="text-body font-medium text-ink">{item.name}</span>
                  <span className="font-inter text-md font-semibold text-ink">{formatWon(item.amount)}</span>
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AssetGroupAccordion
