import { Router } from 'express'
import { getNotificationDetailController, notificationsController } from '~/controllers/notifications.controllers'
import { createNotificationValidator, notificationIdValidator } from '~/middlewares/notifications.middlewares'
import { accessTokenValidator, userRuleValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
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

export default notificationsRouter
