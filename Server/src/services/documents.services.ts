import { ObjectId } from 'mongodb'
import databaseServices from './database.services'
import { DocumentReqBody } from '~/models/requests/Document.requests'
import Document from '~/models/schemas/Document.schema'

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
}

const documentsService = new DocumentsService()
export default documentsService
