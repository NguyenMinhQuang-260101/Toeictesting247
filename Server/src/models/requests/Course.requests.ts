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
