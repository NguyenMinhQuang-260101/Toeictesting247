import { Router } from 'express'
import { createScoreCardController_v2, getScoreCardController_v2 } from '~/controllers/scoreCards_v2.controllers'
import { crateScoreCardValidator_v2 } from '~/middlewares/scorecards_v2.middlewares'
import { testIdValidator_v2 } from '~/middlewares/tests_v2.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const scoreCardsRouter_v2 = Router()

/**
 * Description: Create a scoreCard
 * Method: POST
 * Path: /
 * Headers: { Authorization Bearer <access_token>}
 * Body:{ ScoreCardReqBody_v2 }
 */

scoreCardsRouter_v2.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  crateScoreCardValidator_v2,
  testIdValidator_v2,
  wrapRequestHandler(createScoreCardController_v2)
)

/**
 * Description: Get a scoreCard by test_id
 * Method: GET
 * Path: /:scorecard_id
 * Headers: { Authorization Bearer <access token>}
 * Params: { test_id: string }
 */

scoreCardsRouter_v2.get(
  '/:test_id',
  accessTokenValidator,
  verifiedUserValidator,
  testIdValidator_v2,
  wrapRequestHandler(getScoreCardController_v2)
)

export default scoreCardsRouter_v2
