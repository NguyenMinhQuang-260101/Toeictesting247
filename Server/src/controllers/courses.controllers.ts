import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CourseType } from '~/constants/enums'
import { CourseReqBody, UpdateCourseReqBody } from '~/models/requests/Course.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import Course from '~/models/schemas/Course.schema'
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

export const getListCourseController = async (req: Request, res: Response) => {
  const course_type = Number(req.query.course_type as string) as CourseType
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const { total, courses } = await coursesService.getListCourse({
    course_type,
    limit,
    page
  })
  return res.json({
    message: 'Get list course successfully',
    result: {
      courses,
      course_type,
      limit,
      page,
      total_page: Math.ceil(total / limit)
    }
  })
}

export const updateCourseController = async (
  req: Request<ParamsDictionary, any, UpdateCourseReqBody>,
  res: Response
) => {
  const { body } = req
  const course = await coursesService.updateCourse(body, req.course as Course)

  return res.json({
    message: 'Course updated successfully',
    result: course
  })
}

export const deleteCourseController = async (req: Request, res: Response) => {
  await coursesService.deleteCourse(req.course as Course)
  return res.json({
    message: 'Course deleted successfully'
  })
}
