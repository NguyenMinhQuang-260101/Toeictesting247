import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CourseReqBody } from '~/models/requests/Course.requests'

export const createCourseController = async (req: Request<ParamsDictionary, any, CourseReqBody>, res: Response) => {
  res.send('Create course controller')
}
