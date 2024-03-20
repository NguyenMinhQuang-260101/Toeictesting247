import { Router } from 'express'
import { uploadImageController } from '~/controllers/medias.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const mediasRouter = Router()

/**
 * Description: Upload a single image
 * Route: POST /upload-image
 * body: { image: File }
 */
mediasRouter.post('/upload-image', wrapRequestHandler(uploadImageController))

export default mediasRouter
