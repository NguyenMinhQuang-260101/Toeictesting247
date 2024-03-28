import { checkSchema } from 'express-validator'
import { CourseTypeQuery, DocumentTypeQuery } from '~/constants/enums'
import { SEARCH_MESSAGES } from '~/constants/message'
import { validate } from '~/utils/validation'

export const searchCourseValidator = validate(
  checkSchema(
    {
      title: {
        notEmpty: {
          errorMessage: SEARCH_MESSAGES.TITLE_MUST_NOT_BE_EMPTY
        },
        isString: {
          errorMessage: SEARCH_MESSAGES.TITLE_MUST_BE_STRING
        }
      },
      course_type_query: {
        optional: true,
        isIn: {
          options: [Object.values(CourseTypeQuery)],
          errorMessage: SEARCH_MESSAGES.COURSE_TYPE_QUERY_MUST_BE_IN_ENUM_VALUES_COURSE_TYPE_QUERY
        }
      }
    },
    ['query']
  )
)

export const searchDocumentValidator = validate(
  checkSchema(
    {
      title: {
        notEmpty: {
          errorMessage: SEARCH_MESSAGES.TITLE_MUST_NOT_BE_EMPTY
        },
        isString: {
          errorMessage: SEARCH_MESSAGES.TITLE_MUST_BE_STRING
        }
      },
      document_type_query: {
        optional: true,
        isIn: {
          options: [Object.values(DocumentTypeQuery)],
          errorMessage: SEARCH_MESSAGES.DOCUMENT_TYPE_QUERY_MUST_BE_IN_ENUM_VALUES_DOCUMENT_TYPE_QUERY
        }
      }
    },
    ['query']
  )
)
