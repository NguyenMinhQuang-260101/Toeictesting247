import { checkSchema } from 'express-validator'
import { Request } from 'express'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { COURSES_MESSAGES, TESTS_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import Test from '~/models/schemas/Test.schema'
import databaseServices from '~/services/database.services'
import { validate } from '~/utils/validation'
import Course from '~/models/schemas/Course.schema'

export const createTestValidator = validate(
  checkSchema(
    {
      source_id: {
        notEmpty: {
          errorMessage: TESTS_MESSAGES.SOURCE_ID_MUST_NOT_BE_EMPTY
        },
        custom: {
          options: (value, { req }) => {
            if (!ObjectId.isValid(value)) {
              throw new Error(TESTS_MESSAGES.SOURCE_ID_MUST_BE_AN_OBJECT_ID)
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
            const [test] = await databaseServices.tests
              .aggregate<Test>([
                {
                  $match: {
                    _id: new ObjectId(value as string)
                  }
                },
                {
                  $project: {
                    questions: 0
                  }
                }
              ])
              .toArray()
            if (!test) {
              throw new ErrorWithStatus({
                message: TESTS_MESSAGES.TEST_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            ;(req as Request).test = test
            return true
          }
        }
      }
    },
    ['params', 'body']
  )
)

export const fullTestIdValidator = validate(
  checkSchema(
    {
      test_id: {
        isMongoId: {
          errorMessage: TESTS_MESSAGES.TEST_ID_INVALID
        },
        custom: {
          options: async (value, { req }) => {
            const [test] = await databaseServices.tests
              .aggregate<Test>([
                {
                  $match: {
                    _id: new ObjectId('65fd0d1cbe2653f8beb74a30')
                  }
                },
                {
                  $lookup: {
                    from: 'questions',
                    localField: 'questions',
                    foreignField: '_id',
                    as: 'questions'
                  }
                }
              ])
              .toArray()
            if (!test) {
              throw new ErrorWithStatus({
                message: TESTS_MESSAGES.TEST_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            ;(req as Request).test = test
            return true
          }
        }
      }
    },
    ['params', 'body']
  )
)

export const sourceIdValidator = validate(
  checkSchema({
    source_id: {
      isMongoId: {
        errorMessage: TESTS_MESSAGES.SOURCE_ID_INVALID
      },
      custom: {
        options: async (value, { req }) => {
          const course = await databaseServices.courses.findOne<Course>({ _id: new ObjectId(value as string) })
          if (!course) {
            throw new ErrorWithStatus({
              message: COURSES_MESSAGES.COURSE_NOT_FOUND,
              status: HTTP_STATUS.NOT_FOUND
            })
          }
          ;(req as Request).course = course
          return true
        }
      }
    }
  })
)
