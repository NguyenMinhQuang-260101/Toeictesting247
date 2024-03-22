import { Router } from 'express'
import { createCourseController, getCourseDetailController } from '~/controllers/courses.controllers'
import { courseIdValidator, createCourseValidator } from '~/middlewares/courses.middlewares'
import { accessTokenValidator, userRuleValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const coursesRouter = Router()

/**
 * Description: Create course
 * Method: POST
 * Path: /
 * Body: { CourseReqBody }
 * Headers: { Authorization Bearer <access_token>}
 */
coursesRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  createCourseValidator,
  wrapRequestHandler(createCourseController)
)

/**'
 * Description: Get course detail
 * Method: GET
 * Path: /:course_id
 * Headers: { Authorization?: Bearer <access token>}
 */

coursesRouter.get('/:course_id', courseIdValidator, wrapRequestHandler(getCourseDetailController))

export default coursesRouter
