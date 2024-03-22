import { QuestionReqBody } from '~/models/requests/Question.requests'
import databaseServices from './database.services'
import Question from '~/models/schemas/Question.schema'
import { ObjectId } from 'mongodb'

class QuestionsService {
  async createQuestion(body: QuestionReqBody) {
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
    const question = await databaseServices.questions.findOne({ _id: result.insertedId })
    return question
  }
}

const questionsService = new QuestionsService()
export default questionsService
