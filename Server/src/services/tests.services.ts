import { ObjectId } from 'bson'
import { TestReqBody, UpdateTestReqBody } from '~/models/requests/Test.requests'
import Course from '~/models/schemas/Course.schema'
import Test from '~/models/schemas/Test.schema'
import databaseServices from './database.services'
import { omit } from 'lodash'
import { OperatingStatus } from '~/constants/enums'
import { ErrorWithStatus } from '~/models/Errors'
import { TESTS_MESSAGES } from '~/constants/message'
import HTTP_STATUS from '~/constants/httpStatus'

class TestsController {
  async createTest(body: TestReqBody, course: Course) {
    const result = await databaseServices.tests.insertOne(
      new Test({
        source_id: new ObjectId(body.source_id),
        title: body.title,
        description: body.description,
        timeline: body.timeline,
        questions: body.questions
      })
    )

    if (course) {
      await databaseServices.courses.findOneAndUpdate(
        { _id: new ObjectId(body.source_id) },
        { $push: { tests: result.insertedId }, $currentDate: { updated_at: true } },
        { returnDocument: 'after' }
      )
    }

    const test = await databaseServices.tests.findOne({ _id: result.insertedId })
    return test
  }

  async updateTest(payload: UpdateTestReqBody, course: Course) {
    const _payload = payload.source_id ? { ...payload, source_id: new ObjectId(payload.source_id) } : payload
    if (course.status === OperatingStatus.Active) {
      throw new ErrorWithStatus({
        message: TESTS_MESSAGES.CAN_ONLY_UPDATE_TEST_WHEN_COURSE_IS_UPDATING_OR_INACTIVE,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const test = await databaseServices.tests.findOneAndUpdate(
      { _id: new ObjectId(payload.test_id) },
      {
        $set: {
          ...(omit(_payload, ['test_id', 'source_id']) as UpdateTestReqBody & { source_id?: ObjectId })
        },
        $currentDate: { updated_at: true }
      },
      { returnDocument: 'after' }
    )

    return test
  }
}

const testsService = new TestsController()
export default testsService
