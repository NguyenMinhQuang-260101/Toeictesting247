import { Request, Response } from 'express'
import { QuestionReqBody } from '~/models/requests/Question.requests'
import { ParamsDictionary } from 'express-serve-static-core'
import questionsService from '~/services/questions.services'

export const createQuestionController = async (req: Request<ParamsDictionary, any, QuestionReqBody>, res: Response) => {
  const result = await questionsService.createQuestion(req.body)
  return res.json({ message: 'Create question successfully', result })
}
