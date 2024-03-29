import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TestParams, TestQuery, TestReqBody } from '~/models/requests/Test.requests'
import Course from '~/models/schemas/Course.schema'
import Test from '~/models/schemas/Test.schema'
import testsService from '~/services/tests.services'
import Document from '~/models/schemas/Document.schema'

export const createTestController = async (req: Request<ParamsDictionary, any, TestReqBody>, res: Response) => {
  const result = await testsService.createTest(req.body, req.source as Course | Document)
  return res.json({
    message: 'Test created successfully',
    result
  })
}

export const getListTestsController = async (req: Request<TestParams, any, any, TestQuery>, res: Response) => {
  const source_id = req.params.source_id
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const { tests, total } = await testsService.getListTests({
    source_id,
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

export const getTestDetailController = async (req: Request, res: Response) => {
  return res.json({
    message: 'Get test detail successfully',
    result: req.test
  })
}

export const getFullTestDetailController = async (req: Request, res: Response) => {
  return res.json({
    message: 'Get full test detail successfully',
    result: req.test
  })
}

export const updateTestController = async (req: Request, res: Response) => {
  const { body } = req
  const test = await testsService.updateTest(body, req.source as Course | Document)
  return res.json({
    message: 'Update test successfully',
    result: test
  })
}

export const deleteTestController = async (req: Request, res: Response) => {
  await testsService.deleteTest(req.test as Test, req.source as Course | Document)
  return res.json({
    message: 'Delete test successfully'
  })
}
