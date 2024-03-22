import { QuestionReqBody } from '~/models/requests/Question.requests'
import databaseServices from './database.services'
import Question from '~/models/schemas/Question.schema'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { QUESTIONS_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'

class QuestionsService {
  async createQuestion(body: QuestionReqBody) {
    const test = await databaseServices.tests.findOne({ _id: new ObjectId(body.test_id) })
    if (!test) {
      throw new ErrorWithStatus({
        message: QUESTIONS_MESSAGES.TEST_ID_DOES_NOT_EXIST,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const result = await databaseServices.questions.insertOne(
      new Question({
        test_id: new ObjectId(body.test_id),
        num_quest: body.num_quest,
        description: body.description,
        content: body.content,
        answers: body.answers,
        correct_at: body.correct_at,
        selected_at: body.selected_at,
        score: body.score
      })
    )

    await databaseServices.tests.findOneAndUpdate(
      { _id: new ObjectId(body.test_id) },
      { $push: { questions: result.insertedId } },
      { returnDocument: 'after' }
    )

    const question = await databaseServices.questions.findOne({ _id: result.insertedId })
    return question
  }
}

const questionsService = new QuestionsService()
export default questionsService
