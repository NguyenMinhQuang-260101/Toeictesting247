import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { QuestionQuery_v2, QuestionReqBody_v2, UpdateQuestionReqBody_v2 } from '~/models/requests/Question_v2.requests'
import questionsService_v2 from '~/services/questions_v2.services'

export const createQuestionController_v2 = async (
  req: Request<ParamsDictionary, any, QuestionReqBody_v2>,
  res: Response
) => {
  const result = await questionsService_v2.createQuestion_v2(req.body)
  return res.json({
    message: 'Create question successfully',
    result
  })
}

export const getListQuestionsController_v2 = async (
  req: Request<ParamsDictionary, any, any, QuestionQuery_v2>,
  res: Response
) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const { questions, total } = await questionsService_v2.getListQuestions({
    limit,
    page
  })
  return res.json({
    message: 'Get list of questions successfully',
    result: {
      questions,
      limit,
      page,
      total_page: Math.ceil(total / limit)
    }
  })
}

export const getQuestionDetailController_v2 = async (req: Request, res: Response) => {
  return res.json({
    message: 'Get question detail successfully',
    result: req.question_v2
  })
}

export const updateQuestionController_v2 = async (
  req: Request<ParamsDictionary, any, UpdateQuestionReqBody_v2>,
  res: Response
) => {
  const question = await questionsService_v2.updateQuestion_v2(req.body)
  return res.json({
    message: 'Update question successfully',
    result: question
  })
}

export const deleteQuestionController_v2 = async (req: Request, res: Response) => {
  await questionsService_v2.deleteQuestionController_v2(req.body.question_id)
  return res.json({ message: 'Delete question successfully' })
}
