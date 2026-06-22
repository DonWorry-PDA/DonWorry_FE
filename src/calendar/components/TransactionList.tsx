import type { TransactionItem } from '../types/calendar'
import { formatSignedWon } from '../utils/monthGrid'

type Props = {
  items: TransactionItem[]
}

function TransactionList({ items }: Props) {
  return (
    <section className="border-t border-track pt-[15px]">
      <div className="flex items-center justify-between">
        <h2 className="text-body font-bold text-ink">입출금/거래 내역</h2>
        <button className="text-sub text-ink-hint">더보기 ›</button>
      </div>

      {items.length === 0 ? (
        <p className="py-6 text-center text-sub text-ink-hint">거래 내역이 없어요</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-[13px]">
              <span className="text-body text-ink-sub">
                {item.date}
                <span className="px-3" />
                {item.title}
              </span>
              <span className="text-body font-bold text-ink">
                {formatSignedWon(item.amountKrw)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default TransactionList
