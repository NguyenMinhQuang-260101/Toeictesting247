import { Answer, Media } from '../Other'
import { Query } from 'express-serve-static-core'
export interface QuestionReqBody {
  test_id: string
  num_quest: number
  description: string
  content: string | Media[]
  answers: Answer[]
  correct_at: Answer
  selected_at?: Answer
  score: number
}

export interface UpdateQuestionReqBody {
  // test_id: string
  question_id: string
  num_quest?: number
  description?: string
  content?: string | Media[]
  answers?: Answer[]
  correct_at?: Answer
  selected_at?: Answer
  score?: number
}

export interface QuestionQuery extends Query {
  limit: string
  page: string
}
