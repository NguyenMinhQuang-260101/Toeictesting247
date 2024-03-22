import { Router } from 'express'
import { createQuestionController } from '~/controllers/questions.controllers'
import { createQuestionValidator } from '~/middlewares/questions.middlewares'
import { accessTokenValidator, userRuleValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const questionsRouter = Router()

/**
 * Description: Create a question
 * Method: POST
 * Path: /
 * Body: { QuestionReqBody }
 */
questionsRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  createQuestionValidator,
  wrapRequestHandler(createQuestionController)
)

export default questionsRouter
