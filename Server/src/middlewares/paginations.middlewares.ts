import { checkSchema } from 'express-validator'
import { CourseType, DocumentType } from '~/constants/enums'
import { COURSES_MESSAGES, DOCUMENTS_MESSAGES } from '~/constants/message'
import { numberEnumToArray } from '~/utils/commons'
import { validate } from '~/utils/validation'

const documentTypes = numberEnumToArray(DocumentType)
const courseTypes = numberEnumToArray(CourseType)
export const paginationValidation = validate(
  checkSchema(
    {
      document_type: {
        optional: true,
        isIn: {
          options: [documentTypes],
          errorMessage: DOCUMENTS_MESSAGES.DOCUMENT_TYPE_INVALID
        }
      },
      course_type: {
        optional: true,
        isIn: {
          options: [courseTypes],
          errorMessage: COURSES_MESSAGES.COURSE_TYPE_INVALID
        }
      },
      limit: {
        isNumeric: true,
        custom: {
          options: (value, { req }) => {
            const num = Number(value)
            if (num > 100 || num < 1) {
              throw new Error('Limit must be between 1 and 100')
            }
            return true
          }
        }
      },
      page: {
        isNumeric: true,
        custom: {
          options: (value, { req }) => {
            const num = Number(value)
            if (num < 1) {
              throw new Error('Page must be greater than 0')
            }
            return true
          }
        }
      }
    },
    ['query']
  )
)
