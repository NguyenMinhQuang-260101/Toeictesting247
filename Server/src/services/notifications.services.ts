import { NotificationReqBody, UpdateNotificationReqBody } from '~/models/requests/Notification.requests'

import databaseServices from './database.services'
import Notification from '~/models/schemas/Notification.schema'
import { ObjectId, WithId } from 'mongodb'
import { forEach, omit } from 'lodash'
import { NotificationType, OperatingStatus, TargetType } from '~/constants/enums'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { NOTIFICATIONS_MESSAGES } from '~/constants/message'

class NotificationsService {
  async createNotification(user_id: string, body: NotificationReqBody) {
    const result = await databaseServices.notifications.insertOne(
      new Notification({
        user_id: new ObjectId(user_id),
        type: body.type,
        title: body.title,
        content: body.content,
        target_type: body.target_type,
        targets: body.targets,
        start_at: new Date(body.start_at),
        end_at: new Date(body.end_at)
      })
    )
    // Nếu là notification update thì cần update notification cho các course/document
    if (body.type === NotificationType.Update) {
      const failedTargets: ObjectId[] = []
      const notification = await databaseServices.notifications.findOne({ _id: result.insertedId })
      const targets = (notification as WithId<Notification>).targets.map(
        (target: any) => new ObjectId(target as string)
      )
      if (body.target_type === TargetType.Course) {
        const courses = await databaseServices.courses.find({ _id: { $in: targets } }).toArray()
        forEach(courses, async (course) => {
          if (course.notification === null && course.status !== OperatingStatus.Inactive) {
            await databaseServices.courses.updateOne({ _id: course._id }, { $set: { notification: result.insertedId } })
          } else {
            failedTargets.push(course._id)
          }
        })
      }

      if (failedTargets.length > 0) {
        const failedTargets_tamp = failedTargets.map((target) => target.toString())

        // Xóa tất cả các phần tử trong mảng failedTargets
        failedTargets.splice(0)

        // Xóa notification vừa tạo
        await databaseServices.notifications.deleteOne({ _id: result.insertedId })

        throw new ErrorWithStatus({
          message: `Cannot add notification to course(s) or document(s) with ID(s): ${failedTargets_tamp.join(', ')}: \n Case 1: The course is in Inactive state so there is no need to create notifications. \n Case 2: Course is updating. Please wait for the course to be updated.`,
          status: HTTP_STATUS.INTERNAL_SERVER_ERROR
        })
      }
      if (databaseServices.watchTimeFieldsRunning) {
        console.log('watchTimeFields is already running.')
        return notification
      }
      await databaseServices.watchTimeFields()
      return notification
    }
  }

  async updateNotification(notification: Notification, payload: UpdateNotificationReqBody) {
    const _payload = Object.fromEntries(
      Object.entries(payload)
        .filter(([key, value]) => value !== undefined && value !== null)
        .map(([key, value]) => {
          if (key === 'notification_id') return [key, new ObjectId(value)]
          if (key === 'start_at' || key === 'end_at') return [key, new Date(value)]
          return [key, value]
        })
    )

    if (notification.end_at < new Date()) {
      throw new ErrorWithStatus({
        message: NOTIFICATIONS_MESSAGES.CANNOT_UPDATE_NOTIFICATION_HAS_EXPIRED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const new_notification = await databaseServices.notifications.findOneAndUpdate(
      { _id: new ObjectId(payload.notification_id) },
      {
        $set: {
          ...(omit(_payload, ['notification_id']) as UpdateNotificationReqBody & {
            notification_id?: ObjectId
            start_at?: Date
            end_at?: Date
          })
        },
        $currentDate: { updated_at: true }
      },
      { returnDocument: 'after' }
    )
    return new_notification
  }
}

const notificationsService = new NotificationsService()
export default notificationsService
