import { Router } from 'express'
import {
  searchCourseController,
  searchDocumentController,
  searchUserController
} from '~/controllers/search.controllers'
import { paginationValidation } from '~/middlewares/pagination.middlewares'
import { searchCourseValidator, searchDocumentValidator, searchUserValidator } from '~/middlewares/search.middlewares'

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

searchRouter.get('/user', paginationValidation, searchUserValidator, searchUserController)

export default searchRouter
