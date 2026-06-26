import { CATEGORY_STYLE } from '../eventCategory'
import type { TransactionItem } from '../types/calendar'
import { formatSignedWon } from '../utils/monthGrid'

type Props = {
  items: TransactionItem[]
}

function TransactionList({ items }: Props) {
  return (
    <section className="border-t border-track pt-[15px]">
      <h2 className="text-body font-bold text-ink">입출금/거래 내역</h2>

      {items.length === 0 ? (
        <p className="py-8 text-center text-sub text-ink-hint">거래 내역이 없어요</p>
      ) : (
        <ul className="pt-1">
          {items.map((item) => {
            const style = CATEGORY_STYLE[item.category] ?? CATEGORY_STYLE['transaction']
            // 수입(+) 파랑 · 지출(−) 빨강으로 입출 방향을 명확히
            const amountColor = item.amountKrw < 0 ? 'text-danger' : 'text-primary'
            return (
              <li
                key={item.id}
                className="flex items-center gap-3 border-b border-divider py-[13px] last:border-b-0"
              >
                <span
                  className={`flex size-[34px] shrink-0 items-center justify-center rounded-full ${style.iconBg}`}
                >
                  <span className={`text-body ${style.text}`}>₩</span>
                </span>
                <div className="flex min-w-0 flex-1">
                  <span className="truncate text-body text-ink">{item.title}</span>
                </div>
                <span className={`text-body font-bold ${amountColor}`}>
                  {formatSignedWon(item.amountKrw)}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default TransactionList
