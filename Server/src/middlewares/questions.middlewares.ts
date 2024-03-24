import { checkSchema } from 'express-validator'
import { Request } from 'express'
import { ObjectId } from 'mongodb'
import { MediaType } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { QUESTIONS_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import Question from '~/models/schemas/Question.schema'
import databaseServices from '~/services/database.services'
import { numberEnumToArray } from '~/utils/commons'
import { validate } from '~/utils/validation'

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
    num_quest: {
      isInt: {
        errorMessage: QUESTIONS_MESSAGES.NUM_QUEST_MUST_BE_A_NUMBER
      }
    },
    description: {
      isString: {
        errorMessage: QUESTIONS_MESSAGES.DESCRIPTION_MUST_BE_STRING
      }
    },
    content: {
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
    },
    answers: {
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
    },
    correct_at: {
      custom: {
        options: (value, { req }) => {
          if (typeof value.order_answer !== 'string' || typeof value.content_answer !== 'string') {
            throw new Error(QUESTIONS_MESSAGES.CORRECT_AT_MUST_BE_AN_ANSWER_OBJECT)
          }
          return true
        }
      }
    },
    selected_at: {
      optional: true,
      custom: {
        options: (value, { req }) => {
          if (value !== null && (typeof value.order_answer !== 'string' || typeof value.content_answer !== 'string')) {
            throw new Error(QUESTIONS_MESSAGES.SELECTED_AT_MUST_BE_AN_ANSWER_OBJECT)
          }
          return true
        }
      }
    },
    score: {
      isInt: {
        errorMessage: QUESTIONS_MESSAGES.SCORE_MUST_BE_A_NUMBER
      }
    }
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
