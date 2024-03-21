import { Router } from 'express'
import { createTestController } from '~/controllers/tests.controllers'
import { createTestValidator } from '~/middlewares/tests.middlewares'
import { accessTokenValidator, userRuleValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const testsRouter = Router()

/**
 * Description: Create a test
 * Method: POST
 * Path: /
 * Body: TestReqBody }
 */
testsRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  createTestValidator,
  wrapRequestHandler(createTestController)
)

export default testsRouter
