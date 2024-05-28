import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import {
  RandomQuestReqBody,
  TestQuery_v2,
  TestReqBody_v2,
  UpdateTestReqBody_v2
} from '~/models/requests/Test_v2.requests'
import Question_v2 from '~/models/schemas/Question_v2.schema'
import Test_v2 from '~/models/schemas/Test_v2.schema'
import testsService_v2 from '~/services/tests_v2.services'

export const createTestController_v2 = async (req: Request<ParamsDictionary, any, TestReqBody_v2>, res: Response) => {
  const result = await testsService_v2.createTest_v2(req.body)
  return res.json({
    message: 'Test created successfully',
    result
  })
}

export const addQuestionToTestController_v2 = async (req: Request, res: Response) => {
  const question = req.question_v2 as Question_v2
  const test = req.test_v2 as Test_v2
  const result = await testsService_v2.addQuestionToTest(question._id as ObjectId, test._id as ObjectId)
  return res.json({
    message: 'Add question to test successfully',
    result
  })
}

export const randomQuestionForTestController = async (
  req: Request<ParamsDictionary, any, RandomQuestReqBody>,
  res: Response
) => {
  const { _id } = req.test_v2 as Test_v2
  const result = await testsService_v2.randomQuestionForTest(_id as ObjectId, req.body as RandomQuestReqBody)
  return res.json({
    message: 'Add question to test successfully',
    result
  })
}

export const getListTestsController_v2 = async (
  req: Request<ParamsDictionary, any, any, TestQuery_v2>,
  res: Response
) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const { tests, total } = await testsService_v2.getListTests_v2({
    limit,
    page
  })
  return res.json({
    message: 'Get list of tests successfully',
    result: {
      tests,
      limit,
      page,
      total_page: Math.ceil(total / limit)
    }
  })
}

export const getTestDetailController_v2 = async (req: Request, res: Response) => {
  return res.json({
    message: 'Get test detail successfully',
    result: req.test_v2
  })
}

export const getFullTestDetailController_v2 = async (req: Request, res: Response) => {
  return res.json({
    message: 'Get full test detail successfully',
    result: req.test_v2
  })
}

export const updateTestController_v2 = async (
  req: Request<ParamsDictionary, any, UpdateTestReqBody_v2>,
  res: Response
) => {
  const { body } = req
  const test = await testsService_v2.updateTest_v2(body)
  return res.json({
    message: 'Update test successfully',
    result: test
  })
}

export const deleteQuestionFromTestController = async (req: Request, res: Response) => {
  await testsService_v2.deleteQuestionFromTest(req.question_v2?._id as ObjectId, req.test_v2?._id as ObjectId)
  return res.json({
    message: 'Delete question form test successfully'
  })
}

export const deleteTestController_v2 = async (req: Request, res: Response) => {
  await testsService_v2.deleteTest_v2(req.test_v2?._id as ObjectId)
  return res.json({
    message: 'Delete test successfully'
  })
}
