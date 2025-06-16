export type QuestionType =
  | "text"
  | "textarea"
  | "multiple-choice"
  | "checkbox"
  | "date"
  | "email"
  | "number"
  | "dropdown"

export interface QuestionOption {
  id: string
  value: string
}

export interface Question {
  id: string
  text: string
  type: QuestionType
  required: boolean
  description?: string
  options?: QuestionOption[] // For multiple choice, checkbox, dropdown
  placeholder?: string // For text, textarea, email, number
  minLength?: number // For text, textarea
  maxLength?: number // For text, textarea
  min?: number // For number
  max?: number // For number
}

export interface Brief {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  questions: Question[]
}

export interface BriefResponse {
  id: string
  briefId: string
  projectId?: string
  clientId: string
  responses: {
    questionId: string
    answer: string | string[] | number | Date | null
  }[]
  submittedAt: string
}

