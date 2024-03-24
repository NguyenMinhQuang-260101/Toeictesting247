import { NotificationReqBody } from '~/models/requests/Notification.requests'

import databaseServices from './database.services'
import Notification from '~/models/schemas/Notification.schema'
import { ObjectId } from 'mongodb'

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
    const notification = await databaseServices.notifications.findOne({ _id: result.insertedId })
    return notification
  }
}
const notificationsService = new NotificationsService()
export default notificationsService
