import { Router } from 'express'
import {
  createTestController,
  deleteTestController,
  getFullTestDetailController,
  getListTestsController,
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
 * Description: Get list of tests by source_id
 * Method: GET
 * Path: /:source_id
 * Headers: { Authorization?: Bearer <access token>}
 * Parameters: { source_id: string }
 * Query: { page: number, limit: number }
 */
testsRouter.get('/list/:source_id', wrapRequestHandler(getListTestsController))

/**
 * Description: Get test detail
 * Method: GET
 * Path: /:test_id
 * Parameters: { test_id: string }
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

/**
 * Description: Delete test
 * Method: DELETE
 * Path: /delete
 * Headers: { Authorization?: Bearer <access token>}
 * Body: { test_id: string, source_id: string }
 */
testsRouter.delete(
  '/delete',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  testIdValidator,
  sourceIdValidator,
  wrapRequestHandler(deleteTestController)
)

export default testsRouter
