import { Router } from 'express'
import { uploadAudioController, uploadImageController, uploadVideoController } from '~/controllers/medias.controllers'
import { accessTokenValidator, userRuleValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const mediasRouter = Router()

/**
 * Description: Upload image
 * Route: POST /upload-image
 * body: { image: File }
 */
mediasRouter.post(
  '/upload-image',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  wrapRequestHandler(uploadImageController)
)

/**
 * Description: Upload audio
 * Route: POST /upload-audio
 * body: { audio: File }
 */
mediasRouter.post(
  '/upload-audio',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  wrapRequestHandler(uploadAudioController)
)

/**
 * Description: Upload a simple video
 * Route: POST /upload-image
 * body: { video: File }
 */
mediasRouter.post(
  '/upload-video',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  wrapRequestHandler(uploadVideoController)
)

export default mediasRouter
