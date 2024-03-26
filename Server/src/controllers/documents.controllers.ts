import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { DocumentReqBody, UpdateDocumentReqBody } from '~/models/requests/Document.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import documentsService from '~/services/documents.services'
import Document from '~/models/schemas/Document.schema'

export const createDocumentController = async (req: Request<ParamsDictionary, any, DocumentReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const document = await documentsService.createDocument(user_id, req.body)
  return res.json({
    message: 'Document created successfully',
    result: document
  })
}

export const getDocumentDetailController = async (req: Request, res: Response) => {
  return res.json({
    message: 'Get document detail successfully',
    result: req.document
  })
}

export const updateDocumentController = async (
  req: Request<ParamsDictionary, any, UpdateDocumentReqBody>,
  res: Response
) => {
  const { body } = req
  const document = await documentsService.updateDocument(body, req.document as Document)

  return res.json({
    message: 'Document updated successfully',
    result: document
  })
}

export const deleteDocumentController = async (req: Request, res: Response) => {
  await documentsService.deleteDocument(req.document as Document)
  return res.json({
    message: 'Document deleted successfully'
  })
}
