import { Router } from 'express'
import { createDocumentController, getDocumentDetailController } from '~/controllers/documents.controllers'
import { createDocumentValidator, documentIdValidator } from '~/middlewares/documents.middlewares'
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

/**
 * Description: Get document detail
 * Method: GET
 * Path: /:document_id
 * Headers: { Authorization?: Bearer <access token>}
 */

documentsRouter.get('/:document_id', documentIdValidator, wrapRequestHandler(getDocumentDetailController))

export default documentsRouter
