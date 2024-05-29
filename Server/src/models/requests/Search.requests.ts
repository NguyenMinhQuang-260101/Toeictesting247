import { CourseTypeQuery, DocumentTypeQuery, QuestionContentTypeQuery, QuestionTypeQuery } from '~/constants/enums'
import { CourseQuery } from './Course.requests'
import { DocumentQuery } from './Document.requests'
import { UserQuery } from './User.requests'
import { QuestionQuery_v2 } from './Question_v2.requests'

export interface SearchCourseQuery extends CourseQuery {
  title: string
  course_type_query: CourseTypeQuery
}

export interface SearchDocumentQuery extends DocumentQuery {
  title: string
  document_type_query: DocumentTypeQuery
}

export interface SearchUserReqQuery extends UserQuery {
  name_email: string
}

export interface SearchQuestionReqQuery extends QuestionQuery_v2 {
  question_type: QuestionTypeQuery
  question_content_type: QuestionContentTypeQuery
  num_part: string
}
