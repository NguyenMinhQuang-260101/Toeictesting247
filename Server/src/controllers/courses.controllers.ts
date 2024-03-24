import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { COURSES_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import { CourseReqBody } from '~/models/requests/Course.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import coursesService from '~/services/courses.services'

export const createCourseController = async (req: Request<ParamsDictionary, any, CourseReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await coursesService.createCourse(user_id, req.body)
  return res.json({
    message: 'Course created successfully',
    result
  })
}

export const getCourseDetailController = async (req: Request, res: Response) => {
  return res.json({
    message: 'Get course detail successfully',
    result: req.course
  })
}
