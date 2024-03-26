import { Request } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { NotificationType, TargetType } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { NOTIFICATIONS_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import Notification from '~/models/schemas/Notification.schema'
import databaseServices from '~/services/database.services'
import { numberEnumToArray } from '~/utils/commons'
import { validate } from '~/utils/validation'

const daySchema: ParamSchema = {
  notEmpty: {
    errorMessage: NOTIFICATIONS_MESSAGES.DAY_NOT_EMPTY
  },
  isISO8601: {
    options: {
      strict: true,
      strictSeparator: true
    },
    errorMessage: NOTIFICATIONS_MESSAGES.DAY_MUST_BE_ISO8601
  }
}

const titleSchema: ParamSchema = {
  notEmpty: {
    errorMessage: NOTIFICATIONS_MESSAGES.TITLE_NOT_EMPTY
  },
  isString: {
    errorMessage: NOTIFICATIONS_MESSAGES.TITLE_MUST_BE_STRING
  }
}

const contentSchema: ParamSchema = {
  notEmpty: {
    errorMessage: NOTIFICATIONS_MESSAGES.CONTENT_NOT_EMPTY
  },
  isString: {
    errorMessage: NOTIFICATIONS_MESSAGES.CONTENT_MUST_BE_STRING
  }
}

const notificationTypes = numberEnumToArray(NotificationType)
const targetTypes = numberEnumToArray(TargetType)

export const createNotificationValidator = validate(
  checkSchema({
    type: {
      notEmpty: {
        errorMessage: NOTIFICATIONS_MESSAGES.TYPE_OF_NOTIFICATION_NOT_EMPTY
      },
      isIn: {
        options: [notificationTypes],
        errorMessage: NOTIFICATIONS_MESSAGES.TYPE_INVALID
      }
    },
    title: titleSchema,
    content: contentSchema,
    target_type: {
      custom: {
        options: (value, { req }) => {
          if (req.body.type === NotificationType.Update) {
            if (!value) {
              throw new Error(NOTIFICATIONS_MESSAGES.TARGET_TYPE_NOT_EMPTY)
            }
            if (value && !targetTypes.includes(value)) {
              throw new Error(NOTIFICATIONS_MESSAGES.TARGET_TYPE_INVALID)
            }
          }
          return true
        }
      }
    },
    targets: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          // Yêu cầu mỗi phần tử trong mảng phải là ObjectId
          if (!value.every((item: any) => ObjectId.isValid(new ObjectId(item as string)))) {
            throw new Error(NOTIFICATIONS_MESSAGES.TARGETS_MUST_BE_AN_ARRAY_OF_OBJECT_ID)
          }
          return true
        }
      }
    },
    start_at: {
      ...daySchema,
      custom: {
        options: (value, { req }) => {
          if (new Date(value) < new Date()) {
            throw new ErrorWithStatus({
              message: NOTIFICATIONS_MESSAGES.START_AT_MUST_BE_GREATER_THAN_CURRENT_DATE,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }
          if (new Date(value) > new Date(req.body.end_at)) {
            throw new ErrorWithStatus({
              message: NOTIFICATIONS_MESSAGES.START_AT_MUST_BE_LESS_THAN_END_AT,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }
          return true
        }
      }
    },
    end_at: {
      ...daySchema,
      custom: {
        options: (value, { req }) => {
          if (new Date(value) < new Date(req.body.start_at)) {
            throw new ErrorWithStatus({
              message: NOTIFICATIONS_MESSAGES.END_AT_MUST_BE_GREATER_THAN_START_AT,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }
          return true
        }
      }
    }
  })
)

export const notificationIdValidator = validate(
  checkSchema(
    {
      notification_id: {
        isMongoId: {
          errorMessage: NOTIFICATIONS_MESSAGES.NOTIFICATION_ID_INVALID
        },
        custom: {
          options: async (value, { req }) => {
            const [notification] = await databaseServices.notifications
              .aggregate<Notification>([
                {
                  $match: {
                    _id: new ObjectId(value as string)
                  }
                },
                {
                  $lookup: {
                    from: 'courses',
                    localField: 'targets',
                    foreignField: '_id',
                    as: 'targets'
                  }
                },
                {
                  $addFields: {
                    targets: {
                      $map: {
                        input: '$targets',
                        as: 'target',
                        in: {
                          _id: '$$target._id',
                          user_id: '$$target.user_id',
                          type: '$$target.type',
                          title: '$$target.title',
                          thumbnail: '$$target.thumbnail'
                        }
                      }
                    }
                  }
                }
              ])
              .toArray()
            if (!notification) {
              throw new ErrorWithStatus({
                message: NOTIFICATIONS_MESSAGES.NOTIFICATION_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            ;(req as Request).notification = notification
          }
        }
      }
    },
    ['params', 'body']
  )
)

export const updateNotificationValidator = validate(
  checkSchema({
    notification_id: {
      notEmpty: {
        errorMessage: NOTIFICATIONS_MESSAGES.NOTIFICATION_ID_NOT_EMPTY
      },
      custom: {
        options: (value, { req }) => {
          if (!ObjectId.isValid(value)) {
            throw new ErrorWithStatus({
              message: NOTIFICATIONS_MESSAGES.NOTIFICATION_ID_INVALID,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }
          return true
        }
      }
    },
    title: {
      ...titleSchema,
      optional: true,
      notEmpty: undefined
    },
    content: {
      ...contentSchema,
      optional: true,
      notEmpty: undefined
    },
    start_at: {
      ...daySchema,
      optional: true,
      notEmpty: undefined,
      custom: {
        options: (value, { req }) => {
          if (new Date(value) < new Date()) {
            throw new ErrorWithStatus({
              message: NOTIFICATIONS_MESSAGES.START_AT_MUST_BE_GREATER_THAN_CURRENT_DATE,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }
          if (new Date(value) > new Date(req.body.end_at)) {
            throw new ErrorWithStatus({
              message: NOTIFICATIONS_MESSAGES.START_AT_MUST_BE_LESS_THAN_END_AT,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }
          return true
        }
      }
    },
    end_at: {
      ...daySchema,
      optional: true,
      notEmpty: undefined,
      custom: {
        options: (value, { req }) => {
          if (new Date(value) < new Date(req.body.start_at)) {
            throw new ErrorWithStatus({
              message: NOTIFICATIONS_MESSAGES.END_AT_MUST_BE_GREATER_THAN_START_AT,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }
          return true
        }
      }
    }
  })
)
