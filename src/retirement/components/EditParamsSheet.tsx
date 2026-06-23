import { useState, useEffect } from 'react'
import BottomSheet from '@/common/components/BottomSheet'
import Button from '@/common/components/Button'
import type { SimParams } from '../types/simulation'

interface EditParamsSheetProps {
  open: boolean
  params: SimParams
  onClose: () => void
  onConfirm: (next: SimParams) => void
}

function EditParamsSheet({ open, params, onClose, onConfirm }: EditParamsSheetProps) {
  const [age, setAge] = useState(String(params.ageYears))
  const [assets, setAssets] = useState(String(params.totalAssetsKrw / 10_000))
  const [living, setLiving] = useState(String(params.monthlyLivingKrw / 10_000))
  const [pension, setPension] = useState(String(params.monthlyPensionKrw / 10_000))

  // 시트가 열릴 때마다 현재 params 값으로 리셋
  useEffect(() => {
    if (open) {
      setAge(String(params.ageYears))
      setAssets(String(params.totalAssetsKrw / 10_000))
      setLiving(String(params.monthlyLivingKrw / 10_000))
      setPension(String(params.monthlyPensionKrw / 10_000))
    }
  }, [open])

  const handleConfirm = () => {
    const next: SimParams = {
      ageYears: Number(age) || params.ageYears,
      totalAssetsKrw: (Number(assets) || 0) * 10_000,
      monthlyLivingKrw: (Number(living) || 0) * 10_000,
      monthlyPensionKrw: (Number(pension) || 0) * 10_000,
    }
    onConfirm(next)
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="px-5 pb-8 pt-4">
        <p className="mb-5 text-card font-bold text-ink">정보 수정</p>
        <div className="flex flex-col gap-4">
          <Field label="나이" unit="세" value={age} onChange={setAge} />
          <Field label="자산" unit="만원" value={assets} onChange={setAssets} />
          <Field label="생활비" unit="만원/월" value={living} onChange={setLiving} />
          <Field label="연금" unit="만원/월" value={pension} onChange={setPension} />
        </div>
        <div className="mt-6">
          <Button onClick={handleConfirm}>확인</Button>
        </div>
      </div>
    </BottomSheet>
  )
}

interface FieldProps {
  label: string
  unit: string
  value: string
  onChange: (v: string) => void
}

function Field({ label, unit, value, onChange }: FieldProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 shrink-0 text-sub text-ink-sub">{label}</span>
      <div className="flex flex-1 items-center rounded-card border border-line px-3 py-2.5">
        <input
          type="number"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 text-md font-semibold text-ink outline-none"
        />
        <span className="ml-1 shrink-0 text-sub text-ink-hint">{unit}</span>
      </div>
    </div>
  )
}

export default EditParamsSheet
