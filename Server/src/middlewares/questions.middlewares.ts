import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { MediaType } from '~/constants/enums'
import { QUESTIONS_MESSAGES } from '~/constants/message'
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
