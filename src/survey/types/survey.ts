export type SurveyOption = {
  label: string
  score?: number
}

export type SurveyQuestionData = {
  question: string
  description?: string[]
  options: SurveyOption[]
}
