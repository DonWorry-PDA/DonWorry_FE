export type SurveyOption = {
  label: string
  score?: number
  consumptionRate?: number
}

export type SurveyQuestionData = {
  question: string
  description?: string[]
  options: SurveyOption[]
}
