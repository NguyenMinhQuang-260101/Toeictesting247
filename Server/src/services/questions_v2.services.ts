import { omit } from 'lodash'
import { ObjectId } from 'mongodb'
import { QuestionType } from '~/constants/enums'
import { QuestionReqBody_v2, UpdateQuestionReqBody_v2 } from '~/models/requests/Question_v2.requests'
import Question_v2 from '~/models/schemas/Question_v2.schema'
import databaseServices from './database.services'

class QuestionsService_v2 {
  async createQuestion_v2(body: QuestionReqBody_v2) {
    if (body.type === QuestionType.SimpleQuestion && body.parent_id) {
      throw new Error('Simple question cannot have a parent question')
    }

    if (body.type !== QuestionType.QuoteQuestion && body.parent_id) {
      throw new Error('Only quote question can have a parent question')
    }

    if (body.type === QuestionType.SimpleQuestion || body.type === QuestionType.QuoteQuestion) {
      if (body.answers.length < 3) {
        throw new Error('Simple question must have at least 3 answers')
      }
      if (!body.correct_at) {
        throw new Error('Simple question must have a correct answer')
      }
    }

    if (body.type === QuestionType.QuoteQuestion && !body.parent_id) {
      throw new Error('Quote question must have a parent question')
    }

    if (body.type === QuestionType.QuoteQuestion) {
      const parentQuestion = await databaseServices.questions_v2.findOne({
        _id: new ObjectId(body.parent_id as ObjectId)
      })
      const CountChildQuestion = await databaseServices.questions_v2.countDocuments({ parent_id: body.parent_id })
      if (parentQuestion?.type === QuestionType.DoubleQuestion && CountChildQuestion >= 2) {
        throw new Error('Double question can only have 2 child questions')
      } else if (parentQuestion?.type === QuestionType.TripleQuestion && CountChildQuestion >= 3) {
        throw new Error('Triple question can only have 3 child questions')
      } else if (parentQuestion?.type === QuestionType.QuadrupleQuestion && CountChildQuestion >= 4) {
        throw new Error('Quadruple question can only have 4 child questions')
      } else if (parentQuestion?.type === QuestionType.QuintupleQuestion && CountChildQuestion >= 5) {
        throw new Error('Quintuple question can only have 5 child questions')
      }
    }

    const result = await databaseServices.questions_v2.insertOne(
      new Question_v2({
        type: body.type,
        type_content: body.type_content,
        num_part: body.num_part,
        description: body.description,
        content: body.content,
        audio_content: body.audio_content,
        image_content: body.image_content,
        answers:
          body.type === QuestionType.QuoteQuestion || body.type === QuestionType.SimpleQuestion ? body.answers : [],
        correct_at:
          body.type === QuestionType.QuoteQuestion || body.type === QuestionType.SimpleQuestion
            ? body.correct_at
            : undefined,
        selected_at: body.selected_at,
        score: body.score,
        parent_id: body.type === QuestionType.QuoteQuestion ? new ObjectId(body.parent_id as ObjectId) : null
      })
    )

    const question = await databaseServices.questions_v2.findOne({ _id: result.insertedId })
    return question
  }

  async getListQuestions({ limit, page }: { page: number; limit: number }) {
    const questions = await databaseServices.questions_v2
      .aggregate<Question_v2>([
        {
          $match: {
            type: { $nin: [1] }
          }
        },
        {
          $sort: {
            num_quest: 1
          }
        },
        {
          $skip: limit * (page - 1)
        },
        {
          $limit: limit
        }
      ])
      .toArray()
    const total = await databaseServices.questions_v2.countDocuments({ type: { $nin: [1] } })
    return {
      questions,
      total
    }
  }

  async updateQuestion_v2(payload: UpdateQuestionReqBody_v2) {
    const question = await databaseServices.questions_v2.findOneAndUpdate(
      { _id: new ObjectId(payload.question_id) },
      {
        $set: {
          ...(omit(payload, ['question_id']) as UpdateQuestionReqBody_v2)
        },
        $currentDate: { updated_at: true }
      },
      { returnDocument: 'after' }
    )
    return question
  }

  async deleteQuestionController_v2(question_id: string) {
    await Promise.all([
      databaseServices.questions_v2.deleteOne({ _id: new ObjectId(question_id) }),
      databaseServices.questions_v2.deleteMany({ parent_id: new ObjectId(question_id) })
    ])
  }
}

const questionsService_v2 = new QuestionsService_v2()
export default questionsService_v2
