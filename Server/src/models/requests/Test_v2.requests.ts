import { Query } from 'express-serve-static-core'
import { QuestionContentType, QuestionType } from '~/constants/enums'
import { ParamsDictionary } from 'express-serve-static-core'

export interface TestReqBody_v2 {
  title: string
  description: string
  timeline: number
  questions: string[]
}

export interface UpdateTestReqBody_v2 {
  test_id: string
  title?: string
  description?: string
  timeline?: number
}

export interface TestParams extends ParamsDictionary {
  test_id: string
}

export interface TestQuery_v2 extends Query {
  limit: string
  page: string
}

export interface RandomQuestReqBody {
  type_question: QuestionType
  type_content_question: QuestionContentType
  quantity_questions: number
}
