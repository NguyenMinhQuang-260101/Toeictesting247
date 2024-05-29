import { Router } from 'express'
import {
  searchCourseController,
  searchDocumentController,
  searchQuestionController,
  searchUserController
} from '~/controllers/search.controllers'
import { paginationValidation } from '~/middlewares/pagination.middlewares'
import { searchQuestionValidator } from '~/middlewares/questions_v2.middlewares'
import { searchCourseValidator, searchDocumentValidator, searchUserValidator } from '~/middlewares/search.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'

const searchRouter = Router()

/**
 * Description: Search course
 * Method: GET
 * Path: /course
 * Query: {limit: string, page: string, title: string, course_type_query: CourseTypeQuery}
 */

searchRouter.get('/course', paginationValidation, searchCourseValidator, searchCourseController)

/**
 * Description: Search document
 * Method: GET
 * Path: /document
 * Query: {limit: string, page: string, title: string, course_type_query: CourseTypeQuery}
 */

searchRouter.get('/document', paginationValidation, searchDocumentValidator, searchDocumentController)

/**
 * Description: Search user
 * Method: GET
 * Path: /user
 * Query: {limit: string, page: string, name_email: SearchUserQuery}
 */

searchRouter.get(
  '/user',
  accessTokenValidator,
  verifiedUserValidator,
  paginationValidation,
  searchUserValidator,
  searchUserController
)

/**
 * Description: Search question
 * Method: GET
 * Path: /question
 * Query: {limit: string, page: string, type: QuestionType, type_content: QuestionContentType, num_part: number}
 */

searchRouter.get(
  '/question',
  accessTokenValidator,
  verifiedUserValidator,
  paginationValidation,
  searchQuestionValidator,
  searchQuestionController
)

export default searchRouter
