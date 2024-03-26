import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { NotificationReqBody, UpdateNotificationReqBody } from '~/models/requests/Notification.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import Notification from '~/models/schemas/Notification.schema'
import notificationsService from '~/services/notifications.services'

export const createNotificationsController = async (
  req: Request<ParamsDictionary, any, NotificationReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const notification = await notificationsService.createNotification(user_id, req.body)

  return res.json({
    message: 'Notification created successfully',
    result: notification
  })
}

export const getNotificationDetailController = async (req: Request, res: Response) => {
  return res.json({
    message: 'Notification detail',
    result: req.notification
  })
}

export const updateNotificationController = async (
  req: Request<ParamsDictionary, any, UpdateNotificationReqBody>,
  res: Response
) => {
  const notification = await notificationsService.updateNotification(req.notification as Notification, req.body)
  return res.json({
    message: 'Notification updated successfully',
    result: notification
  })
}
