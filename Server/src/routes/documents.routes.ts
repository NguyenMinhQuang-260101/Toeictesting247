import { Router } from 'express'
import { createDocumentController } from '~/controllers/documents.controllers'
import { createDocumentValidator } from '~/middlewares/documents.middlewares'
import { accessTokenValidator, userRuleValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const documentsRouter = Router()

/**
 * Description: Create Document
 * Method: POST
 * Path: /
 * Body: { DocumentReqBody }
 * Headers: { Authorization Bearer <access_token>}
 */
documentsRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  createDocumentValidator,
  wrapRequestHandler(createDocumentController)
)

export default documentsRouter
