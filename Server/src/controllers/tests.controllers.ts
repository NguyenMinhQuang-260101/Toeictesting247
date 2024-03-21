import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TestReqBody } from '~/models/requests/Test.requests'
import testsService from '~/services/tests.services'

export const createTestController = async (req: Request<ParamsDictionary, any, TestReqBody>, res: Response) => {
  const result = await testsService.createTest(req.body)
  return res.json({
    message: 'Test created successfully',
    result
  })
}
