import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ScoreCardReqBody } from '~/models/requests/ScoreCard.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import scoreCardService from '~/services/scorecards.services'

export const createScoreCardController = async (
  req: Request<ParamsDictionary, any, ScoreCardReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const scoreCard = await scoreCardService.createScoreCard(user_id, req.body)
  return res.json({
    message: 'Create scoreCard successfully',
    result: scoreCard
  })
}

export const getScoreCardController = async (req: Request, res: Response) => {
  return res.json({
    message: 'Get Scorecard successfully',
    result: req.scorecard
  })
}
