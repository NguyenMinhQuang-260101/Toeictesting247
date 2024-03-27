import { Router } from 'express'
import {
  createQuestionController,
  deleteQuestionController,
  getListQuestionsController,
  getQuestionDetailController,
  updateQuestionController
} from '~/controllers/questions.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
  createQuestionValidator,
  originIdValidator,
  questionIdValidator,
  updateQuestionValidator
} from '~/middlewares/questions.middlewares'
import { testIdValidator } from '~/middlewares/tests.middlewares'
import { accessTokenValidator, userRuleValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { UpdateQuestionReqBody } from '~/models/requests/Question.requests'
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
 * Description: Get list of questions by test_id
 * Method: GET
 * Path: /:test_id
 * Parameters: { test_id: string }
 * Query: { page: number, limit: number }
 */
questionsRouter.get('/list/:test_id', wrapRequestHandler(getListQuestionsController))

/**
 * Description: Get question detail
 * Method: GET
 * Path: /:question_id
 * Parameters: { question_id: string }
 */
questionsRouter.get('/:question_id', questionIdValidator, wrapRequestHandler(getQuestionDetailController))

/**
 * Description: Update question
 * Method: PATCH
 * Path: /update
 * Headers: { Authorization?: Bearer <access token>}
 */
questionsRouter.patch(
  '/update',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  updateQuestionValidator,
  questionIdValidator,
  originIdValidator,
  filterMiddleware<UpdateQuestionReqBody>([
    'question_id',
    'num_quest',
    'description',
    'content',
    'answers',
    'correct_at',
    'selected_at',
    'score'
  ]),
  wrapRequestHandler(updateQuestionController)
)

/**
 * Description: Delete question
 * Method: DELETE
 * Path: /delete
 * Headers: { Authorization?: Bearer <access token>}
 * Body: { question_id: string, test_id: string}
 */
questionsRouter.delete(
  '/delete',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  questionIdValidator,
  originIdValidator,
  testIdValidator,
  wrapRequestHandler(deleteQuestionController)
)

export default questionsRouter
