import { CourseReqBody, UpdateCourseReqBody } from '~/models/requests/Course.requests'
import databaseServices from './database.services'
import Course from '~/models/schemas/Course.schema'
import { ObjectId } from 'mongodb'
import { omit } from 'lodash'
import { OperatingStatus } from '~/constants/enums'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { COURSES_MESSAGES } from '~/constants/message'

class CoursesService {
  async createCourse(user_id: string, body: CourseReqBody) {
    const result = await databaseServices.courses.insertOne(
      new Course({
        user_id: new ObjectId(user_id),
        title: body.title,
        description: body.description,
        content: body.content,
        tests: body.tests,
        thumbnails: body.thumbnails,
        notification: body.notification,
        type: body.type
      })
    )
    const course = await databaseServices.courses.findOne({ _id: result.insertedId })
    return course
  }

  async updateCourse(payload: UpdateCourseReqBody, course: Course) {
    if (payload.status === OperatingStatus.Inactive && course.status === OperatingStatus.Active) {
      throw new ErrorWithStatus({
        message: COURSES_MESSAGES.INACTIVE_STATUS_CAN_ONLY_BE_SWITCHED_BY_CREATING_A_NOTIFICATION,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    if (payload.status === OperatingStatus.Active && course.status === OperatingStatus.Updating) {
      throw new ErrorWithStatus({
        message: COURSES_MESSAGES.ACTIVE_STATUS_CAN_ONLY_BE_SWITCHED_WHEN_NOTIFICATION_EXPIRED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    if (course.status === OperatingStatus.Active) {
      throw new ErrorWithStatus({
        message: COURSES_MESSAGES.CANNOT_UPDATE_ACTIVE_COURSE,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const new_course = await databaseServices.courses.findOneAndUpdate(
      { _id: new ObjectId(payload.course_id) },
      {
        $set: {
          ...(omit(payload, ['course_id']) as UpdateCourseReqBody)
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return new_course
  }
}

const coursesService = new CoursesService()
export default coursesService
