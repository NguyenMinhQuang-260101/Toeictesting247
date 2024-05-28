import { Router } from 'express'
import {
  createQuestionController_v2,
  deleteQuestionController_v2,
  getListQuestionsController_v2,
  getQuestionDetailController_v2,
  updateQuestionController_v2
} from '~/controllers/questions_v2.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { paginationValidation } from '~/middlewares/pagination.middlewares'
import { updateQuestionValidator } from '~/middlewares/questions.middlewares'
import { createQuestionValidator_v2, questionIdValidator_v2 } from '~/middlewares/questions_v2.middlewares'
import { accessTokenValidator, userRuleValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { UpdateQuestionReqBody_v2 } from '~/models/requests/Question_v2.requests'
import { wrapRequestHandler } from '~/utils/handlers'

const questionsRouter_v2 = Router()

/**
 * Description: Create a question
 * Method: POST
 * Path: /
 * Body: { QuestionReqBody_v2 }
 * Headers: { Authorization: 'Bearer <access_token>' }
 */
questionsRouter_v2.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  createQuestionValidator_v2,
  wrapRequestHandler(createQuestionController_v2)
)

/**
 * Description: Get list of questions
 * Method: GET
 * Path: /:test_id
 * Headers: { Authorization?: Bearer <access token> }
 * Query: { page: number, limit: number }
 */
questionsRouter_v2.get(
  '/list',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  paginationValidation,
  wrapRequestHandler(getListQuestionsController_v2)
)

/**
 * Description: Get question detail
 * Method: GET
 * Path: /:question_id
 * Headers: { Authorization?: bearer <access token> }
 * Query: { question_id: string }
 */
questionsRouter_v2.get(
  '/:question_id',
  accessTokenValidator,
  verifiedUserValidator,
  questionIdValidator_v2,
  wrapRequestHandler(getQuestionDetailController_v2)
)

/**
 * Description: Update question
 * Method: PATCH
 * Path: /update
 * Headers: { Authorization: Bearer <access token> }
 * Body: { UpdateQuestionReqBody_v2 }
 */
questionsRouter_v2.patch(
  '/update',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  updateQuestionValidator,
  questionIdValidator_v2,
  filterMiddleware<UpdateQuestionReqBody_v2>([
    'question_id',
    'description',
    'content',
    'audio_content',
    'image_content',
    'answers',
    'correct_at',
    'selected_at',
    'score'
  ]),
  wrapRequestHandler(updateQuestionController_v2)
)

/**
 * Description: Delete question
 * Method: DELETE
 * Path: /delete
 * Headers: { Authorization?: Bearer <access token>}
 * Body: { question_id: string, test_id: string}
 */
questionsRouter_v2.delete(
  '/delete',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  questionIdValidator_v2,
  wrapRequestHandler(deleteQuestionController_v2)
)

export default questionsRouter_v2
