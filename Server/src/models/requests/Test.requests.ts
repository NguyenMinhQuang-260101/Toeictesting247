import { ParamsDictionary, Query } from 'express-serve-static-core'

export interface TestReqBody {
  source_id: string
  title: string
  description: string
  timeline: number
  questions: string[]
}

export interface UpdateTestReqBody {
  test_id: string
  source_id: string
  title?: string
  description?: string
  timeline?: number
}

export interface TestParams extends ParamsDictionary {
  test_id: string
  source_id: string
}

export interface TestQuery extends Query {
  limit: string
  page: string
}
