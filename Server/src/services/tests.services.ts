import { ObjectId } from 'bson'
import { TestReqBody } from '~/models/requests/Test.requests'
import Course from '~/models/schemas/Course.schema'
import Test from '~/models/schemas/Test.schema'
import databaseServices from './database.services'

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
}

const testsService = new TestsController()
export default testsService
