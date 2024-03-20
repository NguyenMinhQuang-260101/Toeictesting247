import { Router } from 'express'
import { serveImageController, serveVideoController } from '~/controllers/medias.controllers'

const staticRouter = Router()

/**
 * Description: Serve image
 * Method: GET
 * Path: /image/:name
 * Params: name
 */
staticRouter.get('/image/:name', serveImageController)

/**
 * Description: Serve video
 * Method: GET
 * Path: /video/:name
 * Params: name
 */
staticRouter.get('/video/:name', serveVideoController)

export default staticRouter
