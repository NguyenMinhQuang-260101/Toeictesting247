import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { TESTS_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import databaseServices from '~/services/database.services'
import { validate } from '~/utils/validation'

export const createTestValidator = validate(
  checkSchema(
    {
      course_id: {
        notEmpty: {
          errorMessage: TESTS_MESSAGES.COURSE_ID_MUST_NOT_BE_EMPTY
        },
        custom: {
          options: (value, { req }) => {
            if (!ObjectId.isValid(value)) {
              throw new Error(TESTS_MESSAGES.COURSE_ID_MUST_BE_AN_OBJECT_ID)
            }
            return true
          }
        }
      },
      title: {
        notEmpty: {
          errorMessage: TESTS_MESSAGES.TITLE_MUST_NOT_BE_EMPTY
        },
        isString: {
          errorMessage: TESTS_MESSAGES.TITLE_MUST_BE_STRING
        }
      },
      description: {
        notEmpty: {
          errorMessage: TESTS_MESSAGES.DESCRIPTION_MUST_NOT_BE_EMPTY
        },
        isString: {
          errorMessage: TESTS_MESSAGES.DESCRIPTION_MUST_BE_STRING
        }
      },
      timeline: {
        notEmpty: {
          errorMessage: TESTS_MESSAGES.TIMELINE_MUST_NOT_BE_EMPTY
        },
        isInt: {
          errorMessage: TESTS_MESSAGES.TIMELINE_MUST_BE_A_NUMBER
        }
      },
      questions: {
        isArray: true,
        custom: {
          options: (value, { req }) => {
            // Yêu cầu mỗi phần tử trong mảng phải là question_id
            if (!value.every((item: any) => ObjectId.isValid(item))) {
              throw new Error(TESTS_MESSAGES.QUESTIONS_MUST_BE_AN_ARRAY_OF_QUESTION_ID)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const testIdValidator = validate(
  checkSchema(
    {
      test_id: {
        isMongoId: {
          errorMessage: TESTS_MESSAGES.TEST_ID_INVALID
        },
        custom: {
          options: async (value, { req }) => {
            const test = await databaseServices.tests.findOne({ _id: new ObjectId(value as string) })
            if (!test) {
              throw new ErrorWithStatus({
                message: TESTS_MESSAGES.TEST_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            return true
          }
        }
      }
    },
    ['params', 'body']
  )
)
