import { Router } from 'express'
import { notificationsController } from '~/controllers/notifications.controllers'
import { createNotificationValidator } from '~/middlewares/notifications.middlewares'
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

export default notificationsRouter
