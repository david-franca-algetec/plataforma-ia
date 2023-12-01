export interface Answer {
  text: string
  score: number
  feedback: string
  id: number
}

export interface QuestionCreate {
  question: string
  answers: Omit<Answer, 'id'>[]
}

export type QuestionUpdate = Partial<QuestionCreate>

export interface Questions {
  questions: {
    question: string
    id: number
  }[]
}

export interface Question {
  question: {
    answers: Answer[],
    id: number,
    question: string
  }
}