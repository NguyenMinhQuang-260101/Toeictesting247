import { checkSchema } from 'express-validator'
import { Request } from 'express'
import { ObjectId } from 'mongodb'
import { CourseType, MediaType, OperatingStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { COURSES_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import Course from '~/models/schemas/Course.schema'
import databaseServices from '~/services/database.services'
import { numberEnumToArray } from '~/utils/commons'
import { validate } from '~/utils/validation'

const courseTypes = numberEnumToArray(CourseType)
const status = numberEnumToArray(OperatingStatus)
const mediaTypes = numberEnumToArray(MediaType)
export const createCourseValidator = validate(
  checkSchema({
    type: {
      isIn: {
        options: [courseTypes],
        errorMessage: COURSES_MESSAGES.COURSE_TYPE_INVALID
      }
    },
    title: {
      isString: true,
      errorMessage: COURSES_MESSAGES.TITLE_MUST_BE_STRING
    },
    description: {
      isString: true,
      errorMessage: COURSES_MESSAGES.DESCRIPTION_MUST_BE_STRING
    },
    content: {
      isString: true,
      errorMessage: COURSES_MESSAGES.CONTENT_MUST_BE_STRING
    },
    tests: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          // Yêu cầu mỗi phần tử trong mảng phải là test_id
          if (!value.every((item: any) => ObjectId.isValid(item))) {
            throw new Error(COURSES_MESSAGES.TEST_MUST_BE_AN_ARRAY_OF_TEST_ID)
          }
          return true
        }
      }
    },
    notification: {
      custom: {
        options: (value, { req }) => {
          if (value !== null && !ObjectId.isValid(value)) {
            throw new Error(COURSES_MESSAGES.NOTIFICATION_MUST_BE_AN_OBJECT_ID)
          }
          return true
        }
      }
    },
    thumbnails: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          // Yêu cầu mỗi phần tử trong mảng phải là Media Object
          if (
            value.some((item: any) => {
              return typeof item.url !== 'string' || !mediaTypes.includes(item.type)
            })
          ) {
            throw new Error(COURSES_MESSAGES.THUMBNAILS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT)
          }
          return true
        }
      }
    },
    status: {
      isIn: {
        options: [status],
        errorMessage: COURSES_MESSAGES.STATUS_INVALID
      }
    }
  })
)

export const courseIdValidator = validate(
  checkSchema(
    {
      course_id: {
        isMongoId: {
          errorMessage: COURSES_MESSAGES.COURSE_ID_INVALID
        },
        custom: {
          options: async (value, { req }) => {
            const [course] = await databaseServices.courses
              .aggregate<Course>([
                {
                  $match: {
                    _id: new ObjectId(value as string)
                  }
                },
                {
                  $lookup: {
                    from: 'tests',
                    localField: 'tests',
                    foreignField: '_id',
                    as: 'tests'
                  }
                },
                {
                  $addFields: {
                    tests: {
                      $map: {
                        input: '$tests',
                        as: 'test',
                        in: {
                          _id: '$$test._id',
                          course_id: '$$test.course_id',
                          title: '$$test.title'
                        }
                      }
                    }
                  }
                }
              ])
              .toArray()
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
    },
    ['params', 'body']
  )
)
