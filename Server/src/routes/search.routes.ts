import { Router } from 'express'
import { searchCourseController } from '~/controllers/search.controllers'
import { paginationValidation } from '~/middlewares/pagination.middlewares'
import { searchCourseValidator } from '~/middlewares/search.middlewares'

const searchRouter = Router()

/**
 * Description: Search course
 * Method: GET
 * Path: /course
 * Query: {limit: string, page: string, title: string, course_type_query: CourseTypeQuery}
 */

searchRouter.get('/course', paginationValidation, searchCourseValidator, searchCourseController)

export default searchRouter
