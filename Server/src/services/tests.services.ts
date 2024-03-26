import { TestReqBody, UpdateTestReqBody } from '~/models/requests/Test.requests'
import Course from '~/models/schemas/Course.schema'
import Test from '~/models/schemas/Test.schema'
import Document from '~/models/schemas/Document.schema'
import databaseServices from './database.services'
import { omit } from 'lodash'
import { OperatingStatus } from '~/constants/enums'
import { ErrorWithStatus } from '~/models/Errors'
import { TESTS_MESSAGES } from '~/constants/message'
import HTTP_STATUS from '~/constants/httpStatus'
import { ObjectId } from 'mongodb'

class TestsController {
  async createTest(body: TestReqBody, source: Course | Document) {
    const course = await databaseServices.courses.findOne({ _id: new ObjectId(body.source_id) })

    if (course) {
      const course = source as Course
      if (course.status === OperatingStatus.Active) {
        throw new ErrorWithStatus({
          message: TESTS_MESSAGES.CAN_NOT_CREATE_TEST_WHEN_COURSE_OR_DOCUMENT_IS_ACTIVE,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }

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
    } else {
      const document = source as Document
      if (document.status === OperatingStatus.Active) {
        throw new ErrorWithStatus({
          message: TESTS_MESSAGES.CAN_NOT_CREATE_TEST_WHEN_COURSE_OR_DOCUMENT_IS_ACTIVE,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }

      const result = await databaseServices.tests.insertOne(
        new Test({
          source_id: new ObjectId(body.source_id),
          title: body.title,
          description: body.description,
          timeline: body.timeline,
          questions: body.questions
        })
      )

      if (document) {
        await databaseServices.documents.findOneAndUpdate(
          { _id: new ObjectId(body.source_id) },
          { $push: { tests: result.insertedId }, $currentDate: { updated_at: true } },
          { returnDocument: 'after' }
        )
      }

      const test = await databaseServices.tests.findOne({ _id: result.insertedId })
      return test
    }
  }

  async updateTest(payload: UpdateTestReqBody, source: Course | Document) {
    const _payload = payload.source_id ? { ...payload, source_id: new ObjectId(payload.source_id) } : payload
    const course = (await databaseServices.courses.findOne({ _id: new ObjectId(payload.source_id) })) as Course
    if (course) {
      if (course.status === OperatingStatus.Active) {
        throw new ErrorWithStatus({
          message: TESTS_MESSAGES.CAN_NOT_UPDATE_TEST_WHEN_COURSE_OR_DOCUMENT_IS_ACTIVE,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
    } else {
      const document = source as Document
      if (document.status === OperatingStatus.Active) {
        throw new ErrorWithStatus({
          message: TESTS_MESSAGES.CAN_NOT_UPDATE_TEST_WHEN_COURSE_OR_DOCUMENT_IS_ACTIVE,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
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

  async deleteTest(test: Test, source: Course | Document) {
    const course = (await databaseServices.courses.findOne({ _id: new ObjectId(test.source_id) })) as Course
    if (course) {
      if (course.status === OperatingStatus.Active) {
        throw new ErrorWithStatus({
          message: TESTS_MESSAGES.CAN_NOT_DELETE_TEST_WHEN_COURSE_OR_DOCUMENT_IS_ACTIVE,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
    } else {
      const document = source as Document
      if (document.status === OperatingStatus.Active) {
        throw new ErrorWithStatus({
          message: TESTS_MESSAGES.CAN_NOT_DELETE_TEST_WHEN_COURSE_OR_DOCUMENT_IS_ACTIVE,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
    }

    await Promise.all([
      databaseServices.tests.findOneAndDelete({ _id: test._id }),
      databaseServices.courses.findOne({ _id: new ObjectId(test.source_id) }).then((course) => {
        if (course) {
          databaseServices.courses.findOneAndUpdate(
            { _id: new ObjectId(test.source_id) },
            { $pull: { tests: test._id }, $currentDate: { updated_at: true } }
          )
        } else {
          databaseServices.documents.findOneAndUpdate(
            { _id: new ObjectId(test.source_id) },
            { $pull: { tests: test._id }, $currentDate: { updated_at: true } }
          )
        }
      })
    ])
  }
}

const testsService = new TestsController()
export default testsService
