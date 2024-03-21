import { TestReqBody } from '~/models/requests/Test.requests'
import databaseServices from './database.services'
import { ObjectId } from 'bson'
import Test from '~/models/schemas/Test.schema'

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
    const test = await databaseServices.tests.findOne({ _id: result.insertedId })
    return test
  }
}

const testsService = new TestsController()
export default testsService
