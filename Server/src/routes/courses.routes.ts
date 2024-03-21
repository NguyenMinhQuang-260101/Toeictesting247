import { Router } from 'express'
import { createCourseController } from '~/controllers/courses.controllers'
import { createCourseValidator } from '~/middlewares/courses.middlewares'
import { accessTokenValidator, userRuleValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const coursesRouter = Router()

/**
 * Description: Create course
 * Method: POST
 * Path: /
 * Body: { email: string, password: string }
 */
coursesRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  createCourseValidator,
  wrapRequestHandler(createCourseController)
)

export default coursesRouter
