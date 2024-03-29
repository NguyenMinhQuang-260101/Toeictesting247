import { ObjectId } from 'mongodb'
import { QuestionReqBody, UpdateQuestionReqBody } from '~/models/requests/Question.requests'
import Question from '~/models/schemas/Question.schema'
import databaseServices from './database.services'
import Course from '~/models/schemas/Course.schema'
import { OperatingStatus, UserRuleType } from '~/constants/enums'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { QUESTIONS_MESSAGES } from '~/constants/message'
import { omit } from 'lodash'
import Test from '~/models/schemas/Test.schema'
import Document from '~/models/schemas/Document.schema'

class QuestionsService {
  async createQuestion(body: QuestionReqBody, test: Test) {
    const [course, document] = await Promise.all([
      databaseServices.courses.findOne({ _id: test.source_id }),
      databaseServices.documents.findOne({ _id: test.source_id })
    ])

    if (course && course.status === OperatingStatus.Active) {
      throw new ErrorWithStatus({
        message: QUESTIONS_MESSAGES.CAN_ONLY_CREATE_QUESTION_WHEN_COURSE_OR_DOCUMENT_IS_UPDATING_OR_INACTIVE,
        status: HTTP_STATUS.BAD_REQUEST
      })
    } else if (document && document.status === OperatingStatus.Active) {
      throw new ErrorWithStatus({
        message: QUESTIONS_MESSAGES.CAN_ONLY_CREATE_QUESTION_WHEN_COURSE_OR_DOCUMENT_IS_UPDATING_OR_INACTIVE,
        status: HTTP_STATUS.BAD_REQUEST
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
      { $push: { questions: result.insertedId }, $currentDate: { updated_at: true } },
      { returnDocument: 'after' }
    )

    const question = await databaseServices.questions.findOne({ _id: result.insertedId })
    return question
  }

  async getListQuestions({
    rule,
    test,
    test_id,
    limit,
    page
  }: {
    rule: UserRuleType
    test: Test
    test_id: string
    page: number
    limit: number
  }) {
    const questions = await databaseServices.questions
      .aggregate<Question>([
        {
          $match: {
            test_id: new ObjectId(test_id)
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
    const total = await databaseServices.questions.countDocuments({ test_id: new ObjectId(test_id) })
    const [course, document] = await Promise.all([
      databaseServices.courses.findOne<Course>({ _id: test.source_id }),
      databaseServices.documents.findOne<Document>({ _id: test.source_id })
    ])
    if (rule === UserRuleType.User && course) {
      await databaseServices.courses.findOneAndUpdate(
        { _id: new ObjectId(course._id) },
        {
          $inc: {
            user_views: 1
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
    } else if (rule === UserRuleType.User && document) {
      await databaseServices.documents.findOneAndUpdate(
        { _id: new ObjectId(document._id) },
        {
          $inc: {
            user_views: 1
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
    }
    return {
      questions,
      total
    }
  }

  async updateQuestion(payload: UpdateQuestionReqBody, source: Course | Document) {
    const [course, document] = await Promise.all([
      databaseServices.courses.findOne<Course>({ _id: source._id }),
      databaseServices.documents.findOne<Document>({ _id: source._id })
    ])
    if (course && course.status === OperatingStatus.Active) {
      throw new ErrorWithStatus({
        message: QUESTIONS_MESSAGES.CAN_ONLY_UPDATE_QUESTION_WHEN_COURSE_OR_DOCUMENT_IS_UPDATING_OR_INACTIVE,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    if (document && document.status === OperatingStatus.Active) {
      throw new ErrorWithStatus({
        message: QUESTIONS_MESSAGES.CAN_ONLY_UPDATE_QUESTION_WHEN_COURSE_OR_DOCUMENT_IS_UPDATING_OR_INACTIVE,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const question = await databaseServices.questions.findOneAndUpdate(
      { _id: new ObjectId(payload.question_id) },
      {
        $set: {
          ...(omit(payload, ['question_id']) as UpdateQuestionReqBody)
        },
        $currentDate: { updated_at: true }
      },
      { returnDocument: 'after' }
    )
    return question
  }

  async deleteQuestion(question_id: string, source: Course | Document, test: Test) {
    const [course, document] = await Promise.all([
      databaseServices.courses.findOne<Course>({ _id: source._id }),
      databaseServices.documents.findOne<Document>({ _id: source._id })
    ])
    if (course && course.status === OperatingStatus.Active) {
      throw new ErrorWithStatus({
        message: QUESTIONS_MESSAGES.CAN_ONLY_DELETE_QUESTION_WHEN_COURSE_OR_DOCUMENT_IS_UPDATING_OR_INACTIVE,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    if (document && document.status === OperatingStatus.Active) {
      throw new ErrorWithStatus({
        message: QUESTIONS_MESSAGES.CAN_ONLY_DELETE_QUESTION_WHEN_COURSE_OR_DOCUMENT_IS_UPDATING_OR_INACTIVE,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    await Promise.all([
      databaseServices.questions.deleteOne({ _id: new ObjectId(question_id) }),
      databaseServices.tests.findOneAndUpdate(
        { _id: test._id },
        { $pull: { questions: new ObjectId(question_id) }, $currentDate: { updated_at: true } }
      )
    ])
  }
}

const questionsService = new QuestionsService()
export default questionsService
