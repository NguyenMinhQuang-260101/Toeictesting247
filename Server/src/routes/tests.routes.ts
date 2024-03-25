import { Router } from 'express'
import {
  createTestController,
  getFullTestDetailController,
  getTestDetailController,
  updateTestController
} from '~/controllers/tests.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
  createTestValidator,
  fullTestIdValidator,
  sourceIdValidator,
  testIdValidator,
  testUpdateValidator
} from '~/middlewares/tests.middlewares'
import { accessTokenValidator, userRuleValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { UpdateTestReqBody } from '~/models/requests/Test.requests'
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
  sourceIdValidator,
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

/**
 * Description: Update test
 * Method: PATCH
 * Path: /update
 * Headers: { Authorization?: Bearer <access token>}
 * Body: UpdateTestReqBody
 */
testsRouter.patch(
  '/update',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  testUpdateValidator,
  testIdValidator,
  sourceIdValidator,
  filterMiddleware<UpdateTestReqBody>(['test_id', 'source_id', 'title', 'description', 'timeline']),
  wrapRequestHandler(updateTestController)
)

export default testsRouter
