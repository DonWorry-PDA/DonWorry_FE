import type { SurveyQuestionData } from '../types/survey'

type Props = {
  step: number
  total: number
  data: SurveyQuestionData
  selectedIndex: number | null
  onSelect: (index: number) => void
}

function SurveyQuestion({ step, total, data, selectedIndex, onSelect }: Props) {
  return (
    <div className="flex flex-1 flex-col">
      {/* 프로그레스 바 */}
      <div className="h-0.5 w-full bg-track">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>

      {/* 단계 라벨 */}
      <p className="px-6 pt-3 text-sub text-ink-hint">
        {step}/{total}단계 · 투자 성향 질문
      </p>

      {/* 질문 + 설명 */}
      <div className="px-6 pt-6">
        <h2 className="whitespace-pre-line text-heading font-bold text-ink">{data.question}</h2>
        {data.description && (
          <div className="mt-2 flex flex-col gap-1">
            {data.description.map((line, i) => (
              <p key={i} className="text-body text-ink-sub">
                {line}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* 선택지 */}
      <div className="flex flex-col gap-3 px-6 pt-8">
        {data.options.map((option, index) => {
          const selected = selectedIndex === index
          return (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className={`flex w-full items-center gap-4 rounded-card border p-4 text-left transition-colors ${
                selected ? 'border-primary bg-primary-tint' : 'border-line bg-white'
              }`}
            >
              {/* 라디오 원 */}
              <div
                className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  selected ? 'border-primary' : 'border-radio'
                }`}
              >
                {selected && <div className="size-2.5 rounded-full bg-primary" />}
              </div>

              {/* 텍스트 */}
              <p className="text-body font-semibold text-ink">{option.label}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SurveyQuestion
