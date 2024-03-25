import { Router } from 'express'
import {
  createQuestionController,
  getQuestionDetailController,
  updateQuestionController
} from '~/controllers/questions.controllers'
import { createQuestionValidator, questionIdValidator } from '~/middlewares/questions.middlewares'
import { testIdValidator } from '~/middlewares/tests.middlewares'
import { accessTokenValidator, userRuleValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const questionsRouter = Router()

/**
 * Description: Create a question
 * Method: POST
 * Path: /
 * Body: { QuestionReqBody }
 * Headers: { Authorization: 'Bearer <access_token>' }
 */
questionsRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  createQuestionValidator,
  testIdValidator,
  wrapRequestHandler(createQuestionController)
)

/**
 * Description: Get question detail
 * Method: GET
 * Path: /:question_id
 * Headers: { Authorization?: Bearer <access token>}
 */
questionsRouter.get('/:question_id', questionIdValidator, wrapRequestHandler(getQuestionDetailController))

/**
 * Description: Update question
 * Method: PATCH
 * Path: /update
 * Headers: { Authorization?: Bearer <access token>}
 */
questionsRouter.patch('/update', wrapRequestHandler(updateQuestionController))

export default questionsRouter
