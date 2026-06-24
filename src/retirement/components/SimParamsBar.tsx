import type { SimParams } from '../types/simulation'

interface SimParamsBarProps {
  params: SimParams
  onEditClick: () => void
}

function formatAssets(krw: number): string {
  const eok = krw / 100_000_000
  if (eok >= 1) {
    const rounded = Math.round(eok * 10) / 10
    return `${rounded}억`
  }
  const man = Math.round(krw / 10_000)
  return `${man.toLocaleString('ko-KR')}만`
}

function formatManwon(krw: number): string {
  const man = Math.round(krw / 10_000)
  return `${man.toLocaleString('ko-KR')}만`
}

function SimParamsBar({ params, onEditClick }: SimParamsBarProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <div className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-1">
        <ParamChip label="나이" value={params.ageYears ? `${params.ageYears}세` : '-'} />
        <Sep />
        <ParamChip label="자산" value={formatAssets(params.totalAssetsKrw)} />
        <Sep />
        <ParamChip label="생활비" value={formatManwon(params.monthlyLivingKrw)} />
        <Sep />
        <ParamChip label="연금" value={formatManwon(params.monthlyPensionKrw)} />
      </div>
      <button
        type="button"
        onClick={onEditClick}
        className="shrink-0 text-sub font-semibold text-primary"
      >
        수정
      </button>
    </div>
  )
}

function ParamChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-sub text-ink">
      <span className="text-ink-hint">{label} </span>
      <span className="font-bold">{value}</span>
    </span>
  )
}

function Sep() {
  return <span className="text-sep text-sub">|</span>
}

export default SimParamsBar
