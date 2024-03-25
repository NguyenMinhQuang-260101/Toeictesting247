import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { NotificationReqBody } from '~/models/requests/Notification.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import notificationsService from '~/services/notifications.services'

export const notificationsController = async (
  req: Request<ParamsDictionary, any, NotificationReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await notificationsService.createNotification(user_id, req.body)
  return res.json({
    message: 'Notification created successfully',
    result
  })
}

export const getNotificationDetailController = async (req: Request, res: Response) => {
  return res.json({
    message: 'Notification detail',
    result: req.notification
  })
}
