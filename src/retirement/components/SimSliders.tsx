interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}

function Slider({ label, value, min, max, step, onChange }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100
  const displayValue = value % 1 === 0 ? `${value}.0` : `${value}`

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sub text-ink-sub">{label}</span>
        <span className="font-inter text-sub font-bold text-ink">연 {displayValue}%</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-[3px] w-full cursor-pointer appearance-none rounded-full [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-card"
        style={{
          background: `linear-gradient(to right, #0046FF ${pct}%, #EDF0F4 ${pct}%)`,
        }}
        aria-label={label}
      />
    </div>
  )
}

interface SimSlidersProps {
  returnRate: number
  inflationRate: number
  onReturnRateChange: (v: number) => void
  onInflationRateChange: (v: number) => void
}

function SimSliders({
  returnRate,
  inflationRate,
  onReturnRateChange,
  onInflationRateChange,
}: SimSlidersProps) {
  return (
    <div className="flex flex-col gap-5 px-5 py-4">
      <Slider
        label="투자 수익률 가정"
        value={returnRate}
        min={0}
        max={10}
        step={0.5}
        onChange={onReturnRateChange}
      />
      <Slider
        label="물가 상승 가정"
        value={inflationRate}
        min={0}
        max={5}
        step={0.5}
        onChange={onInflationRateChange}
      />
    </div>
  )
}

export default SimSliders
