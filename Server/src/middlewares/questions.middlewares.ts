import { ParamSchema, checkSchema } from 'express-validator'
import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { MediaType } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { COURSES_MESSAGES, QUESTIONS_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import Question from '~/models/schemas/Question.schema'
import databaseServices from '~/services/database.services'
import { numberEnumToArray } from '~/utils/commons'
import { validate } from '~/utils/validation'

const numQuestSchema: ParamSchema = {
  isEmpty: {
    errorMessage: QUESTIONS_MESSAGES.NUM_QUEST_MUST_NOT_BE_EMPTY
  },
  isInt: {
    errorMessage: QUESTIONS_MESSAGES.NUM_QUEST_MUST_BE_A_NUMBER
  }
}

const descriptionSchema: ParamSchema = {
  notEmpty: {
    errorMessage: QUESTIONS_MESSAGES.DESCRIPTION_MUST_NOT_BE_EMPTY
  },
  isString: {
    errorMessage: QUESTIONS_MESSAGES.DESCRIPTION_MUST_BE_STRING
  }
}

const contentSchema: ParamSchema = {
  isEmpty: {
    errorMessage: QUESTIONS_MESSAGES.CONTENT_MUST_NOT_BE_EMPTY
  },
  custom: {
    options: (value, { req }) => {
      if (typeof value === 'string') {
        // Kiểm tra nếu giá trị là một chuỗi hoặc một mảng
        return true
      } else if (
        Array.isArray(value) &&
        value.every((item: any) => typeof item.url === 'string' && mediaTypes.includes(item.type))
      ) {
        return true
      } else {
        throw new Error(QUESTIONS_MESSAGES.CONTENT_MUST_BE_STRING_OR_MEDIA_OBJECT)
      }
    }
  }
}

const answerSchema: ParamSchema = {
  isArray: true,
  custom: {
    options: (value, { req }) => {
      if (
        value.some((item: any) => {
          return typeof item.order_answer !== 'string' || typeof item.content_answer !== 'string'
        })
      ) {
        throw new Error(QUESTIONS_MESSAGES.ANSWERS_MUST_BE_AN_ARRAY_OF_ANSWER_OBJECT)
      }
      return true
    }
  }
}

const correctAtSchema: ParamSchema = {
  notEmpty: {
    errorMessage: QUESTIONS_MESSAGES.CORRECT_AT_MUST_NOT_BE_EMPTY
  },
  custom: {
    options: (value, { req }) => {
      if (typeof value.order_answer !== 'string' || typeof value.content_answer !== 'string') {
        throw new Error(QUESTIONS_MESSAGES.CORRECT_AT_MUST_BE_AN_ANSWER_OBJECT)
      }
      return true
    }
  }
}

const selectedAtSchema: ParamSchema = {
  notEmpty: {
    errorMessage: QUESTIONS_MESSAGES.SELECTED_AT_MUST_NOT_BE_EMPTY
  },
  custom: {
    options: (value, { req }) => {
      if (value !== null && (typeof value.order_answer !== 'string' || typeof value.content_answer !== 'string')) {
        throw new Error(QUESTIONS_MESSAGES.SELECTED_AT_MUST_BE_AN_ANSWER_OBJECT)
      }
      return true
    }
  }
}

const scoreSchema: ParamSchema = {
  notEmpty: {
    errorMessage: QUESTIONS_MESSAGES.SCORE_MUST_NOT_BE_EMPTY
  },
  isInt: {
    errorMessage: QUESTIONS_MESSAGES.SCORE_MUST_BE_A_NUMBER
  }
}

const mediaTypes = numberEnumToArray(MediaType)

export const createQuestionValidator = validate(
  checkSchema({
    test_id: {
      isString: {
        errorMessage: QUESTIONS_MESSAGES.TEST_ID_MUST_BE_STRING
      },
      custom: {
        options: (value, { req }) => {
          if (!ObjectId.isValid(value)) {
            throw new Error(QUESTIONS_MESSAGES.TEST_ID_MUST_BE_AN_OBJECT_ID)
          }
          return true
        }
      }
    },
    num_quest: numQuestSchema,
    description: descriptionSchema,
    content: contentSchema,
    answers: answerSchema,
    correct_at: correctAtSchema,
    selected_at: {
      ...selectedAtSchema,
      optional: true,
      notEmpty: undefined
    },
    score: scoreSchema
  })
)

export const questionIdValidator = validate(
  checkSchema(
    {
      question_id: {
        isMongoId: {
          errorMessage: QUESTIONS_MESSAGES.QUESTION_ID_INVALID
        },
        custom: {
          options: async (value, { req }) => {
            const [question] = await databaseServices.questions
              .aggregate<Question>([
                {
                  $match: {
                    _id: new ObjectId(value as string)
                  }
                },
                {
                  $lookup: {
                    from: 'tests',
                    localField: 'test_id',
                    foreignField: '_id',
                    as: 'origin'
                  }
                },
                {
                  $unwind: {
                    path: '$origin'
                  }
                },
                {
                  $addFields: {
                    origin_id: '$origin.source_id'
                  }
                },
                {
                  $unset: 'origin'
                }
              ])
              .toArray()
            if (!question) {
              throw new ErrorWithStatus({
                message: QUESTIONS_MESSAGES.QUESTION_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            ;(req as Request).question = question
            return true
          }
        }
      }
    },
    ['params', 'body']
  )
)

export const originIdValidator = async (req: Request, res: Response, next: NextFunction) => {
  const question = req.question
  if (question) {
    // console.log(question.origin_id)
    const course = await databaseServices.courses.findOne({ _id: new ObjectId(question.origin_id) })
    if (!course) {
      return next(
        new ErrorWithStatus({
          message: QUESTIONS_MESSAGES.COURSE_OF_QUESTION_NOT_FOUND,
          status: HTTP_STATUS.NOT_FOUND
        })
      )
    }
    ;(req as Request).course = course
  }

  // Nhớ next() để chạy tiếp middleware tiếp theo không thì sẽ bị treo
  next()
}

export const updateQuestionValidator = validate(
  checkSchema({
    num_quest: {
      ...numQuestSchema,
      optional: true,
      notEmpty: undefined
    },
    description: {
      ...descriptionSchema,
      optional: true,
      notEmpty: undefined
    },
    content: {
      ...contentSchema,
      optional: true,
      notEmpty: undefined
    },
    answers: {
      ...answerSchema,
      optional: true,
      notEmpty: undefined
    },
    correct_at: {
      ...correctAtSchema,
      optional: true,
      notEmpty: undefined
    },
    selected_at: {
      ...selectedAtSchema,
      optional: true,
      notEmpty: undefined
    },
    score: {
      ...scoreSchema,
      optional: true,
      notEmpty: undefined
    }
  })
)
