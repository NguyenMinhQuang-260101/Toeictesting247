import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { DocumentReqBody, UpdateDocumentReqBody } from '~/models/requests/Document.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import documentsService from '~/services/documents.services'
import Document from '~/models/schemas/Document.schema'
import { DocumentType } from '~/constants/enums'

export const createDocumentController = async (req: Request<ParamsDictionary, any, DocumentReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const document = await documentsService.createDocument(user_id, req.body)
  return res.json({
    message: 'Document created successfully',
    result: document
  })
}

export const getListDocumentController = async (req: Request, res: Response) => {
  const document_type = Number(req.query.document_type as string) as DocumentType
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const { total, documents } = await documentsService.getListDocument({
    document_type,
    limit,
    page
  })
  return res.json({
    message: 'Get list document successfully',
    result: {
      documents,
      document_type,
      limit,
      page,
      total_page: Math.ceil(total / limit)
    }
  })
}

export const getDocumentDetailController = async (req: Request, res: Response) => {
  const incViewsDocument = await documentsService.incViewsDocument(req.document as Document)
  return res.json({
    message: 'Get document detail successfully',
    result: incViewsDocument
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
