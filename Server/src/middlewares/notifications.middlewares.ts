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
  isISO8601: {
    options: {
      strict: true,
      strictSeparator: true
    },
    errorMessage: NOTIFICATIONS_MESSAGES.DAY_MUST_BE_ISO8601
  }
}

const notificationTypes = numberEnumToArray(NotificationType)
const targetTypes = numberEnumToArray(TargetType)

export const createNotificationValidator = validate(
  checkSchema({
    type: {
      isIn: {
        options: [notificationTypes],
        errorMessage: NOTIFICATIONS_MESSAGES.TYPE_INVALID
      }
    },
    title: {
      notEmpty: {
        errorMessage: NOTIFICATIONS_MESSAGES.TITLE_NOT_EMPTY
      },
      isString: {
        errorMessage: NOTIFICATIONS_MESSAGES.TITLE_MUST_BE_STRING
      }
    },
    content: {
      notEmpty: {
        errorMessage: NOTIFICATIONS_MESSAGES.CONTENT_NOT_EMPTY
      },
      isString: {
        errorMessage: NOTIFICATIONS_MESSAGES.CONTENT_MUST_BE_STRING
      }
    },
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
    start_at: daySchema,
    end_at: daySchema
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
