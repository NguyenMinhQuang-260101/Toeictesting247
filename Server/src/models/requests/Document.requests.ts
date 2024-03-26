import { DocumentType, OperatingStatus } from '~/constants/enums'
import { Media } from '../Other'

export interface DocumentReqBody {
  type: DocumentType
  title: string
  description: string
  content: string
  tests: string[]
  thumbnails: Media[]
  notification: null | string
  status: OperatingStatus
}

export interface UpdateDocumentReqBody {
  document_id: string
  type?: DocumentType
  title?: string
  description?: string
  content?: string
  thumbnails?: Media[]
  status?: OperatingStatus
}
