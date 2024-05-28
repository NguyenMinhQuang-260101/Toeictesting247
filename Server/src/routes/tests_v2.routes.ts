import { Router } from 'express'
import {
  addQuestionToTestController_v2,
  createTestController_v2,
  deleteQuestionFromTestController,
  deleteTestController_v2,
  getFullTestDetailController_v2,
  getListTestsController_v2,
  getTestDetailController_v2,
  randomQuestionForTestController,
  updateTestController_v2
} from '~/controllers/tests_v2.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { paginationValidation } from '~/middlewares/pagination.middlewares'
import { questionIdValidator_v2 } from '~/middlewares/questions_v2.middlewares'
import {
  createTestValidator_v2,
  fullTestIdValidator_v2,
  randomQuestionValidator,
  testIdValidator_v2,
  testUpdateValidator_v2
} from '~/middlewares/tests_v2.middlewares'
import { accessTokenValidator, userRuleValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { UpdateTestReqBody_v2 } from '~/models/requests/Test_v2.requests'
import { wrapRequestHandler } from '~/utils/handlers'

const testsRouter_v2 = Router()

/**
 * Description: Create a test
 * Method: POST
 * Path: /
 * Body: TestReqBody }
 * Headers: { Authorization: 'Bearer <access_token>' }
 */
testsRouter_v2.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  createTestValidator_v2,
  wrapRequestHandler(createTestController_v2)
)

/**
 * Description: Add a question to a test
 * Method: PATCH
 * Path: /
 * Body: { test_id: string, question_id: string }
 * Headers: { Authorization: 'Bearer <access_token>' }
 */
testsRouter_v2.patch(
  '/add-question',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  questionIdValidator_v2,
  testIdValidator_v2,
  wrapRequestHandler(addQuestionToTestController_v2)
)

/**
 * Description: Random questions for a test
 * Method: PATCH
 * Path: /
 * Body: { test_id: string, question_id: string }
 * Headers: { Authorization: 'Bearer <access_token>' }
 */
testsRouter_v2.patch(
  '/random-questions',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  randomQuestionValidator,
  testIdValidator_v2,
  wrapRequestHandler(randomQuestionForTestController)
)

/**
 * Description: Get list of tests by source_id
 * Method: GET
 * Path: /list/:source_id
 * Parameters: { source_id: string }
 * Query: { page: number, limit: number }
 */
testsRouter_v2.get('/list', paginationValidation, wrapRequestHandler(getListTestsController_v2))

/**
 * Description: Get test detail
 * Method: GET
 * Path: /:test_id
 * Parameters: { test_id: string }
 */
testsRouter_v2.get('/:test_id', testIdValidator_v2, wrapRequestHandler(getTestDetailController_v2))

/**
 * Description: Get full test detail
 * Method: GET
 * Path: /full-test-detail/:test_id
 * Headers: { Authorization?: Bearer <access token>}
 */
testsRouter_v2.get(
  '/full-test-detail/:test_id',
  fullTestIdValidator_v2,
  wrapRequestHandler(getFullTestDetailController_v2)
)

/**
 * Description: Update test
 * Method: PATCH
 * Path: /update
 * Headers: { Authorization?: Bearer <access token>}
 * Body: UpdateTestReqBody
 */
testsRouter_v2.patch(
  '/update',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  testUpdateValidator_v2,
  testIdValidator_v2,
  filterMiddleware<UpdateTestReqBody_v2>(['test_id', 'title', 'description', 'timeline']),
  wrapRequestHandler(updateTestController_v2)
)

/**
 * Description: Delete test
 * Method: DELETE
 * Path: /delete
 * Headers: { Authorization?: Bearer <access token>}
 * Body: { test_id: string, source_id: string }
 */
testsRouter_v2.delete(
  '/delete',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  testIdValidator_v2,
  wrapRequestHandler(deleteTestController_v2)
)

/**
 * Description: Delete question from test
 * Method: DELETE
 * Path: /delete
 * Headers: { Authorization?: Bearer <access token>}
 * Body: { test_id: string, question_id: string}
 */
testsRouter_v2.delete(
  '/delete-question-from-test',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  questionIdValidator_v2,
  testIdValidator_v2,
  wrapRequestHandler(deleteQuestionFromTestController)
)

export default testsRouter_v2
