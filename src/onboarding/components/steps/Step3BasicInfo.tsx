import { useState, useRef, useEffect } from 'react'
import { BackArrowIc } from '../../../common/assets/icons'
import OnboardingProgressBar from '../OnboardingProgressBar'
import { useOnboarding } from '../../contexts/OnboardingContext'
import BottomSheet from '../../../common/components/BottomSheet'

const CURRENT_YEAR = new Date().getFullYear()
const BIRTH_YEARS = Array.from({ length: 50 }, (_, i) => 1979 - i) // 1979 → 1930
const RETIRED_YEARS = Array.from({ length: CURRENT_YEAR - 1959 }, (_, i) => CURRENT_YEAR - i)

interface Props {
  onNext: () => void
  onPrev: () => void
}

interface YearPickerFieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  years: number[]
  suffix: string
  placeholder?: string
}

function YearPickerField({
  label,
  value,
  onChange,
  years,
  suffix,
  placeholder = '선택하세요',
}: YearPickerFieldProps) {
  const [open, setOpen] = useState(false)
  const selectedRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        selectedRef.current?.scrollIntoView({ block: 'center', behavior: 'instant' })
      }, 50)
    }
  }, [open])

  return (
    <>
      <div className="flex flex-col gap-2">
        <p className="text-sub text-ink-sub">{label}</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`flex h-[3.375rem] w-full items-center justify-between rounded-card border bg-white px-[1.0625rem] transition-colors ${
            open ? 'border-primary' : 'border-line'
          }`}
        >
          {value ? (
            <span className="font-inter text-display font-semibold text-ink">
              {value}{suffix}
            </span>
          ) : (
            <span className="text-md text-ink-hint">{placeholder}</span>
          )}
          <svg
            className={`shrink-0 text-ink-hint transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 8l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <p className="px-5 pb-2 pt-3 text-sub font-bold text-ink">{label}</p>
        <div className="max-h-[min(50vh,18rem)] overflow-y-auto">
          {years.map((year) => {
            const yearStr = String(year)
            const isSelected = yearStr === value
            return (
              <button
                key={yearStr}
                ref={isSelected ? selectedRef : undefined}
                type="button"
                onClick={() => {
                  onChange(yearStr)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between px-5 py-[0.9375rem] text-left transition-colors ${
                  isSelected ? 'bg-primary-tint' : 'active:bg-surface'
                }`}
              >
                <span
                  className={`font-inter text-md font-semibold ${
                    isSelected ? 'text-primary' : 'text-ink'
                  }`}
                >
                  {year}{suffix}
                </span>
                {isSelected && (
                  <svg width={18} height={18} viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path
                      d="M3 9l4.5 4.5L15 5"
                      stroke="#0046FF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
        <div className="h-10" />
      </BottomSheet>
    </>
  )
}

function Step3BasicInfo({ onNext, onPrev }: Props) {
  const { answers, updateAnswers } = useOnboarding()
  const isRetired = answers.situation === 'retired'

  const [birthYear, setBirthYear] = useState<string>(
    answers.age != null ? String(CURRENT_YEAR - answers.age) : ''
  )
  const [retiredYear, setRetiredYear] = useState<string>(
    answers.retiredYear?.toString() ?? ''
  )

  function handleNext() {
    const birthYearNum = birthYear ? parseInt(birthYear, 10) : null
    updateAnswers({
      age: birthYearNum ? CURRENT_YEAR - birthYearNum : null,
      retiredYear: isRetired && retiredYear ? parseInt(retiredYear, 10) : null,
    })
    onNext()
  }

  return (
    <div className="flex h-dvh flex-col bg-white">
      <div className="px-6 pt-12">
        <button type="button" onClick={onPrev} className="mb-4 text-ink">
          <BackArrowIc width={24} height={24} />
        </button>
      </div>

      <OnboardingProgressBar
            current={answers.situation === 'preparing' ? 2 : 3}
            total={answers.situation === 'preparing' ? 3 : 4}
          />

      <div className="flex flex-1 min-h-0 flex-col overflow-y-auto px-6 pt-8">
        <h1 className="text-heading font-bold text-ink">기본 정보를 알려주세요</h1>
        <p className="mt-2 text-body text-ink-sub">
          생활비를 감당할 수 있는지 계산하는 데 쓰여요.
        </p>

        <div className="mt-10 flex flex-col gap-8">
          <YearPickerField
            label="출생년도"
            value={birthYear}
            onChange={setBirthYear}
            years={BIRTH_YEARS}
            suffix="년생"
          />

          {isRetired && (
            <YearPickerField
              label="은퇴한 시점"
              value={retiredYear}
              onChange={setRetiredYear}
              years={RETIRED_YEARS}
              suffix="년"
            />
          )}
        </div>
      </div>

      <div className="relative shrink-0 px-6 pb-10">
        <div className="pointer-events-none absolute -top-8 inset-x-0 h-8 bg-gradient-to-b from-white/0 to-white" />
        <button
          type="button"
          onClick={handleNext}
          className="w-full rounded-btn bg-primary py-4 text-btn font-bold text-white"
        >
          다음
        </button>
      </div>
    </div>
  )
}

export default Step3BasicInfo
