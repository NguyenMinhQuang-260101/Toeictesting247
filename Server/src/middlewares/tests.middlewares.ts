import { Request } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { TESTS_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import Course from '~/models/schemas/Course.schema'
import Document from '~/models/schemas/Document.schema'
import Test from '~/models/schemas/Test.schema'
import databaseServices from '~/services/database.services'
import { validate } from '~/utils/validation'

const sourceIdSchema: ParamSchema = {
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
}

const testIdSchema: ParamSchema = {
  notEmpty: {
    errorMessage: TESTS_MESSAGES.SOURCE_ID_MUST_NOT_BE_EMPTY
  },
  custom: {
    options: (value, { req }) => {
      if (!ObjectId.isValid(value)) {
        throw new ErrorWithStatus({
          message: TESTS_MESSAGES.TEST_ID_MUST_BE_AN_OBJECT_ID,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
      return true
    }
  }
}

const titleSchema: ParamSchema = {
  notEmpty: {
    errorMessage: TESTS_MESSAGES.TITLE_MUST_NOT_BE_EMPTY
  },
  isString: {
    errorMessage: TESTS_MESSAGES.TITLE_MUST_BE_STRING
  }
}

const descriptionSchema: ParamSchema = {
  notEmpty: {
    errorMessage: TESTS_MESSAGES.DESCRIPTION_MUST_NOT_BE_EMPTY
  },
  isString: {
    errorMessage: TESTS_MESSAGES.DESCRIPTION_MUST_BE_STRING
  }
}

const timelineSchema: ParamSchema = {
  notEmpty: {
    errorMessage: TESTS_MESSAGES.TIMELINE_MUST_NOT_BE_EMPTY
  },
  isInt: {
    errorMessage: TESTS_MESSAGES.TIMELINE_MUST_BE_A_NUMBER
  }
}

export const createTestValidator = validate(
  checkSchema(
    {
      source_id: sourceIdSchema,
      title: titleSchema,
      description: descriptionSchema,
      timeline: timelineSchema,
      questions: {
        optional: true,
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
                    _id: new ObjectId(value as string)
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
          // ** Chỉ mới kiểm tra cho collection courses **
          // ** Cần kiểm tra thêm collection Document về sau **
          const course = await databaseServices.courses.findOne<Course>({ _id: new ObjectId(value as string) })
          const document = await databaseServices.documents.findOne<Document>({ _id: new ObjectId(value as string) })
          if (!course && !document) {
            throw new ErrorWithStatus({
              message: TESTS_MESSAGES.CAN_NOT_FOUND_COURSE_OR_DOCUMENT,
              status: HTTP_STATUS.NOT_FOUND
            })
          }
          if (course) {
            ;(req as Request).source = course
          } else if (document) {
            ;(req as Request).source = document
          }
          return true
        }
      }
    }
  })
)

export const testUpdateValidator = validate(
  checkSchema({
    test_id: testIdSchema,
    source_id: sourceIdSchema,
    title: {
      ...titleSchema,
      optional: true,
      notEmpty: undefined
    },
    description: {
      ...descriptionSchema,
      optional: true,
      notEmpty: undefined
    },
    timeline: {
      ...timelineSchema,
      optional: true,
      notEmpty: undefined
    }
  })
)
