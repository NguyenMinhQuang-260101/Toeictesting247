import { Query } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { QuestionContentType, QuestionType } from '~/constants/enums'
import { Answer } from '../Other'

export interface QuestionReqBody_v2 {
  type: QuestionType
  type_content: QuestionContentType
  num_part: number
  description: string
  content: string
  audio_content?: string
  image_content?: string
  answers: Answer[]
  correct_at: Answer
  selected_at?: Answer
  score: number
  parent_id: null | ObjectId
}

export interface UpdateQuestionReqBody_v2 {
  question_id: string
  description?: string
  content?: string
  audio_content?: string
  image_content?: string
  answers?: Answer[]
  correct_at?: Answer
  selected_at?: Answer
  score?: number
}

export interface QuestionQuery_v2 extends Query {
  limit: string
  page: string
}
