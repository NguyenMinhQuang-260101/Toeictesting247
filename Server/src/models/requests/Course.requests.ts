import { ParamsDictionary, Query } from 'express-serve-static-core'
import { CourseType, OperatingStatus } from '~/constants/enums'
import { Media } from '../Other'

export interface CourseReqBody {
  type: CourseType
  title: string
  description: string
  content: string
  tests: string[]
  thumbnails: Media[]
  notification: null | string
  status: OperatingStatus
}

export interface UpdateCourseReqBody {
  course_id: string
  type?: CourseType
  title?: string
  description?: string
  content?: string
  thumbnails?: Media[]
  status?: OperatingStatus
}

export interface CourseParams extends ParamsDictionary {
  course_id: string
}

export interface CourseQuery extends Query {
  limit: string
  page: string
  course_type: string
}
