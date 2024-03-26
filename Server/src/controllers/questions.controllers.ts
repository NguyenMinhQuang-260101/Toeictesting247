import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { QuestionReqBody, UpdateQuestionReqBody } from '~/models/requests/Question.requests'
import Course from '~/models/schemas/Course.schema'
import Test from '~/models/schemas/Test.schema'
import Document from '~/models/schemas/Document.schema'
import questionsService from '~/services/questions.services'

export const createQuestionController = async (req: Request<ParamsDictionary, any, QuestionReqBody>, res: Response) => {
  const result = await questionsService.createQuestion(req.body, req.test as Test)
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
  const question = await questionsService.updateQuestion(req.body, req.source as Course | Document)
  return res.json({
    message: 'Update question successfully',
    result: question
  })
}

export const deleteQuestionController = async (req: Request, res: Response) => {
  await questionsService.deleteQuestion(req.body.question_id, req.source as Course | Document, req.test as Test)
  return res.json({ message: 'Delete question successfully' })
}
