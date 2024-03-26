import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { DocumentType, MediaType, OperatingStatus } from '~/constants/enums'
import { DOCUMENTS_MESSAGES } from '~/constants/message'
import { numberEnumToArray } from '~/utils/commons'
import { validate } from '~/utils/validation'

const documentTypes = numberEnumToArray(DocumentType)
const status = numberEnumToArray(OperatingStatus)
const mediaTypes = numberEnumToArray(MediaType)

const typeSchema: ParamSchema = {
  isIn: {
    options: [documentTypes],
    errorMessage: DOCUMENTS_MESSAGES.DOCUMENT_TYPE_INVALID
  }
}

const titleSchema: ParamSchema = {
  notEmpty: {
    errorMessage: DOCUMENTS_MESSAGES.TITLE_MUST_NOT_BE_EMPTY
  },
  isString: {
    errorMessage: DOCUMENTS_MESSAGES.TITLE_MUST_BE_STRING
  }
}

const descriptionSchema: ParamSchema = {
  notEmpty: {
    errorMessage: DOCUMENTS_MESSAGES.DESCRIPTION_MUST_NOT_BE_EMPTY
  },
  isString: {
    errorMessage: DOCUMENTS_MESSAGES.DESCRIPTION_MUST_BE_STRING
  }
}

const contentSchema: ParamSchema = {
  notEmpty: {
    errorMessage: DOCUMENTS_MESSAGES.CONTENT_MUST_NOT_BE_EMPTY
  },
  isString: {
    errorMessage: DOCUMENTS_MESSAGES.CONTENT_MUST_BE_STRING
  }
}

const thumbnailSchema: ParamSchema = {
  isArray: true,
  custom: {
    options: (value, { req }) => {
      // Yêu cầu mỗi phần tử trong mảng phải là Media Object
      if (
        value.some((item: any) => {
          return typeof item.url !== 'string' || !mediaTypes.includes(item.type)
        })
      ) {
        throw new Error(DOCUMENTS_MESSAGES.THUMBNAILS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT)
      }
      return true
    }
  }
}

const statusSchema: ParamSchema = {
  isIn: {
    options: [status],
    errorMessage: DOCUMENTS_MESSAGES.STATUS_INVALID
  }
}

export const createDocumentValidator = validate(
  checkSchema({
    type: typeSchema,
    title: titleSchema,
    description: descriptionSchema,
    content: contentSchema,
    tests: {
      optional: true,
      isArray: true,
      custom: {
        options: (value, { req }) => {
          // Yêu cầu mỗi phần tử trong mảng phải là test_id
          if (!value.every((item: any) => ObjectId.isValid(item))) {
            throw new Error(DOCUMENTS_MESSAGES.TEST_MUST_BE_AN_ARRAY_OF_TEST_ID)
          }
          return true
        }
      }
    },
    notification: {
      optional: true,
      custom: {
        options: (value, { req }) => {
          if (value !== null && !ObjectId.isValid(value)) {
            throw new Error(DOCUMENTS_MESSAGES.NOTIFICATION_MUST_BE_AN_OBJECT_ID)
          }
          return true
        }
      }
    },
    thumbnails: thumbnailSchema
  })
)
