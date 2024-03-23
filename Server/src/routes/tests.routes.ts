import { Router } from 'express'
import {
  createTestController,
  getFullTestDetailController,
  getTestDetailController
} from '~/controllers/tests.controllers'
import { courseIdValidator } from '~/middlewares/courses.middlewares'
import { createTestValidator, fullTestIdValidator, testIdValidator } from '~/middlewares/tests.middlewares'
import { accessTokenValidator, userRuleValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const testsRouter = Router()

/**
 * Description: Create a test
 * Method: POST
 * Path: /
 * Body: TestReqBody }
 * Headers: { Authorization: 'Bearer <access_token>' }
 */
testsRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  createTestValidator,
  courseIdValidator,
  wrapRequestHandler(createTestController)
)

/**
 * Description: Get test detail
 * Method: GET
 * Path: /:test_id
 * Headers: { Authorization?: Bearer <access token>}
 */
testsRouter.get('/:test_id', testIdValidator, wrapRequestHandler(getTestDetailController))

/**
 * Description: Get full test detail
 * Method: GET
 * Path: /full-test-detail/:test_id
 * Headers: { Authorization?: Bearer <access token>}
 */
testsRouter.get('/full-test-detail/:test_id', fullTestIdValidator, wrapRequestHandler(getFullTestDetailController))

export default testsRouter
