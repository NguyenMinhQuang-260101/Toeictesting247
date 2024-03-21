import { Router } from 'express'
import { serveImageController, serveVideoStreamController } from '~/controllers/medias.controllers'

const staticRouter = Router()

/**
 * Description: Serve image
 * Method: GET
 * Path: /image/:name
 * Params: name
 */
staticRouter.get('/image/:name', serveImageController)

/**
 * Description: Serve video stream
 * Method: GET
 * Path: /video/:name
 * Params: name
 */
staticRouter.get('/video-stream/:name', serveVideoStreamController)

export default staticRouter
