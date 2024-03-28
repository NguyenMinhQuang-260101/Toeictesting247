import { CourseTypeQuery, DocumentTypeQuery } from '~/constants/enums'
import { CourseQuery } from './Course.requests'
import { DocumentQuery } from './Document.requests'

export interface SearchCourseQuery extends CourseQuery {
  title: string
  course_type_query: CourseTypeQuery
}

export interface SearchDocumentQuery extends DocumentQuery {
  title: string
  document_type_query: DocumentTypeQuery
}
