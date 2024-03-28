import { CourseTypeQuery } from '~/constants/enums'
import { CourseQuery } from './Course.requests'

export interface SearchCourseQuery extends CourseQuery {
  title: string
  course_type_query: CourseTypeQuery
}
