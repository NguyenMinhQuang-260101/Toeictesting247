import { Router } from 'express'
import {
  getNotificationDetailController,
  notificationsController,
  updateNotificationController
} from '~/controllers/notifications.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
  createNotificationValidator,
  notificationIdValidator,
  updateNotificationValidator
} from '~/middlewares/notifications.middlewares'
import { accessTokenValidator, userRuleValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { UpdateNotificationReqBody } from '~/models/requests/Notification.requests'
import { wrapRequestHandler } from '~/utils/handlers'

const notificationsRouter = Router()

/**
 * Description: Create notification
 * Method: POST
 * Path: /
 * Body: { NotificationReqBody }
 * Headers: { Authorization Bearer <access_token>}
 **/
notificationsRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  createNotificationValidator,
  wrapRequestHandler(notificationsController)
)

/**
 * Description: Get notification detail
 * Method: GET
 * Path: /:notification_id
 * Headers: { Authorization?: Bearer <access token>}
 */
notificationsRouter.get(
  '/:notification_id',
  notificationIdValidator,
  wrapRequestHandler(getNotificationDetailController)
)

/**
 * Description: Update notification
 * Method: PATCH
 * Path: /update
 * Body: { NotificationUpdateReqBody }
 * Headers: { Authorization Bearer <access token>}
 */
notificationsRouter.patch(
  '/update',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  updateNotificationValidator,
  notificationIdValidator,
  filterMiddleware<UpdateNotificationReqBody>(['notification_id', 'title', 'content', 'start_at', 'end_at']),
  wrapRequestHandler(updateNotificationController)
)

export default notificationsRouter
