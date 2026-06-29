import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import { type BuyItem } from './components/BuyConfirmModal'
import useGetAccounts from './hooks/useGetAccounts'
import usePostTransfer from './hooks/usePostTransfer'
import { MydataAccount } from './types/account'

const EMPTY_ITEMS: BuyItem[] = []

function maskNumber(accountNumber: string | null) {
  if (!accountNumber) return '—'
  if (accountNumber.length <= 4) return accountNumber
  return accountNumber.slice(0, -4).replace(/\d/g, '*') + accountNumber.slice(-4)
}

function accountLabel(account: MydataAccount) {
  const type = account.accountType
  if (type === 'CMA') return 'CMA'
  if (type === 'DEPOSIT') return '예금'
  if (type === 'CHECKING') return '입출금'
  if (type === 'DON_WORRY') return '돈워리'
  return type
}

function OrderTransferPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const items: BuyItem[] = state?.items ?? EMPTY_ITEMS
  const totalAmountWon: number = state?.totalAmountWon ?? 0
  const planId: string | undefined = state?.planId

  const { data: accounts, isLoading } = useGetAccounts()
  const transfer = usePostTransfer()
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [isTransferring, setIsTransferring] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timerDoneRef = useRef(false)
  const apiDoneRef = useRef(false)

  const brokerage = accounts?.find((a) => a.accountType === 'BROKERAGE')
  const brokerageBalance = brokerage?.depositBalance ?? 0
  const shortfall = Math.max(totalAmountWon - brokerageBalance, 0)
  const isEnough = shortfall === 0

  const sourceAccounts = (accounts ?? []).filter(
    (a) => a.accountType !== 'BROKERAGE' && a.depositBalance > 0,
  )

  const selectedAccounts = sourceAccounts.filter((a) => selectedIds.has(a.accountId))
  const selectedTotal = selectedAccounts.reduce((sum, a) => sum + a.depositBalance, 0)
  const canTransfer = isEnough || selectedTotal >= shortfall

  const transferAmounts = (() => {
    const map = new Map<number, number>()
    let remaining = shortfall
    for (const acc of selectedAccounts) {
      if (remaining <= 0) break
      const amount = Math.min(acc.depositBalance, remaining)
      map.set(acc.accountId, amount)
      remaining -= amount
    }
    return map
  })()

  function toggleAccount(accountId: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(accountId)) next.delete(accountId)
      else next.add(accountId)
      return next
    })
  }

  useEffect(() => {
    return () => {
      if (timerRef.current != null) clearTimeout(timerRef.current)
    }
  }, [])

  function handleProceed() {
    if (isEnough) {
      navigate('/order/executing', { state: { items, planId } })
      return
    }
    const body = {
      transfers: Array.from(transferAmounts.entries()).map(([fromAccountId, amount]) => ({
        fromAccountId,
        amount,
      })),
    }
    if (timerRef.current != null) clearTimeout(timerRef.current)
    timerDoneRef.current = false
    apiDoneRef.current = false
    setIsTransferring(true)

    function showSuccess() {
      setIsTransferring(false)
      setIsComplete(true)
      timerRef.current = setTimeout(() => {
        navigate('/order/executing', { state: { items, planId } })
      }, 2000)
    }

    timerRef.current = setTimeout(() => {
      timerDoneRef.current = true
      if (apiDoneRef.current) showSuccess()
    }, 3000)
    transfer.mutate(body, {
      onSuccess: () => {
        apiDoneRef.current = true
        if (timerDoneRef.current) showSuccess()
      },
      onError: () => {
        if (timerRef.current != null) clearTimeout(timerRef.current)
        setIsTransferring(false)
      },
    })
  }

  if (isTransferring) {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center px-8 gap-5">
        <svg className="animate-spin text-primary" width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" strokeOpacity="0.15" />
          <path d="M44 24a20 20 0 0 0-20-20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
        <div className="text-center">
          <p className="text-heading font-bold text-ink mb-1">이체 중이에요</p>
          <p className="text-body text-ink-sub">잠시만 기다려주세요</p>
        </div>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center px-8 gap-5">
        <div className="size-16 rounded-full bg-success flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M6 16.5L13 23.5L26 10" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-heading font-bold text-ink mb-1">이체가 완료됐어요</p>
          <p className="text-body text-ink-sub">잠시 후 매수 화면으로 이동해요</p>
        </div>
      </div>
    )
  }

  if (transfer.isError) {
    return (
      <div className="flex flex-col h-full bg-white">
        <AppBar title="이체" onBack={() => navigate(-1)} />
        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-5">
          <div className="size-16 rounded-full bg-danger-bg flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M8 8l16 16M24 8L8 24" stroke="#DF3550" strokeWidth="2.8" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-heading font-bold text-ink mb-1">이체에 실패했어요</p>
            <p className="text-body text-ink-sub">잠시 후 다시 시도해주세요</p>
          </div>
        </div>
        <div className="px-5 pb-4 shrink-0">
          <Button onClick={() => { transfer.reset(); handleProceed() }}>다시 시도</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <AppBar title="이체" onBack={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-6">
        <h2 className="text-heading font-bold text-ink mb-1">
          {isEnough ? '잔고를 확인해요' : '이체가 필요해요'}
        </h2>
        <p className="text-body text-ink-sub mb-6">
          {isEnough
            ? '증권 계좌 잔고로 주문이 가능해요'
            : '이체할 계좌를 선택해주세요. 여러 계좌를 선택할 수 있어요'}
        </p>

        {/* 증권 계좌 잔고 카드 */}
        <div className="rounded-card-lg border border-line px-4 py-4 mb-5">
          <p className="text-sub text-ink-hint mb-1">증권 계좌 잔고</p>
          {isLoading ? (
            <div className="h-7 w-32 bg-surface animate-pulse rounded" />
          ) : (
            <p className="font-inter text-display font-bold text-ink">
              {brokerageBalance.toLocaleString('ko-KR')}
              <span className="text-body font-normal text-ink-sub ml-1">원</span>
            </p>
          )}
          <div className="h-px bg-divider my-3" />
          <div className="flex justify-between text-body">
            <span className="text-ink-sub">주문 필요 금액</span>
            <span className="font-inter font-semibold text-ink">
              {totalAmountWon.toLocaleString('ko-KR')}원
            </span>
          </div>
          {!isEnough && (
            <div className="flex justify-between text-body mt-1.5">
              <span className="text-ink-sub">부족한 금액</span>
              <span className="font-inter font-semibold text-danger">
                {shortfall.toLocaleString('ko-KR')}원
              </span>
            </div>
          )}
        </div>

        {/* 잔고 충분 */}
        {isEnough && (
          <div className="rounded-btn bg-success-bg px-4 py-3 text-body text-success font-semibold text-center">
            잔고가 충분해요 · 바로 주문 진행 가능해요
          </div>
        )}

        {/* 출금 계좌 선택 (다중) */}
        {!isEnough && (
          <>
            <p className="text-sub text-ink-hint mb-2">출금 계좌 선택</p>

            {isLoading ? (
              <div className="flex flex-col gap-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 rounded-card bg-surface animate-pulse" />
                ))}
              </div>
            ) : sourceAccounts.length === 0 ? (
              <div className="rounded-card border border-line px-4 py-4 text-body text-ink-hint text-center">
                이체 가능한 계좌가 없어요
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {sourceAccounts.map((account) => {
                  const selected = selectedIds.has(account.accountId)
                  return (
                    <button
                      key={account.accountId}
                      role="checkbox"
                      aria-checked={selected}
                      onClick={() => toggleAccount(account.accountId)}
                      className={`flex items-center gap-3 rounded-card border px-4 py-3 text-left transition-colors ${
                        selected ? 'border-primary bg-primary-tint' : 'border-line bg-white'
                      }`}
                    >
                      <span
                        className={`shrink-0 size-5 rounded flex items-center justify-center transition-colors ${
                          selected ? 'bg-primary' : 'border-2 border-radio bg-white'
                        }`}
                      >
                        {selected && (
                          <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                            <path d="M1 4l3 3L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <div className="flex-1">
                        <p className="text-body font-semibold text-ink">
                          {account.institutionName} {accountLabel(account)}
                        </p>
                        <p className="text-sub text-ink-hint">{maskNumber(account.accountNumber)}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-inter text-body font-semibold text-ink">
                          {account.depositBalance.toLocaleString('ko-KR')}원
                        </p>
                        {selected && transferAmounts.has(account.accountId) && (
                          <p className="text-caption text-primary mt-0.5">
                            이체 {transferAmounts.get(account.accountId)!.toLocaleString('ko-KR')}원
                          </p>
                        )}
                        {selected && !transferAmounts.has(account.accountId) && (
                          <p className="text-caption text-ink-hint mt-0.5">이체 불필요</p>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* 선택 합계 */}
            {selectedIds.size > 0 && (
              <div className="mt-4 rounded-btn bg-surface px-4 py-3 flex flex-col gap-1.5">
                <div className="flex justify-between text-body">
                  <span className="text-ink-sub">선택 계좌 합계</span>
                  <span className="font-inter font-bold text-ink">
                    {selectedTotal.toLocaleString('ko-KR')}원
                  </span>
                </div>
                <div className="flex justify-between text-sub">
                  <span className="text-ink-hint">
                    {canTransfer
                      ? `부족한 ${shortfall.toLocaleString('ko-KR')}원을 충당할 수 있어요`
                      : `아직 ${(shortfall - selectedTotal).toLocaleString('ko-KR')}원이 부족해요`}
                  </span>
                  <span className={canTransfer ? 'text-success font-semibold' : 'text-danger font-semibold'}>
                    {canTransfer ? '충분' : '부족'}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="px-5 pb-4 shrink-0">
        <Button
          disabled={!canTransfer || transfer.isPending}
          onClick={handleProceed}
        >
          {transfer.isPending ? '이체 중...' : isEnough ? '주문 진행하기' : '이체하기'}
        </Button>
      </div>
    </div>
  )
}

export default OrderTransferPage
