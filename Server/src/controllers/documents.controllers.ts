import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { DocumentReqBody } from '~/models/requests/Document.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import documentsService from '~/services/documents.services'

export const createDocumentController = async (req: Request<ParamsDictionary, any, DocumentReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const document = await documentsService.createDocument(user_id, req.body)
  return res.json({
    message: 'Document created successfully',
    result: document
  })
}
