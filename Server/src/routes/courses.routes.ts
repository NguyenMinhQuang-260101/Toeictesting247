import { Router } from 'express'
import {
  createCourseController,
  deleteCourseController,
  getCourseDetailController,
  updateCourseController
} from '~/controllers/courses.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { courseIdValidator, createCourseValidator, updateCourseValidator } from '~/middlewares/courses.middlewares'
import { accessTokenValidator, userRuleValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { UpdateCourseReqBody } from '~/models/requests/Course.requests'
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

/**
 * Description: Get course detail
 * Method: GET
 * Path: /:course_id
 * Headers: { Authorization?: Bearer <access token>}
 */

coursesRouter.get('/:course_id', courseIdValidator, wrapRequestHandler(getCourseDetailController))

/**
 * Description: Update course
 * Method: PATCH
 * Path: /update
 * Headers: { Authorization: Bearer <access_token> }
 * Body: UpdateCourseReqBody
 */
coursesRouter.patch(
  '/update',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  updateCourseValidator,
  courseIdValidator,
  filterMiddleware<UpdateCourseReqBody>([
    'course_id',
    'type',
    'title',
    'description',
    'content',
    'thumbnails',
    'status'
  ]),
  wrapRequestHandler(updateCourseController)
)

/**
 * Description: Delete course
 * Method: DELETE
 * Path: /delete/:course_id
 * Headers: { Authorization?: Bearer <access token>}
 */

coursesRouter.delete(
  '/delete/:course_id',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  courseIdValidator,
  wrapRequestHandler(deleteCourseController)
)

export default coursesRouter
