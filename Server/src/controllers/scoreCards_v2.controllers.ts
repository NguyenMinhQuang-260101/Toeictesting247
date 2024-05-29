import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ScoreCardReqBody_v2 } from '~/models/requests/ScoreCard_v2.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import scoreCardService_v2 from '~/services/scorecards_v2.services'

export const createScoreCardController_v2 = async (
  req: Request<ParamsDictionary, any, ScoreCardReqBody_v2>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const scoreCard = await scoreCardService_v2.createScoreCard_v2(user_id, req.body)
  return res.json({
    message: 'Create scoreCard successfully',
    result: scoreCard
  })
}

export const getScoreCardController_v2 = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const scorecard = await scoreCardService_v2.getScoreCardController_v2(user_id, req.params.test_id)
  return res.json({
    message: 'Get Scorecard successfully',
    result: scorecard
  })
}
