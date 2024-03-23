import { ObjectId } from 'bson'
import { TestReqBody } from '~/models/requests/Test.requests'
import Test from '~/models/schemas/Test.schema'
import databaseServices from './database.services'

class TestsController {
  async createTest(body: TestReqBody) {
    const result = await databaseServices.tests.insertOne(
      new Test({
        course_id: new ObjectId(body.course_id),
        title: body.title,
        description: body.description,
        timeline: body.timeline,
        questions: body.questions
      })
    )

    await databaseServices.courses.findOneAndUpdate(
      { _id: new ObjectId(body.course_id) },
      { $push: { tests: result.insertedId }, $currentDate: { updated_at: true } },
      { returnDocument: 'after' }
    )

    const test = await databaseServices.tests.findOne({ _id: result.insertedId })
    return test
  }
}

const testsService = new TestsController()
export default testsService
