import { Router } from 'express'
import { createScoreCardController, getScoreCardController } from '~/controllers/scoreCards.controllers'
import { crateScoreCardValidator, scoreCardIdValidator } from '~/middlewares/scorecards.middlewares'
import { testIdValidator } from '~/middlewares/tests.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const scoreCardsRouter = Router()

/**
 * Description: Create a scoreCard
 * Method: POST
 * Path: /
 * Headers: { Authorization Bearer <access_token>}
 * Body:{ ScoreCardReqBody }
 */

scoreCardsRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  crateScoreCardValidator,
  testIdValidator,
  wrapRequestHandler(createScoreCardController)
)

/**
 * Description: Get a scoreCard
 * Method: GET
 * Path: /:scorecard_id
 * Headers: { Authorization Bearer <access token>}
 * Params: { scorecard_id: string }
 */

scoreCardsRouter.get(
  '/:scorecard_id',
  accessTokenValidator,
  verifiedUserValidator,
  scoreCardIdValidator,
  wrapRequestHandler(getScoreCardController)
)

export default scoreCardsRouter
