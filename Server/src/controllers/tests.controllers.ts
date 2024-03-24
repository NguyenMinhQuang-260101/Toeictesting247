import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TestReqBody } from '~/models/requests/Test.requests'
import Course from '~/models/schemas/Course.schema'
import testsService from '~/services/tests.services'

export const createTestController = async (req: Request<ParamsDictionary, any, TestReqBody>, res: Response) => {
  const result = await testsService.createTest(req.body, req.course as Course)
  return res.json({
    message: 'Test created successfully',
    result
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