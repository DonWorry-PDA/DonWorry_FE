export type SurveyOption = {
  label: string
  score?: number
}

export type SurveyQuestionData = {
  question: string
  description?: string[]
  options: SurveyOption[]
}

export type SurveyRequest = {
  q1: number
  q2: number
  q3: number
}

export type SurveyResponse = {
  q1: number
  q2: number
  q3: number
}
