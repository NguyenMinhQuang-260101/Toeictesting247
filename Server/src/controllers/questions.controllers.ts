import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { QuestionReqBody, UpdateQuestionReqBody } from '~/models/requests/Question.requests'
import questionsService from '~/services/questions.services'

export const createQuestionController = async (req: Request<ParamsDictionary, any, QuestionReqBody>, res: Response) => {
  const result = await questionsService.createQuestion(req.body)
  return res.json({ message: 'Create question successfully', result })
}

export const getQuestionDetailController = async (req: Request, res: Response) => {
  return res.json({
    message: 'Get question detail successfully',
    result: req.question
  })
}

export const updateQuestionController = async (
  req: Request<ParamsDictionary, any, UpdateQuestionReqBody>,
  res: Response
) => {
  return res.json({
    message: 'Update question successfully',
    result: req.body
  })
}
