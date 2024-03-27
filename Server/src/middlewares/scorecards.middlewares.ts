import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { MediaType } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { QUESTIONS_MESSAGES, SCORECARDS_MESSAGES, TESTS_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import { Answer } from '~/models/Other'
import databaseServices from '~/services/database.services'
import { numberEnumToArray } from '~/utils/commons'
import { validate } from '~/utils/validation'

const mediaTypes = numberEnumToArray(MediaType)

export const crateScoreCardValidator = validate(
  checkSchema({
    total_time: {
      notEmpty: {
        errorMessage: SCORECARDS_MESSAGES.TOTAL_TIME_MUST_NOT_BE_EMPTY
      },
      isNumeric: {
        errorMessage: SCORECARDS_MESSAGES.TOTAL_TIME_MUST_BE_A_NUMBER
      }
    },
    questions: {
      isArray: {
        errorMessage: SCORECARDS_MESSAGES.QUESTIONS_MUST_BE_AN_ARRAY
      }
    },
    'questions.*._id': {
      isMongoId: {
        errorMessage: QUESTIONS_MESSAGES.QUESTION_ID_INVALID
      },
      custom: {
        options: async (value: string, { req }) => {
          if (!(await databaseServices.questions.findOne({ _id: new ObjectId(value as string) }))) {
            throw new ErrorWithStatus({
              message: QUESTIONS_MESSAGES.QUESTION_NOT_FOUND,
              status: HTTP_STATUS.NOT_FOUND
            })
          }
          return true
        }
      }
    },
    'questions.*.test_id': {
      isMongoId: {
        errorMessage: TESTS_MESSAGES.TEST_ID_INVALID
      },
      custom: {
        options: async (value, { req }) => {
          if (value !== req.body.test_id) {
            throw new ErrorWithStatus({
              message: SCORECARDS_MESSAGES.TEST_ID_QUESTION_MUST_BE_THE_SAME_AS_THE_TEST_ID_IN_THE_BODY,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }
          return true
        }
      }
    },
    'questions.*.num_quest': {
      notEmpty: {
        errorMessage: QUESTIONS_MESSAGES.NUM_QUEST_MUST_NOT_BE_EMPTY
      },
      isInt: {
        errorMessage: QUESTIONS_MESSAGES.NUM_QUEST_MUST_BE_A_NUMBER
      }
    },
    'questions.*.description': {
      notEmpty: {
        errorMessage: QUESTIONS_MESSAGES.DESCRIPTION_MUST_NOT_BE_EMPTY
      },
      isString: {
        errorMessage: QUESTIONS_MESSAGES.DESCRIPTION_MUST_BE_STRING
      }
    },
    'questions.*.content': {
      notEmpty: {
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
    },
    'questions.*.answers': {
      notEmpty: {
        errorMessage: QUESTIONS_MESSAGES.ANSWERS_MUST_NOT_BE_EMPTY
      },
      isArray: true,
      custom: {
        options: (value, { req }) => {
          if (
            value.some((item: Answer) => {
              return typeof item.order_answer !== 'string' || typeof item.content_answer !== 'string'
            })
          ) {
            throw new Error(QUESTIONS_MESSAGES.ANSWERS_MUST_BE_AN_ARRAY_OF_ANSWER_OBJECT)
          }
          return true
        }
      }
    },
    'questions.*.correct_at': {
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
    },
    'questions.*.selected_at': {
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
    'questions.*.score': {
      notEmpty: {
        errorMessage: QUESTIONS_MESSAGES.SCORE_MUST_NOT_BE_EMPTY
      },
      isInt: {
        errorMessage: QUESTIONS_MESSAGES.SCORE_MUST_BE_A_NUMBER
      }
    }
  })
)
