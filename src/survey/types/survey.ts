export type SurveyOption = {
  label: string
  subLabel?: string
}

export type SurveyQuestionData = {
  question: string
  subtitle?: string
  options: SurveyOption[]
}
