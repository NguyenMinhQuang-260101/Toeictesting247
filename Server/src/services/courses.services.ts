import { CourseReqBody } from '~/models/requests/Course.requests'
import databaseServices from './database.services'
import Course from '~/models/schemas/Course.schema'
import { ObjectId } from 'mongodb'

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
}

const coursesService = new CoursesService()
export default coursesService
