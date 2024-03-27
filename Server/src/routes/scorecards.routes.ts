import { Router } from 'express'
import { createScoreCardController } from '~/controllers/scoreCards.controllers'
import { crateScoreCardValidator } from '~/middlewares/scorecards.middlewares'
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

export default scoreCardsRouter
