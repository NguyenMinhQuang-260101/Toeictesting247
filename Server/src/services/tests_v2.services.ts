import { ObjectId } from 'mongodb'
import { RandomQuestReqBody, TestReqBody_v2, UpdateTestReqBody_v2 } from '~/models/requests/Test_v2.requests'
import Test from '~/models/schemas/Test.schema'
import databaseServices from './database.services'
import Test_v2 from '~/models/schemas/Test_v2.schema'
import Question_v2 from '~/models/schemas/Question_v2.schema'
import { omit } from 'lodash'

class TestsController_v2 {
  async createTest_v2(body: TestReqBody_v2) {
    const result = await databaseServices.tests_v2.insertOne(
      new Test_v2({
        title: body.title,
        description: body.description,
        timeline: body.timeline,
        questions: body.questions
      })
    )
    const test = await databaseServices.tests_v2.findOne({ _id: result.insertedId })
    return test
  }

  async addQuestionToTest(question_id: ObjectId, test_id: ObjectId) {
    const question = await databaseServices.tests_v2.findOne({ _id: test_id, questions: { $in: [question_id] } })
    if (question) {
      throw new Error('Question already exists in a test')
    }

    const test = await databaseServices.tests_v2.findOneAndUpdate(
      { _id: test_id },
      { $push: { questions: question_id } },
      { returnDocument: 'after' }
    )

    return test
  }

  async randomQuestionForTest(test_id: ObjectId, body: RandomQuestReqBody) {
    const matchStage = {
      $match: {
        type: body.type_question,
        type_content: body.type_content_question
      }
    }
    const sampleStage = {
      $sample: {
        size: body.quantity_questions
      }
    }

    const list_question = await databaseServices.questions_v2
      .aggregate<Question_v2>([matchStage, sampleStage])
      .toArray()
    for (const question of list_question) {
      if (await databaseServices.tests_v2.findOne({ _id: test_id, questions: { $in: [question._id as ObjectId] } })) {
        continue
      }
      await this.addQuestionToTest(question._id as ObjectId, test_id)
    }
    const [result] = await databaseServices.tests_v2
      .aggregate([
        {
          $match: {
            _id: test_id
          }
        },
        {
          $lookup: {
            from: 'questions_v2',
            localField: 'questions',
            foreignField: '_id',
            as: 'questions'
          }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            timeline: 1,
            'questions._id': 1,
            'questions.type': 1,
            'questions.type_content': 1,
            'questions.num_part': 1,
            'questions.description': 1,
            'questions.content': 1,
            'questions.audio_content': 1,
            'questions.image_content': 1
          }
        },
        {
          $sort: { 'questions.num_part': 1 } // Sort the questions by num_part in ascending order
        }
      ])
      .toArray()

    return result
  }

  async getListTests_v2({ page, limit }: { page: number; limit: number }) {
    const tests = await databaseServices.tests_v2
      .aggregate<Test_v2>([
        {
          $skip: limit * (page - 1) // Công thức phân trang
        },
        {
          $limit: limit
        }
      ])
      .toArray()
    const total = await databaseServices.tests_v2.countDocuments()
    return {
      tests,
      total
    }
  }

  async updateTest_v2(payload: UpdateTestReqBody_v2) {
    const test = await databaseServices.tests_v2.findOneAndUpdate(
      { _id: new ObjectId(payload.test_id) },
      {
        $set: {
          ...(omit(payload, ['test_id']) as UpdateTestReqBody_v2)
        },
        $currentDate: { updated_at: true }
      },
      { returnDocument: 'after' }
    )

    return test
  }

  async deleteQuestionFromTest(question_id: ObjectId, test_id: ObjectId) {
    await databaseServices.tests_v2.findOneAndUpdate({ _id: test_id }, { $pull: { questions: question_id } })
  }

  async deleteTest_v2(test_id: ObjectId) {
    await databaseServices.tests_v2.findOneAndDelete({ _id: test_id })
  }
}

const testsService_v2 = new TestsController_v2()
export default testsService_v2
