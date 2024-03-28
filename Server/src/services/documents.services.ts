import { ObjectId } from 'mongodb'
import databaseServices from './database.services'
import { DocumentReqBody, UpdateDocumentReqBody } from '~/models/requests/Document.requests'
import Document from '~/models/schemas/Document.schema'
import { DocumentType, OperatingStatus } from '~/constants/enums'
import { ErrorWithStatus } from '~/models/Errors'
import { DOCUMENTS_MESSAGES } from '~/constants/message'
import HTTP_STATUS from '~/constants/httpStatus'
import { get, omit } from 'lodash'

class DocumentsService {
  async createDocument(user_id: string, body: DocumentReqBody) {
    const result = await databaseServices.documents.insertOne(
      new Document({
        user_id: new ObjectId(user_id),
        type: body.type,
        title: body.title,
        description: body.description,
        content: body.content,
        tests: body.tests,
        thumbnails: body.thumbnails,
        notification: body.notification
      })
    )

    const document = await databaseServices.documents.findOne({ _id: result.insertedId })
    return document
  }

  async updateDocument(payload: UpdateDocumentReqBody, document: Document) {
    if (payload.status === OperatingStatus.Inactive && document.status === OperatingStatus.Active) {
      throw new ErrorWithStatus({
        message: DOCUMENTS_MESSAGES.INACTIVE_STATUS_CAN_ONLY_BE_SWITCHED_BY_CREATING_A_NOTIFICATION,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    if (payload.status === OperatingStatus.Active && document.notification !== null) {
      throw new ErrorWithStatus({
        message: DOCUMENTS_MESSAGES.ACTIVE_STATUS_CAN_ONLY_BE_SWITCHED_WHEN_NOTIFICATION_EXPIRED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const new_document = await databaseServices.documents.findOneAndUpdate(
      { _id: new ObjectId(payload.document_id) },
      {
        $set: {
          ...(omit(payload, ['document_id']) as UpdateDocumentReqBody)
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return new_document
  }

  async deleteDocument(document: Document) {
    if (document.status === OperatingStatus.Active) {
      throw new ErrorWithStatus({
        message: DOCUMENTS_MESSAGES.DOCUMENT_CANNOT_BE_DELETED_WHEN_IT_IS_ACTIVE,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    await Promise.all([
      document.tests.map(
        async (test) =>
          await Promise.all([
            databaseServices.questions.deleteMany({ test_id: get(test, '_id') }),
            databaseServices.tests.deleteOne({ _id: get(test, '_id') })
          ])
      ),
      databaseServices.documents.deleteOne({ _id: document._id })
    ])
  }

  async incViewsDocument(_document: Document) {
    const document = await databaseServices.documents.findOneAndUpdate(
      { _id: _document._id },
      {
        $inc: {
          user_views: 1
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return document
  }

  async getListDocument({ limit, page, document_type }: { limit: number; page: number; document_type: DocumentType }) {
    const documents = await databaseServices.documents
      .aggregate<Document>([
        {
          $match: {
            type: document_type
          }
        },
        {
          $skip: limit * (page - 1) // Công thức phân trang
        },
        {
          $limit: limit
        }
      ])
      .toArray()
    const total = await databaseServices.documents.countDocuments({ type: document_type })
    return {
      documents,
      total
    }
  }
}

const documentsService = new DocumentsService()
export default documentsService
