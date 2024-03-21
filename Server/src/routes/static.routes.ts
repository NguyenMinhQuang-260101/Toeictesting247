import { Router } from 'express'
import {
  serveAudioStreamController,
  serveImageController,
  serveVideoStreamController
} from '~/controllers/medias.controllers'

const staticRouter = Router()

/**
 * Description: Serve image
 * Method: GET
 * Path: /image/:name
 * Params: name
 */
staticRouter.get('/image/:name', serveImageController)

/**
 * Description: Serve audio stream
 * Method: GET
 * Path: /audio/:name
 * Params: name
 */
staticRouter.get('/audio-stream/:name', serveAudioStreamController)

/**
 * Description: Serve video stream
 * Method: GET
 * Path: /video/:name
 * Params: name
 */
staticRouter.get('/video-stream/:name', serveVideoStreamController)

export default staticRouter
