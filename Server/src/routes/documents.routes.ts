import { Router } from 'express'
import {
  createDocumentController,
  deleteDocumentController,
  getDocumentDetailController,
  getListDocumentController,
  updateDocumentController
} from '~/controllers/documents.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
  createDocumentValidator,
  documentIdValidator,
  updateDocumentValidator
} from '~/middlewares/documents.middlewares'
import { paginationValidation } from '~/middlewares/paginations.middlewares'
import { accessTokenValidator, userRuleValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { UpdateDocumentReqBody } from '~/models/requests/Document.requests'
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
 * Description: Get Document List
 * Method: GET
 * Path: /:course_id/reading
 * Headers: { Authorization?: Bearer <access token>}
 * Query: {limit: number , page: number, document_type: DocumentType}
 */

documentsRouter.get('/list', paginationValidation, wrapRequestHandler(getListDocumentController))

/**
 * Description: Get document detail
 * Method: GET
 * Path: /:document_id
 * Headers: { Authorization?: Bearer <access token>}
 */

documentsRouter.get('/:document_id', documentIdValidator, wrapRequestHandler(getDocumentDetailController))

/**
 * Description: Update document
 * Method: PATCH
 * Path: /update
 * Headers: { Authorization: Bearer <access_token> }
 * Body: UpdateDocumentReqBody
 */
documentsRouter.patch(
  '/update',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  updateDocumentValidator,
  documentIdValidator,
  filterMiddleware<UpdateDocumentReqBody>([
    'document_id',
    'type',
    'title',
    'description',
    'content',
    'thumbnails',
    'status'
  ]),
  wrapRequestHandler(updateDocumentController)
)

/**
 * Description: Delete document
 * Method: DELETE
 * Path: /delete/:document_id
 * Headers: { Authorization?: Bearer <access token>}
 */

documentsRouter.delete(
  '/delete/:document_id',
  accessTokenValidator,
  verifiedUserValidator,
  userRuleValidator,
  documentIdValidator,
  wrapRequestHandler(deleteDocumentController)
)

export default documentsRouter
