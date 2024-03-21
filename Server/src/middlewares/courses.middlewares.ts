import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { CourseType, MediaType, OperatingStatus } from '~/constants/enums'
import { COURSES_MESSAGES } from '~/constants/message'
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
